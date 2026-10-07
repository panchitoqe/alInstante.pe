# Agencia de Empleos Al Instante

Landing page estática, adaptable a móviles y sin dependencias de instalación.

El símbolo de marca está en `logo-al-instante.svg` y se usa en el encabezado y el pie de página.

## Ver el sitio

Abre `index.html` en un navegador o sirve esta carpeta desde un servidor estático.

## Agregar o actualizar convocatorias

Edita `jobs.js` y agrega cada oferta como un objeto dentro de `window.JOB_LISTINGS`. El ejemplo comentado en ese archivo muestra todos los campos admitidos:

- `slug`: enlace individual, por ejemplo `asistente-administrativo-arequipa`.
- `puesto`, `empresa`, `sector`, `ubicacion`, `sueldo`, `horario`, `vacantes` y `fecha`.
- `requisitos` y `beneficios`: listas de texto.
- `contacto`: mensaje que se preparará para WhatsApp al consultar/postular.

Las ofertas se muestran en la sección Empleos, aparecen en la búsqueda y el filtro por sector, y se pueden compartir desde su detalle. Al retirar una oferta, quítala de la lista y vuelve a publicar el archivo actualizado.

## Antes de publicar

- Reemplaza los enlaces generales de Facebook, Instagram y TikTok por los perfiles oficiales cuando estén definidos.
- Agrega el correo electrónico cuando esté disponible.
- Sustituye las fotografías de Unsplash por imágenes autorizadas de la agencia si lo prefieren.
- Para administración de ofertas desde un panel web sin editar archivos, hace falta conectar un CMS o backend; esta versión permite mantener las convocatorias editando un único archivo sencillo.

El formulario prepara el mensaje y abre WhatsApp; no almacena ni envía datos a un servidor.
