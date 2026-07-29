import { useUI } from '../../Context/UIContext';

export default function Navbar() {
  const { toggleMenu, theme, toggleTheme } = useUI();
  return (
    <header className="h-16 bg-white dark:bg-[#131823] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 z-10 transition-colors">
      <div className="flex items-center space-x-3 w-full md:w-1/3">
        {/* Botón para abrir el menú lateral en móviles */}
        {/* <input 
          type="text" 
          placeholder="Buscar emisora (ej. AMXZACTO)..." 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        /> */}
      </div>
      <div className="flex items-center space-x-4">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none transition-colors"
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.22 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-4.22a1 1 0 010-1.415l-.708-.708a1 1 0 011.414-1.414l.708.708a1 1 0 01-1.414 1.414zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm4.22-4.22a1 1 0 011.415 0l.708.708a1 1 0 11-1.414 1.414L5.512 6.495A1 1 0 015.512 5.08zM10 6a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
               <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <button 
          onClick={toggleMenu}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none"
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