import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает список всех заявок на ранний доступ. Требует пароль администратора."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    headers = event.get('headers') or {}
    password = headers.get('X-Admin-Password') or headers.get('x-admin-password') or ''
    admin_password = os.environ.get('ADMIN_PASSWORD', '')

    if not admin_password or password != admin_password:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный пароль'})
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, city, created_at FROM registrations ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    registrations = [
        {
            'id': r[0],
            'name': r[1],
            'email': r[2],
            'city': r[3] or '—',
            'created_at': r[4].strftime('%d.%m.%Y %H:%M') if r[4] else '—'
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'registrations': registrations, 'total': len(registrations)})
    }
