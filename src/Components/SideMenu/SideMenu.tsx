import { NavLink } from 'react-router-dom';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  return (
    <aside className={`
      /* Capa base: Estructura, contención y transición fluida */
      bg-slate-900 text-white flex flex-col z-50
      transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
      
      /* Comportamiento Móvil: Fijo y superpuesto (Overlay) */
      fixed inset-y-0 left-0 h-full
      ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
      
      /* Comportamiento Escritorio (md+): En flujo de Flexbox empujando (Push) */
      md:relative md:translate-x-0
      ${isOpen ? 'md:w-64' : 'md:w-0 md:border-none'}
    `}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700 min-w-[16rem]">
        <h1 className="text-xl font-bold">MarketTrack</h1>
        
        {/* Botón de cerrar interno: Sigue siendo solo visible en móvil */}
        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white md:hidden focus:outline-none"
          aria-label="Cerrar menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 min-w-[16rem]">
        <NavLink to="/" onClick={onClose} className="block px-4 py-2 rounded hover:bg-slate-800">🏠 Dashboard Principal</NavLink>
        <NavLink to="/my-account" onClick={onClose} className="block px-4 py-2 rounded hover:bg-slate-800">📈 Mercado Local</NavLink>
        <NavLink to="/sig-in" onClick={onClose} className="block px-4 py-2 rounded hover:bg-slate-800">🌎 Entorno Macro</NavLink>
      </nav>
    </aside>
  );
}