# Variedades Caseras - Sitio Web

Sitio web sobrio, de estilo editorial gastronomico y optimizado para **Variedades Caseras** (Leandro N. Alem, Misiones, Argentina), emprendimiento dedicado exclusivamente a sus especialidades caseras congeladas:

1. **Empanaditas (Risoles)** (congeladas y listas para freir, no para horno: carne, pollo, choclo, acelga, jamon y queso).
2. **Ñoquis** (pasta artesanal con estrías tradicionales, congelada y sellada).
3. **Varenikes** (de ricota o de papa con cebolla caramelizada, congelados y sellados).
4. **Milanesas de berenjena** (rebozadas, congeladas y selladas).

---

## Caracteristicas del diseño y modalidad de venta

- **Modalidad 100% congelados:** todos los productos se entregan congelados, correctamente sellados, con fecha de elaboracion y su correspondiente fecha de vencimiento. No se venden como productos frescos para consumo inmediato.
- **Empanaditas (Risoles):** se entregan congeladas y listas para freir (no aptas para horno).
- **Fotografias 100% reales:** todas las fotos del sitio provienen directamente de la elaboracion real del taller (empanaditas doradas recien fritas, bandejas de risoles rebozados, ñoquis con estrías sobre marmol, varenikes y milanesas de berenjena selladas con etiqueta).
- **Estilo Editorial Gastronomico (Magazine Style):** presentacion visual inspirada en publicaciones culinarias de autor, con fotografia documental de gran formato como protagonista, tipografia serif clasica con acentos cursivos (Fraunces), separadores hairline de 1px, espacios generosos y doble pliego asimetrico alternado para cada uno de los cuatro productos.
- **Estetica sobria y editorial:** inspirada en cartas de restaurantes tradicionales y marcas gastronomicas modernas (paleta limitada en blanco hueso `#FAF8F5`, carbon calido `#221F1C` y acento terracota `#A34828`). Sin gradientes de neon ni sombras pesadas.
- **Sin precios visibles:** cada plato cuenta con un boton de consulta directa ("Consultar por WhatsApp") que abre la aplicacion con el mensaje redactado para consultar disponibilidad y precio.
- **Llamado a la accion limpio y unificado:** eliminados botones redundantes ("Escribinos"). Se mantiene unicamente "Consultar por WhatsApp" en las secciones clave y un boton flotante circular con icono en la esquina inferior.
- **Sin datos artificiales:** no incluye testimonios inventados, cifras falsas ni años ficticios de trayectoria.
- **Sin emojis:** textos e interfaz limpios con tipografia con caracter (Fraunces para titulos y Plus Jakarta Sans para lectura).
- **Animaciones y experiencia fluida:** entradas suaves al scroll aceleradas por GPU, cabecera inteligente con elevacion sutil al desplazarse, scroll-spy activo en enlaces de navegacion, micro-interacciones tactiles en botones, pulso ambiental en WhatsApp y respeto estricto por `prefers-reduced-motion`.
- **Modo Nocturno (Dark Mode):** selector de tema claro/oscuro con boton de luna/sol en cabecera (escritorio y movil), deteccion automatica segun preferencia del sistema y guardado de eleccion en `localStorage`.
- **Responsive mobile-first:** adaptado para pantallas desde 360px hasta escritorios amplios, con botones de control cuadrado suave (menu hamburguesa y modo nocturno) y botones tactiles de mas de 44px.
- **Modalidad de atencion clara:** comunica que los pedidos se realizan por mensaje / WhatsApp, con retiro coordinado previamente y productos caseros congelados sujetos a disponibilidad. No presenta horarios de local comercial al publico.

---

## Estructura de archivos

```
variedades_ana/
│── index.html              # Estructura del sitio, secciones y metadatos SEO
│── README.md               # Esta guia de uso y edicion
│── manifest.json           # Configuracion para navegadores y moviles
│── css/
│   ├── styles.css          # Tipografia, colores, layout editorial y responsive
│   └── animations.css      # Animaciones de entrada suaves y perspectiva 3D
│── js/
│   ├── config.js           # Configuracion: WhatsApp, horarios, zonas y ubicacion
│   ├── products.js         # Informacion de los cuatro productos reales y fotos
│   └── app.js              # Estado en vivo, inclinacion sutil, galeria y contacto
└── assets/
    ├── logo-oficial.png    # Logotipo oficial y favicon del sitio
    ├── logo.svg            # Tipografia y nombre de marca
    └── fotos/              # Fotografias reales adaptadas y optimizadas
```

---

## Guia de edicion rapida

### 1. Cambiar el numero de WhatsApp, ciudad o direccion
Abrir el archivo **`js/config.js`** con un editor de texto. Alli encontraras:

```javascript
// Nombre del emprendimiento y ciudad
businessName: "Variedades Caseras",
city: "Leandro N. Alem, Misiones, Argentina",
address: "Leandro N. Alem, Misiones, Argentina (Punto de retiro con coordinacion previa)",

// Numero de WhatsApp (pais + area + numero, sin espacios ni signos)
whatsappNumber: "5493754416521",

// Redes y telefono visible
phoneDisplay: "+54 3754-416521",
instagramUser: "@anaavariedadees",
instagramUrl: "https://www.instagram.com/anaavariedadees/",
```

Al modificar el numero en `config.js`, todos los enlaces de consulta de la web se actualizan automaticamente.

---

### 2. Modificar textos de la barra superior de modalidad y pedidos
En el mismo archivo **`js/config.js`**, en las variables `orderModeNotice` y `orderPickupNotice`:

```javascript
orderModeNotice: "Pedidos por mensaje · Consultá disponibilidad",
orderPickupNotice: "Retiro coordinado previamente. Productos sujetos a disponibilidad."
```

---

### 3. Modificar descripcion o rellenos de los productos
En el archivo **`js/products.js`**, cada uno de los productos tiene su bloque claramente identificado:

```javascript
{
  id: "empanaditas",
  name: "Empanaditas (Risoles)",
  description: "Texto breve y real sobre la elaboracion...",
  fillings: [
    { name: "Carne", detail: "Carne molida, cebolla, morron rojo, huevo, perejil, cebollita." },
    { name: "Pollo", detail: "Pollo desmenuzado, cebolla, morron rojo, perejil, cebollita." },
    { name: "Choclo", detail: "Choclo, cebolla, morron rojo, perejil, cebollita, queso." },
    { name: "Acelga", detail: "Acelga, cebolla, morron rojo, queso." },
    { name: "Jamon y Queso", detail: "Jamon, queso." }
  ],
  whatsappQuery: "Mensaje que se enviara al hacer clic..."
}
```
*Nota: El sitio no maneja precios, por lo que no hace falta ingresar ningun importe monetario.*

---

### 4. Reemplazar fotos por fotos reales propias
1. Guarda tus fotos dentro de la carpeta `assets/fotos/` (por ejemplo `assets/fotos/producto-empanaditas.jpg`, `assets/fotos/producto-noquis.jpg`, `assets/fotos/producto-vareniques.jpg`).
2. En `js/products.js`, reemplaza la propiedad `image` con la ruta local:
   ```javascript
   image: "assets/fotos/producto-empanaditas.jpg"
   ```
3. Para la galeria, hace lo mismo en la lista `GALLERY` dentro del mismo archivo.

---

## Como probar el sitio localmente

1. Podes hacer doble clic sobre `index.html` para abrirlo directamente en tu navegador.
2. O bien iniciar un servidor local simple:
   - Con Python: `python -m http.server 8000` y abrir `http://localhost:8000`
   - Con Node.js: `npx serve .`

---

## Como publicar en internet

1. **Netlify Drop:** Arrastrar la carpeta `variedades_ana` a [app.netlify.com/drop](https://app.netlify.com/drop). Queda online con direccion web y certificado SSL gratuito de inmediato.
2. **GitHub Pages o Vercel:** Subir los archivos a un repositorio y activar el hosting estatico con un clic.
3. **Hosting tradicional:** Subir todos los archivos mediante FTP o cPanel a la carpeta publica (`public_html`).
