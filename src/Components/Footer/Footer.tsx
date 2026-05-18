import { NavLink } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Clases utilitarias reutilizables para los enlaces con estado activo/hover sutil
  const linkStyles = ({ isActive }: { isActive: boolean }) => 
    `text-sm transition-colors duration-200 block py-1 ${
      isActive 
        ? 'text-cyan-400 font-medium' 
        : 'text-slate-400 hover:text-white font-normal'
    }`;

  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Grid Principal - Diseño Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Columna 1: Branding / Identidad */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold text-white tracking-tight">
                Plataforma<span className="text-cyan-400">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Entorno analítico y de desarrollo optimizado para el procesamiento seguro de datos financieros y de infraestructura.
            </p>
          </div>

          {/* Columna 2: Navegación Principal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Aplicación
            </h4>
            <ul className="space-y-1">
              <li>
                <NavLink to="/" className={linkStyles}>Inicio</NavLink>
              </li>
              <li>
                <NavLink to="/my-account" className={linkStyles}>Mi Cuenta</NavLink>
              </li>
              <li>
                <NavLink to="/sig-in" className={linkStyles}>Iniciar Sesión</NavLink>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte / Recursos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Recursos
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#docs" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 block py-1">
                  Documentación
                </a>
              </li>
              <li>
                <a href="#audit" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 block py-1">
                  Auditoría de Red
                </a>
              </li>
              <li>
                <a href="#status" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 block py-1">
                  Estado del Servidor
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Seguridad y Cumplimiento */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Seguridad
            </h4>
            <div className="rounded-xl bg-slate-800/40 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-bold">Modo Strict pnpm</span>
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Verificación de hashes de dependencias activa. Scripts de terceros deshabilitados en tiempo de construcción.
              </p>
            </div>
          </div>

        </div>

        {/* Separador Inferior */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {currentYear} Plataforma Segura. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacidad</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Términos</a>
            <a href="#logs" className="hover:text-slate-400 transition-colors font-mono">v1.0.0-stable</a>
          </div>
        </div>

      </div>
    </footer>
  );
}