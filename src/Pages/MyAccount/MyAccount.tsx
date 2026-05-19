export default function MyAccount() {
  return (
    <div className="max-w-5xl mx-auto w-full py-8 space-y-6">
      
      {/* Cabecera de la página */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mi Cuenta</h1>
          <p className="text-slate-500 mt-1">Gestiona tu información personal y credenciales de API.</p>
        </div>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors border border-slate-300">
          Cerrar Sesión
        </button>
      </div>

      {/* Grid de contenido modular */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta de Perfil */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Personal</h3>
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xl font-bold">
              US
            </div>
            <div>
              <p className="text-slate-900 font-medium">Usuario Estándar</p>
              <p className="text-slate-500 text-sm">usuario@dominio.com</p>
            </div>
          </div>
          <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
            Actualizar datos →
          </button>
        </div>

        {/* Tarjeta de Estado / Créditos */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Plan Actual</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Pro Activo
            </span>
          </div>
          <div className="mt-6">
            <p className="text-sm text-slate-500 mb-1">Consultas a la API este mes</p>
            <p className="text-3xl font-bold text-slate-900">12,450 <span className="text-sm font-normal text-slate-500">/ 50k</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}