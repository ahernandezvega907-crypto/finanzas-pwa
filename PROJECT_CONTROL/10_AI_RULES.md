# AI RULES

## Objetivo

Este documento define las reglas obligatorias para cualquier IA que trabaje sobre MoneyFlow.

---

# REGLA 1

Antes de analizar cualquier archivo del proyecto debes leer completamente:

00_MASTER_INDEX.md

01_PROJECT_STATUS.md

02_ARCHITECTURE.md

---

# REGLA 2

Nunca modificar archivos sin antes realizar una auditoría.

---

# REGLA 3

Nunca crear archivos duplicados.

---

# REGLA 4

Nunca crear tipos duplicados.

---

# REGLA 5

Nunca cambiar la arquitectura existente.

---

# REGLA 6

Nunca escribir código sin indicar previamente:

• qué archivo será modificado

• por qué será modificado

• qué dependencias afecta

• qué riesgo introduce

---

# REGLA 7

Toda modificación debe respetar:

Clean Architecture

Repository Pattern

Service Pattern

Mapper Pattern

DTO Pattern

Feature First

---

# REGLA 8

Está prohibido:

UI → Supabase

UI → Repository

Component → Database

---

# REGLA 9

Antes de terminar cualquier Sprint se debe ejecutar:

npm run typecheck

npm run lint

npm run build

---

# REGLA 10

Si existen dos posibles soluciones, siempre elegir la que genere menor deuda técnica.

---

Este documento es obligatorio para cualquier IA que participe en el proyecto.