//import { Navbar } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center w-1/3">
        <input 
          type="text" 
          placeholder="Buscar emisora (ej. AMXZACTO)..." 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-slate-500">🪙 Créditos: 195,400</span>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>
    </header>
  );
}