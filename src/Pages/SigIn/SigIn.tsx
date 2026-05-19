export default function SigIn() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí conectarías tu servicio de autenticación (SOLID: Inyección de dependencias)
  };

  return (
    <div className="flex min-h-[80vh] w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200">
      
      {/* Mitad Izquierda: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bienvenido de nuevo</h1>
            <p className="mt-2 text-slate-500">Por favor, ingresa tus credenciales para acceder a Market-Track.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
              <input 
                id="email" 
                type="email" 
                required 
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
              <input 
                id="password" 
                type="password" 
                required 
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>

      {/* Mitad Derecha: Branding (Oculto en móviles) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 border-l border-slate-200 items-center justify-center p-12">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto bg-cyan-100 rounded-full flex items-center justify-center mb-8">
            <span className="text-cyan-600 text-6xl">📊</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Análisis Financiero Avanzado</h2>
          <p className="mt-4 text-slate-600 max-w-sm mx-auto">
            Accede a métricas en tiempo real, gráficas técnicas y exportación de datos del mercado.
          </p>
        </div>
      </div>

    </div>
  );
}