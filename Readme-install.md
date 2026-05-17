## Comando para instalar con pnpm

```bash
# Forzamos la ejecución de create-vite en una versión previa (ej. v5 o v6)
pnpm dlx create-vite@6 mi-proyecto-seguro --template react-ts

```

Una vez que el comando finalice con éxito (ya sea mediante la actualización de Node o usando la versión previa), recuerda seguir los pasos de seguridad que definimos anteriormente antes de instalar los paquetes:

1. Entra al directorio: `cd mi-proyecto-seguro`
2. Crea tu archivo `.npmrc` restrictivo con `ignore-scripts=true`.
3. Ejecuta el definitivo `pnpm install`.

----

El archivo `.npmrc` es simplemente un archivo de texto plano (como un bloc de notas) que se guarda dentro de la carpeta de tu proyecto. El punto al principio del nombre (`.npmrc`) significa que es un archivo oculto en Linux, pero las herramientas de desarrollo como `pnpm` lo leen automáticamente.

Sigue estos 3 pasos exactos en tu terminal:

### Paso 1: Asegúrate de estar dentro de la carpeta de tu proyecto

Si tu proyecto se llama `mi-proyecto-seguro`, entra a la carpeta ejecutando:

```bash
cd mi-proyecto-seguro

```

### Paso 2: Crear y escribir el archivo con un solo comando

Copia y pega el siguiente bloque de comandos en tu terminal y presiona **Enter**. Este comando creará el archivo automáticamente e inyectará las reglas de seguridad dentro de él:

```bash
cat <<EOF > .npmrc
verify-store-integrity=true
ignore-scripts=true
minimum-release-age=120
EOF

```

### Paso 3: Verificar que el archivo se creó correctamente

Como es un archivo oculto, si usas solo `ls` no lo verás. Para comprobar que se creó y ver su contenido, ejecuta:

```bash
cat .npmrc

```

En tu pantalla debería aparecer exactamente esto:

```text
verify-store-integrity=true
ignore-scripts=true
minimum-release-age=120

```

---

### ¿Qué acabas de hacer? (Explicación técnica)

Al poner `ignore-scripts=true` dentro de ese archivo, le has puesto un "chaleco antibalas" a tu proyecto. Ahora, cuando ejecutes `pnpm install`, si alguna de las librerías de React o Vite viniera infectada con un script malicioso que intente hackear tu sistema Linux, `pnpm` simplemente **lo ignorará y no lo dejará ejecutarse**.

Ahora que el archivo está listo, ya puedes ejecutar con total seguridad:

```bash
pnpm install

```

----

Para instalar **Tailwind CSS** en tu nuevo proyecto de React + Vite usando `pnpm`, debemos seguir manteniendo la misma línea de seguridad estricta que configuramos en el archivo `.npmrc`.

Dado que estamos usando la arquitectura moderna de Vite y React, utilizaremos el nuevo motor **Tailwind CSS v4**, el cual ya no requiere archivos de configuración complejos como `tailwind.config.js` ni `postcss.config.js`, sino que se integra nativamente mediante un plugin de Vite. Esto reduce la superficie de ataque y hace el código mucho más limpio.

Sigue estos pasos estructurados en tu terminal de Linux:

---

## 1. Instalar Tailwind CSS y su plugin de Vite

Asegúrate de estar en la raíz de tu proyecto y ejecuta el siguiente comando para instalar Tailwind y su integración oficial para Vite como dependencias de desarrollo (`-D`):

```bash
pnpm add -D tailwindcss @tailwindcss/vite

```

---

## 2. Configurar el Plugin en Vite (`vite.config.ts`)

Abre el archivo `vite.config.ts` que se encuentra en la raíz de tu proyecto. Vamos a importar el plugin de Tailwind y añadirlo a la propiedad `plugins`.

Tu archivo debe quedar estructurado de la siguiente manera:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Importar el plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Inyectar el plugin en el bundler
  ],
})

```

---

## 3. Importar Tailwind en tu CSS (`src/index.css`)

Abre el archivo de estilos principales de tu aplicación, que usualmente es `src/index.css`.

Borra todo el contenido de demostración que Vite crea por defecto y coloca únicamente la siguiente directiva en la primera línea. En Tailwind v4, esto es todo lo que necesitas para importar todo el framework:

```css
@import "tailwindcss";

```

---

## 4. Limpieza de Componentes y Prueba de Funcionamiento

Para verificar que todo esté acoplado correctamente y los estilos CSS se estén procesando bien, edita tu archivo `src/App.tsx`. Reemplaza su contenido con este componente limpio para probar las clases utilitarias de Tailwind:

```tsx
export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <div className="rounded-xl bg-slate-800 p-8 shadow-2xl border border-slate-700 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-cyan-400 mb-2">
          ¡React + Vite + Tailwind Listo!
        </h1>
        <p className="text-slate-400 font-medium">
          Entorno de desarrollo blindado y optimizado con <code className="text-amber-400 font-mono">pnpm</code> en Linux.
        </p>
      </div>
    </div>
  )
}

```

---

## 5. Levantar el Servidor de Desarrollo

Ahora puedes arrancar tu entorno local en Linux ejecutando:

```bash
pnpm dev

```

Abre el enlace que te provee la terminal (normalmente `http://localhost:5173`) en tu navegador. Deberías ver una tarjeta estilizada con fondo oscuro, tipografía moderna y bordes perfectos.

### Un último consejo de seguridad

Al instalar dependencias nuevas, es una excelente práctica como ingeniero correr el auditor que preparamos en tus *aliases* de Linux para asegurar que ninguna sub-dependencia de Tailwind haya introducido alertas:

```bash
pnpm audit

```


----
## INSTALAR DEPENDENCIAS
```bash
pnpm install -g react-devtools

pnpm install -D babel-plugin-react-compiler@rc eslint-plugin-react-hooks@^6.0.0-rc.1

```
