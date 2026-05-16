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