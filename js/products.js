/**
 * CATALOGO DE PRODUCTOS - VARIEDADES CASERAS
 * ==========================================
 * Ubicacion: Leandro N. Alem, Misiones, Argentina
 * Telefono: +54 3754-416521
 * Productos congelados artesanales, sellados, con fecha de elaboracion y vencimiento.
 */

const PRODUCTS = [
  {
    id: "empanaditas",
    kicker: "Especialidad de la casa",
    name: "Empanaditas (Risoles)",
    subtitle: "Masa fina, relleno casero y rebozado crujiente",
    description: "Armadas una por una con masa suave trabajada a mano, rellenos frescos cocinados en casa y rebozado tradicional dorado.",
    fillingsTitle: "Variedades y sabores",
    fillings: [
      { name: "Carne", detail: "Carne molida, cebolla, morrón rojo, huevo, perejil, cebollita." },
      { name: "Pollo", detail: "Pollo desmenuzado, cebolla, morrón rojo, perejil, cebollita." },
      { name: "Choclo", detail: "Choclo, cebolla, morrón rojo, perejil, cebollita, queso." },
      { name: "Acelga", detail: "Acelga, cebolla, morrón rojo, queso." },
      { name: "Jamón y Queso", detail: "Jamón cocido y queso en hebras." }
    ],
    format: "Cocción: freír directo del freezer en aceite caliente hasta dorar (no aptas para horno).",
    image: "assets/fotos/producto-empanaditas.jpg?v=5",
    imageAlt: "Bandejas de Empanaditas (Risoles) rebozadas listas para freír",
    imageCaption: "Empanaditas rebozadas en bandeja, listas para freír.",
    ctaLabel: "Pedir Empanaditas",
    whatsappQuery: "Hola Variedades Caseras, quería consultar precio y disponibilidad de las Empanaditas (Risoles)."
  },
  {
    id: "noquis",
    kicker: "Pasta tradicional",
    name: "Ñoquis",
    subtitle: "Estrías marcadas a mano, livianos y tiernos",
    description: "Preparados con papa seleccionada y el punto justo de harina para que conserven su textura aireada al hervir, ideales para acompañar con tu salsa favorita.",
    fillingsTitle: "",
    fillings: [],
    format: "Cocción: colocar directo del freezer en abundante agua hirviendo con sal hasta que suban a la superficie.",
    image: "assets/fotos/producto-noquis.jpg?v=5",
    imageAlt: "Bandeja de ñoquis caseros con estrías tradicionales sobre mesada",
    imageCaption: "Ñoquis artesanales con estrías marcadas a mano.",
    ctaLabel: "Pedir Ñoquis",
    whatsappQuery: "Hola Variedades Caseras, quería consultar precio y disponibilidad de los Ñoquis."
  },
  {
    id: "varenikes",
    kicker: "Pasta rellena",
    name: "Varenikes",
    subtitle: "Masa tierna cerrada con repulgue clásico",
    description: "Pasta tradicional de cocina casera con rellenos generosos y cebolla caramelizada lenta para lograr un sabor profundo y equilibrado.",
    fillingsTitle: "Variedades disponibles",
    fillings: [
      { name: "Varenikes de Ricota", detail: "Ricota y cebolla caramelizada." },
      { name: "Varenikes de Papa", detail: "Puré de papa casero y cebolla caramelizada." }
    ],
    format: "Cocción: hervir directamente sin descongelar en agua salada y servir con manteca o cebolla dorada.",
    image: "assets/fotos/producto-vareniques.jpg?v=5",
    imageAlt: "Bandejas de varenikes artesanales de ricota y papa sobre mesada",
    imageCaption: "Varenikes caseros cerrados con repulgue tradicional.",
    ctaLabel: "Pedir Varenikes",
    whatsappQuery: "Hola Variedades Caseras, quería consultar precio y disponibilidad de los Varenikes (ricota / papa)."
  },
  {
    id: "milanesas-berenjena",
    kicker: "Elaboración casera",
    name: "Milanesas de berenjena",
    subtitle: "Tiernas por dentro, rebozado firme y crocante",
    description: "Láminas de berenjena seleccionadas, condimentadas con equilibrio y pasadas por rebozado casero para resolver almuerzos o cenas sin trabajo previo.",
    fillingsTitle: "",
    fillings: [],
    format: "Cocción: dorar directo del freezer al horno fuerte, sartén o freidora con un hilo de aceite.",
    image: "assets/fotos/producto-milanesas-berenjena.jpg?v=4",
    imageAlt: "Bandejas de milanesas de berenjena rebozadas sobre mesada",
    imageCaption: "Milanesas de berenjena rebozadas, listas para dorar.",
    ctaLabel: "Pedir Milanesas",
    whatsappQuery: "Hola Variedades Caseras, quería consultar precio y disponibilidad de las Milanesas de berenjena."
  }
];

// Galeria con fotografias reales del taller y productos
const GALLERY = [
  {
    title: "Empanaditas (Risoles) doradas",
    category: "Recién fritas",
    image: "assets/fotos/galeria-empanaditas-doradas.jpg?v=3",
    alt: "Empanaditas (Risoles) doradas y crujientes recién fritas"
  },
  {
    title: "Empanaditas en bandejas",
    category: "Listas para freír",
    image: "assets/fotos/galeria-empanaditas-bandeja.jpg?v=5",
    alt: "Bandejas de Empanaditas (Risoles) rebozadas listas para freír"
  },
  {
    title: "Ñoquis artesanales",
    category: "Con estrías a mano",
    image: "assets/fotos/galeria-noquis-estrias.jpg?v=5",
    alt: "Bandeja de ñoquis caseros con estrías tradicionales"
  },
  {
    title: "Varenikes en bandejas",
    category: "Ricota y papa",
    image: "assets/fotos/galeria-vareniques-frescos.jpg?v=5",
    alt: "Varenikes artesanales de ricota y papa sobre mesada"
  },
  {
    title: "Milanesas de berenjena",
    category: "Rebozado casero",
    image: "assets/fotos/galeria-milanesas-berenjena.jpg?v=4",
    alt: "Bandejas de milanesas de berenjena rebozadas listas para cocinar"
  },
  {
    title: "Bandejas selladas con fecha",
    category: "Rótulo y trazabilidad",
    image: "assets/fotos/galeria-pedidos-listos.jpg?v=5",
    alt: "Bandejas congeladas selladas con rótulo de fecha de elaboración y vencimiento"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUCTS, GALLERY };
}
