# ARQUITECTURA OFICIAL

---

# Arquitectura

Clean Architecture

Feature First

Repository Pattern

Service Pattern

Mapper Pattern

DTO Pattern

Result Pattern

Error Pattern

---

# Organización

Cada feature debe contener únicamente:

domain/

schemas/

dto/

mappers/

repositories/

services/

hooks/

components/

pages/

index.ts

---

# Flujo permitido

UI

↓

Hook

↓

Service

↓

Repository

↓

Supabase

---

Nunca

UI

↓

Supabase

---

# Responsabilidades

Componentes

Solo renderizan UI.

No contienen lógica de negocio.

---

Hooks

Administran estado.

Nunca hablan directamente con Supabase.

---

Services

Contienen reglas de negocio.

Orquestan repositorios.

No conocen React.

---

Repositories

Única capa que habla con Supabase.

Nunca contienen lógica de negocio.

---

Mappers

Convierten

snake_case

↓

camelCase

y viceversa.

Nunca contienen lógica.

---

Schemas

Toda validación debe realizarse mediante Zod.

---

Tipos

Existe una única fuente de verdad para cada entidad.

No se permiten tipos duplicados.

---

Theme

Todos los estilos deben utilizar exclusivamente el Theme oficial.

No usar colores hardcodeados.

---

Imports

Siempre utilizar aliases cuando existan.

---

Objetivo final

Arquitectura completamente desacoplada.

Sin dependencias circulares.

Sin duplicados.

Sin deuda técnica.

Lista para producción.