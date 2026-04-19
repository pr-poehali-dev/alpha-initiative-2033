import { useState } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/a3902d18-d93a-4dc9-8913-64026ee38f90";

interface Registration {
  id: number;
  name: string;
  email: string;
  city: string;
  created_at: string;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const fetchRegistrations = async (pwd: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: { "X-Admin-Password": pwd },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Ошибка доступа");
        setAuthed(false);
      } else {
        setData(json.registrations);
        setTotal(json.total);
        setAuthed(true);
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations(password);
  };

  const filtered = data.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase())
  );

  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-white text-3xl font-bold tracking-tight mb-2">RUNMAP</h1>
            <p className="text-neutral-500 text-sm uppercase tracking-widest">Панель администратора</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-neutral-400 block mb-2">Пароль</label>
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-neutral-600"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-6 py-3 text-sm uppercase tracking-wide font-semibold hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold tracking-tight">RUNMAP <span className="text-neutral-500 font-normal text-sm">/ Заявки</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-400">{total}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wide">заявок</p>
          </div>
          <button
            onClick={() => fetchRegistrations(password)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Обновить"
          >
            <Icon name="RefreshCw" size={18} />
          </button>
          <button
            onClick={() => { setAuthed(false); setData([]); setPassword(""); }}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Выйти"
          >
            <Icon name="LogOut" size={18} />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto">
        <div className="mb-6 relative">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Поиск по имени, email, городу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-neutral-600"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-neutral-600">
            <Icon name="Inbox" size={40} className="mx-auto mb-4" />
            <p>{search ? "Ничего не найдено" : "Заявок пока нет"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500 text-xs uppercase tracking-widest">
                  <th className="text-left py-3 pr-6">#</th>
                  <th className="text-left py-3 pr-6">Имя</th>
                  <th className="text-left py-3 pr-6">Email</th>
                  <th className="text-left py-3 pr-6">Город</th>
                  <th className="text-left py-3">Дата</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-b border-neutral-900 hover:bg-neutral-900 transition-colors"
                  >
                    <td className="py-4 pr-6 text-neutral-600">{i + 1}</td>
                    <td className="py-4 pr-6 font-medium text-white">{r.name}</td>
                    <td className="py-4 pr-6 text-neutral-400">
                      <a href={`mailto:${r.email}`} className="hover:text-orange-400 transition-colors">
                        {r.email}
                      </a>
                    </td>
                    <td className="py-4 pr-6 text-neutral-400">{r.city}</td>
                    <td className="py-4 text-neutral-600 text-xs">{r.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {search && (
              <p className="text-neutral-600 text-xs mt-4 text-right">
                Показано {filtered.length} из {total}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
