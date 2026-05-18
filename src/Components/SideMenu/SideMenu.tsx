import { NavLink } from 'react-router-dom';

export default function SideMenu() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-xl font-bold">MarketTrack</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* NavLink permite saber si la ruta está activa para cambiarle el estilo [5, 6] */}
        <NavLink to="/" className="block px-4 py-2 rounded hover:bg-slate-800">🏠 Dashboard Principal</NavLink>
        <NavLink to="/my-accoun" className="block px-4 py-2 rounded hover:bg-slate-800">📈 Mercado Local</NavLink>
        <NavLink to="/sig-in" className="block px-4 py-2 rounded hover:bg-slate-800">🌎 Entorno Macro</NavLink>
      </nav>
    </aside>
  );
}