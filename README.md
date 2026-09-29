# Sistema Mass

Sistema de gestión para una tienda minorista: la tienda en línea de cara al
cliente y, detrás, el control de compras a proveedores, inventario y ventas.

Aplicación Next.js única —interfaz y backend en el mismo proyecto—, con API
Routes por dominio y Prisma hablando directo con PostgreSQL.

## Las dos mitades

```
src/app/
├── (shop)/   Catálogo, búsqueda, carrito, checkout, cuenta
├── admin/    Productos, inventario, compras, ventas, proveedores, clientes, usuarios
└── api/      auth · products · inventory · purchases · sales · customers
              providers · checkout · reniec
```

El `middleware.js` cierra `/admin` por completo: sin sesión, o con un rol que no
sea el de administrador, la petición no llega a renderizar nada.

## El inventario se mueve, no se sobrescribe

No hay una columna `stock` que se suma y se resta. Hay una tabla de
**movimientos**:

```prisma
model Movement {
  type        String   // entrada o salida
  productId   Int
  quantity    Int
  description String
  created     DateTime
}
```

Cada entrada por compra y cada salida por venta queda como un registro propio.
El stock es la suma de los movimientos, no un número que alguien pisó. Es la
diferencia entre poder responder «¿por qué hay 12 unidades?» y solo saber que
hay 12.

El ciclo completo está modelado: `Provider` → `Purchase` y `PurchaseItem`
(lo que entra) → `Movement` → `Sale` y `SaleItem` (lo que sale).

## Validación contra los registros públicos peruanos

Dos rutas de API que consultan fuentes oficiales para no pedirle al usuario
datos que el Estado ya tiene:

| Ruta | Fuente | Para qué |
|---|---|---|
| `/api/reniec/dni` | RENIEC | Nombre completo a partir del DNI, al registrar un cliente |
| `/api/reniec/ruc` | SUNAT | Razón social y domicilio fiscal a partir del RUC, al dar de alta un proveedor |

El usuario escribe ocho u once dígitos y el resto se rellena solo, ya
verificado. Menos erratas y menos fricción en el alta.

## Pago con PayPal

El checkout delega el cobro en PayPal (`src/lib/paypal.ts`,
`api/checkout/route.ts`, y el botón en el cliente). La orden solo se confirma
cuando el pago vuelve aprobado desde el servidor, no desde el navegador.

## Bitácora de auditoría

```prisma
model AuditLog {
  userId   Int
  action   String
  entity   String
  entityId Int
  details  Json?
}
```

Quién, qué acción, sobre qué entidad y con qué detalle. En un sistema donde se
mueven precios y stock, poder reconstruir quién tocó qué no es opcional.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS ·
Radix UI · Prisma · PostgreSQL · NextAuth · Zustand (carrito) ·
React Hook Form con Zod · PayPal · Cloudinary · Recharts ·
date-fns y date-fns-tz · bcrypt

## Estructura

```
src/
├── app/          Rutas y API Routes
├── components/   Interfaz y server actions
├── store/        Estado del carrito
├── Schemas/      Validaciones con Zod
├── hooks/  lib/  data/  types/
└── middleware.js
```

## Cómo levantarlo

```bash
npm install
npx prisma migrate dev
npm run dev
```

Queda en `http://localhost:3000`. Necesita un `.env` con la base de datos, el
secreto de NextAuth, las credenciales de Cloudinary, las de PayPal y el token de
la API de consultas RENIEC/SUNAT.

---

