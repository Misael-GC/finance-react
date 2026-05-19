import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="text-cyan-500 text-9xl mb-4 opacity-50">
        <svg className="w-32 h-32 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
        Error 404
      </h1>
      <p className="mt-4 text-lg text-slate-500 max-w-md mx-auto">
        La página que intentas consultar no existe o ha sido movida temporalmente.
      </p>
      
      <div className="mt-8 flex justify-center gap-4">
        <NavLink 
          to="/" 
          className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          Ir al Inicio
        </NavLink>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
        >
          Regresar
        </button>
      </div>
    </div>
  );
}