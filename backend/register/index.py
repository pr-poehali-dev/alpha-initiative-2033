import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ADMIN_EMAIL = "Yudinads@yandex.ru"
SMTP_FROM = "Yudinads@yandex.ru"


def send_notification(name: str, email: str, city: str, reg_id: int):
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    if not smtp_password:
        return

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"RunMap: новая заявка от {name}"
    msg['From'] = f"RunMap <{SMTP_FROM}>"
    msg['To'] = ADMIN_EMAIL

    city_str = city if city else '—'
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 4px;">
      <h2 style="color: #f97316; font-size: 20px; margin: 0 0 24px;">🏃 Новая заявка на RunMap</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #737373; font-size: 12px; padding: 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">Имя</td>
          <td style="color: #fff; font-size: 15px; padding: 8px 0; font-weight: 600;">{name}</td>
        </tr>
        <tr>
          <td style="color: #737373; font-size: 12px; padding: 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
          <td style="padding: 8px 0;"><a href="mailto:{email}" style="color: #f97316; font-size: 15px;">{email}</a></td>
        </tr>
        <tr>
          <td style="color: #737373; font-size: 12px; padding: 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">Город</td>
          <td style="color: #fff; font-size: 15px; padding: 8px 0;">{city_str}</td>
        </tr>
        <tr>
          <td style="color: #737373; font-size: 12px; padding: 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">ID заявки</td>
          <td style="color: #525252; font-size: 13px; padding: 8px 0;">#{reg_id}</td>
        </tr>
      </table>
      <div style="margin-top: 32px; border-top: 1px solid #262626; padding-top: 16px;">
        <a href="https://poehali.dev" style="color: #525252; font-size: 12px; text-decoration: none;">Все заявки — в панели администратора /admin</a>
      </div>
    </div>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(SMTP_FROM, smtp_password)
        server.sendmail(SMTP_FROM, ADMIN_EMAIL, msg.as_string())


def handler(event: dict, context) -> dict:
    """Сохраняет заявку на ранний доступ и отправляет уведомление администратору."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    body = json.loads(event.get('body') or '{}')
    name = (body.get('name') or '').strip()
    email = (body.get('email') or '').strip()
    city = (body.get('city') or '').strip()

    if not name or not email:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и email обязательны'})
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT id FROM registrations WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 409,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Этот email уже зарегистрирован'})
        }

    cur.execute(
        "INSERT INTO registrations (name, email, city) VALUES (%s, %s, %s) RETURNING id",
        (name, email, city or None)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    send_notification(name, email, city, row[0])

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': row[0]})
    }
