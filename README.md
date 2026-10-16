# ⚡ Sandev - Mind Control & Habit Tracker Engine (Java)

![Java](https://img.shields.io/badge/Java-17%2B-orange?style=for-the-badge&logo=java)
![Architecture](https://img.shields.io/badge/Architecture-OOP%20%2F%20Analytics-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Sandev** es un sistema de trazabilidad analítica y control de hábitos diseñado para registrar, analizar e identificar patrones de comportamiento y disparadores (*triggers*) en procesos de disciplina personal.

---

## 🛠️ Características & Lógica Analítica

- **Clasificación de Eventos Dual:** Diferenciación precisa entre desliz de atención (*Peeking*) y recaídas de ciclo completo.
- **Métricas de Tiempo Limpio:** Cálculo dinámico de horas limpias semanales sobre el total de 168 horas ($10,080\text{ minutos}$).
- **Distribución de Disparadores (Triggers):** Procesamiento de patrones mediante colecciones mapeadas (`HashMap`) para generar porcentajes de causa raíz (redes sociales, aburrimiento, estrés).
- **Control de Excepciones y Formateo:** Procesamiento de fechas en formato local (`dd/MM/yyyy HH:mm`) con resguardo ante errores mediante `DateTimeParseException`.

---

## 🏗️ Estructura del Core Backend

```text
  +------------------+         1 : N          +-------------------------+
  |  RegistroEvento  | <--------------------- |   GestorEstadisticas    |
  +------------------+                        +-------------------------+
  | - inicio         |                        | - historialEventos      |
  | - fin            |                        +-------------------------+
  | - tipoRecaida    |                        | + getMinutosTotales()   |
  | - disparador     |                        | + getTiempoLimpio()     |
  | - notaContexto   |                        | + obtenerPorcentajes()  |
  +------------------+                        +-------------------------+