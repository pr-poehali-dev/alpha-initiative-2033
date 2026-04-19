import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", city: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="download" className="bg-neutral-950 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            НАЧНИ<br />БЕЖАТЬ<br />СЕГОДНЯ
          </h2>
          <p className="text-neutral-400 text-lg mb-8">
            Зарегистрируйся и первым получи доступ к RunMap — приложению, которое превращает
            каждую пробежку в завоёванную территорию.
          </p>
          <div className="flex flex-col gap-3 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              Бесплатный доступ на старте
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              Уведомление о запуске на почту
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              Без спама — только важное
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          {submitted ? (
            <div className="border border-orange-500 p-8 text-center">
              <div className="text-4xl mb-4">🏃</div>
              <h3 className="text-2xl font-bold mb-2">Отлично!</h3>
              <p className="text-neutral-400">Мы сообщим тебе о запуске. Продолжай бегать!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">Имя</label>
                <input
                  type="text"
                  required
                  placeholder="Алексей"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-neutral-600"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-neutral-600"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">Город</label>
                <input
                  type="text"
                  placeholder="Москва"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-neutral-600"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-4 text-sm uppercase tracking-wide font-semibold hover:bg-orange-400 transition-colors duration-300 cursor-pointer mt-2"
              >
                Получить ранний доступ
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
