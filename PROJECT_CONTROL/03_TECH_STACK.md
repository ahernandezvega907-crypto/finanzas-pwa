# MoneyFlow PWA
## Tech Stack Oficial

Versión del documento: 1.0

---

# Objetivo

Este documento define el stack tecnológico oficial del proyecto.

Ninguna IA debe introducir nuevas tecnologías sin autorización.

---

# Frontend

Framework
- React 19

Lenguaje
- TypeScript (Strict Mode)

Bundler
- Vite

Routing
- React Router DOM

UI
- Material UI 7

Estilos
- Emotion
- CSS Modules únicamente cuando sea necesario.

Iconos
- Material Icons

Notificaciones
- React Hot Toast

Formularios
- React Hook Form

Validaciones
- Zod

Gráficas
- Recharts

Fechas
- Dayjs

---

# Backend

Backend as a Service

Supabase

Servicios utilizados

- Authentication
- Database
- Storage
- Realtime

---

# Base de Datos

PostgreSQL

Convenciones

snake_case

UUID como Primary Key

Soft Delete cuando aplique.

RLS obligatorio.

---

# Arquitectura

Feature First

Cada feature contiene:

components/

hooks/

services/

repositories/

schemas/

mappers/

types/

pages/

---

# Patrón Arquitectónico

UI

↓

Hooks

↓

Services

↓

Repositories

↓

Supabase

---

# Calidad

TypeScript Strict

ESLint

Prettier

No usar any

No usar ts-ignore

No código duplicado

No imports relativos largos

---

# Git

Branch principal

main

Feature Branch

feature/*

Hotfix

hotfix/*

---

# Testing

Pendiente

Vitest

React Testing Library

---

# Build

npm run typecheck

npm run lint

npm run build

Todos deben finalizar correctamente.

---

# Restricciones

Nunca utilizar:

select('*')

Nunca acceder a Supabase desde Components.

Nunca acceder a Supabase desde Hooks.

Toda consulta pasa por Repository.

---

# Estado Actual

Frontend:
En desarrollo

Backend:
Supabase

Producción:
No

Versión:
v1.0.0-dev