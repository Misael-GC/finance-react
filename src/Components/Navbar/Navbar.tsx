interface NavbarProps {
  onToggleMenu: () => void;
}

export default function Navbar({ onToggleMenu }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-10">
      <div className="flex items-center space-x-3 w-full md:w-1/3">
        {/* Botón para abrir el menú lateral en móviles */}
        <input 
          type="text" 
          placeholder="Buscar emisora (ej. AMXZACTO)..." 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleMenu}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 focus:outline-none"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* <span className="text-sm font-medium text-slate-500">🪙 Créditos: 195,400</span> */}
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>
    </header>
  );
}