// src/Pages/Documentos/Documentos.tsx
import React, { useState, changeEvent, FormEvent } from 'react';
import { documentoService } from '../../Services/documentoService';

type TipoRegistro = 'local' | 'drive';

export const DocumentosPage: React.FC = () => {
  // Estados para los campos básicos del formulario
  const [codigo, setCodigo] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  
  // Estado para controlar qué opción visualiza el usuario
  const [tipoRegistro, setTipoRegistro] = useState<TipoRegistro>('local');
  
  // Estados para los valores del documento
  const [archivo, setArchivo] = useState<File | null>(null);
  const [enlaceDrive, setEnlaceDrive] = useState<string>('');

  // Estados de UI para carga y mensajes de feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const handleFileChange = (e: changeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    // Creamos el contenedor FormData requerido para interactuar con la API
    const formData = new FormData();
    formData.append('codigo', codigo);
    formData.append('nombre', nombre);

    // Dependiendo de la selección del usuario, adjuntamos el archivo o el texto
    if (tipoRegistro === 'local') {
      if (!archivo) {
        setMensaje({ tipo: 'error', texto: 'Por favor, selecciona un archivo válido.' });
        setLoading(false);
        return;
      }
      formData.append('archivo', archivo);
    } else {
      if (!enlaceDrive.trim()) {
        setMensaje({ tipo: 'error', texto: 'Por favor, introduce el link de Google Drive.' });
        setLoading(false);
        return;
      }
      formData.append('enlace', enlaceDrive);
    }

    try {
      await documentoService.crearDocumento(formData);
      setMensaje({ tipo: 'success', texto: '¡Documento registrado y procesado con éxito!' });
      
      // Limpiamos el formulario tras un envío exitoso
      setCodigo('');
      setNombre('');
      setArchivo(null);
      setEnlaceDrive('');
    } catch (error: any) {
      // Capturamos las validaciones detalladas que configuramos en el Serializer de Django
      const errorDetail = error && typeof error === 'object' 
        ? Object.values(error).flat().join(' ') 
        : 'Hubo un problema al conectar con el servidor.';
      setMensaje({ tipo: 'error', texto: `Error: ${errorDetail}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 mt-10">
      <h2 className="text-2xl font-bold mb-2 text-zinc-800 dark:text-zinc-100">
        Gestión de Documentos
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Registra un archivo local en el servidor o vincula directamente un elemento desde Google Drive.
      </p>

      {mensaje && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${
          mensaje.tipo === 'success' 
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900' 
            : 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campo Código */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Código del Documento *
          </label>
          <input
            type="text"
            required
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ej: DOC-2026-A"
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Nombre descriptivo *
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Factura de Proveedores u Operaciones"
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Pestañas de Selección de Modo */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Método de Almacenamiento
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <button
              type="button"
              onClick={() => setTipoRegistro('local')}
              className={`py-2 text-sm font-medium rounded-md transition-all ${
                tipoRegistro === 'local'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Subir Archivo Local
            </button>
            <button
              type="button"
              onClick={() => setTipoRegistro('drive')}
              className={`py-2 text-sm font-medium rounded-md transition-all ${
                tipoRegistro === 'drive'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Enlace de Google Drive
            </button>
          </div>
        </div>

        {/* Campos Condicionales */}
        <div className="p-4 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50">
          {tipoRegistro === 'local' ? (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Selecciona Archivo (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
                className="w-full text-sm text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-zinc-800 dark:file:text-zinc-200 file:cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Enlace Compartido de Google Drive
              </label>
              <input
                type="url"
                value={enlaceDrive}
                onChange={(e) => setEnlaceDrive(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
};