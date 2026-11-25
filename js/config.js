/**
 * CONFIGURACION GENERAL - VARIEDADES CASERAS
 * ==========================================
 * Ubicacion: Leandro N. Alem, Misiones, Argentina
 * Telefono / WhatsApp: +54 3754-416521
 */

const CONFIG = {
  // Nombre del emprendimiento y localidad
  businessName: "Variedades Caseras",
  tagline: "Comida casera artesanal congelada",
  description: "Productos caseros congelados en Leandro N. Alem, Misiones. Empanaditas (Risoles) listas para freir, ñoquis, varenikes y milanesas de berenjena. Correctamente sellados, con fecha de elaboracion y vencimiento.",
  city: "Leandro N. Alem, Misiones, Argentina",
  address: "Leandro N. Alem, Misiones, Argentina (Punto de retiro con coordinacion previa)",
  
  // WhatsApp: codigo de pais (54) + 9 + codigo de area y numero (3754416521)
  whatsappNumber: "5493754416521",
  whatsappDefaultMessage: "Hola Variedades Caseras, quería consultar por disponibilidad de los productos.",

  // Contacto y redes
  phoneDisplay: "+54 3754-416521",
  instagramUser: "@anaavariedadees",
  instagramUrl: "https://www.instagram.com/anaavariedadees/",

  // Zonas y modalidad de entrega
  deliveryZones: [
    { name: "Retiro coordinado", note: "En zona urbana, con día y horario acordados previamente" },
    { name: "Zona Centro y alrededores", note: "Entrega a domicilio a convenir según pedido" },
    { name: "Barrios alejados y cercanías", note: "Consultá cobertura y punto de encuentro por WhatsApp" }
  ],

  // Modalidad de atencion y pedidos por mensaje
  orderModeNotice: "Pedidos por mensaje · Consultá disponibilidad",
  orderPickupNotice: "Retiro coordinado previamente. Productos sujetos a disponibilidad."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
