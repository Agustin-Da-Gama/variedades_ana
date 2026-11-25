---
name: diseno-web-innovador
description: >-
  Diseña y construye sitios web y landing pages innovadoras, memorables y de alto
  impacto visual. Úsala cuando el usuario pida crear o rediseñar una web moderna,
  creativa, editorial, minimalista o visualmente diferenciada con tipografía,
  jerarquía espacial, microinteracciones y rendimiento optimizado.
---

# Diseño Web Innovador

Guía práctica para diseñar e implementar interfaces web modernas con identidad propia, evitando plantillas genéricas y priorizando claridad, ritmo visual, accesibilidad y fluidez.

## 1. Dirección Conceptual y Diferenciación

Antes de escribir código, define una tesis visual clara:

1. **Identidad de marca y tono**: Define la personalidad del proyecto (editorial, artesanal, tecnológica, boutique, comercial) y tradúcela en paleta, tipografía y densidad espacial.
2. **Punto focal único**: Cada pantalla o sección debe tener una jerarquía clara (un elemento protagonista por vista: titular expresivo, imagen editorial, producto o demostración interactiva).
3. **Rompe la simetría genérica con intención**: Alterna bloques asimétricos, grillas editoriales, superposiciones sutiles o bento grids donde aporten narrativa, manteniendo un eje de lectura claro.

## 2. Sistema Tipográfico y de Color

- **Tipografía con carácter**: Combina una fuente display o editorial expresiva para encabezados (`clamp()` fluido para escalado responsivo) con una sans-serif altamente legible para cuerpo (`16px` mínimo, `line-height: 1.5–1.7`, `max-width: 65ch` en textos largos).
- **Paleta contenida (regla 60-30-10)**:
  - `60%` superficie dominante (neutro cálido, crema, grafito profundo o blanco limpio).
  - `30%` superficie secundaria / tarjetas / contraste estructural.
  - `10%` color de acento reservado para acciones principales (CTA), estados activos y detalles clave.
- **Tokens semánticos en CSS**: Define variables (`--bg-surface`, `--text-primary`, `--text-muted`, `--accent`, `--border-subtle`) para mantener consistencia y facilitar variantes claras/oscuras.
- **Contraste verificado**: Mínimo `4.5:1` en texto normal y `3:1` en titulares grandes y elementos UI.

## 3. Layout, Ritmo Espacial y Responsividad

- **Mobile-first real**: Diseña primero para `375px` sin scroll horizontal, con áreas táctiles de al menos `44×44px` y navegación clara.
- **Espaciado sistemático**: Usa una escala consistente (`4, 8, 12, 16, 24, 32, 48, 64, 96px`) y respira entre secciones para dar jerarquía.
- **Imágenes y medios**: Usa `aspect-ratio` explícito o dimensiones declaradas para evitar saltos de layout (`CLS`), formatos modernos (`WebP`/`AVIF`) y `loading="lazy"` fuera del fold inicial.

## 4. Movimiento y Microinteracciones con Propósito

- **Anima solo propiedades de compositor**: Prioriza `transform` y `opacity`; evita animar `width`, `height`, `top` o `left`.
- **Tiempos naturales**: Microinteracciones entre `150ms–300ms` con `cubic-bezier` de salida suave (`ease-out`) al entrar y transiciones más breves al salir.
- **Respeta la accesibilidad**: Incluye siempre soporte para `@media (prefers-reduced-motion: reduce)` reduciendo o desactivando animaciones no esenciales.

## 5. Lista de Verificación Previa a la Entrega

- [ ] Jerarquía visual clara: el usuario entiende qué es el sitio y qué acción tomar en menos de 5 segundos.
- [ ] Tipografía legible, escala fluida y sin desbordamientos horizontales en móvil (`375px`) ni escritorio (`1440px`).
- [ ] Contraste WCAG AA (`4.5:1`), estados `:focus-visible` visibles, navegación por teclado y `alt` descriptivo en imágenes.
- [ ] Imágenes optimizadas, sin layout shift, y animaciones suaves con `prefers-reduced-motion`.
- [ ] Estados completos en componentes interactivos (carga, vacío, error y confirmación).
