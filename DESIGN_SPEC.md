# ML Intelligence Platform - Especificación de Diseño

## Resumen del Proyecto

Plataforma de Machine Learning con interfaz web para ejecutar modelos predictivos. Contiene dos módulos principales: **Titanic** (predicción de supervivencia) y **Football** (predicción de resultados de partidos).

---

## Paleta de Colores

| Uso | Color | Código |
|-----|-------|--------|
| Primario | Azul | `#2563eb` (blue-600) |
| Primario Hover | Azul oscuro | `#1d4ed8` (blue-700) |
| Fondo principal | Blanco | `#ffffff` |
| Fondo secundario | Gris claro | `#f8fafc` (slate-50) |
| Sidebar | Azul muy oscuro | `#0f172a` (slate-900) |
| Texto principal | Gris oscuro | `#1e293b` (slate-800) |
| Texto secundario | Gris medio | `#64748b` (slate-500) |
| Bordes | Gris claro | `#e2e8f0` (slate-200) |
| Éxito | Verde | `#16a34a` (green-600) |
| Error | Rojo | `#dc2626` (red-600) |

---

## Tipografía

- **Font family**: Inter (sans-serif)
- **Headings**: Font-weight 600-700
- **Body**: Font-weight 400
- **Tamaños**: 
  - H1: 24px
  - H2: 20px
  - Body: 14-16px
  - Small/Labels: 12-13px

---

## Estructura de Layout

```
┌─────────────────────────────────────────────────────────────┐
│                      APLICACIÓN                             │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  SIDEBAR   │              ÁREA DE CONTENIDO                 │
│  (240px)   │                                                │
│            │  ┌──────────────────────────────────────────┐  │
│  - Logo    │  │         STEP INDICATOR (Stepper)         │  │
│  - Nav     │  │  [1]──[2]──[3]──[4]──[5]──[6]           │  │
│  - Módulos │  └──────────────────────────────────────────┘  │
│            │                                                │
│            │  ┌──────────────────────────────────────────┐  │
│            │  │                                          │  │
│            │  │           CONTENIDO DEL PASO             │  │
│            │  │              (Card/Form)                 │  │
│            │  │                                          │  │
│            │  └──────────────────────────────────────────┘  │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

---

## Componentes del Sidebar

### Estructura
- **Logo**: Icono de cerebro + texto "ML Platform"
- **Navegación**: Lista de módulos disponibles
- **Estado activo**: Fondo azul semi-transparente con borde izquierdo azul

### Módulos en Sidebar
1. **Titanic Survival** - Icono: barco/ancla
2. **Football Predictor** - Icono: pelota de fútbol

---

## Step Indicator (Stepper)

Barra horizontal que muestra el progreso del flujo.

### Estados de cada paso:
- **Completado**: Círculo azul sólido con checkmark blanco
- **Activo**: Círculo azul con borde, número blanco
- **Pendiente**: Círculo gris claro con número gris

### Conexiones entre pasos:
- Línea conectora entre círculos
- Azul si el paso anterior está completado
- Gris si está pendiente

---

## Módulo Titanic - Flujo de 6 Pasos

### Paso 1: Upload Dataset
**Propósito**: Subir archivo CSV/ARFF del dataset Titanic

**Elementos UI**:
- Título: "Upload Dataset"
- Descripción del paso
- Zona de drop (drag & drop) con borde punteado
- Icono de upload centrado
- Texto: "Drag & drop your file or click to browse"
- Formatos aceptados: CSV, ARFF
- Botón "Validate & Upload" (deshabilitado hasta seleccionar archivo)
- Estado de éxito: Badge verde "Dataset validated"

---

### Paso 2: Preview Data
**Propósito**: Mostrar las primeras filas del dataset

**Elementos UI**:
- Título: "Data Preview"
- Tabla con scroll horizontal
- Columnas: PassengerId, Pclass, Name, Sex, Age, SibSp, Parch, Ticket, Fare, Cabin, Embarked
- Mostrar 5-10 filas de ejemplo
- Badge con total de registros
- Botón "Continue to Training"

---

### Paso 3: Train Model
**Propósito**: Entrenar modelo J48 (árbol de decisión)

**Elementos UI**:
- Título: "Train J48 Model"
- Card con información del modelo
- Botón "Start Training"
- Durante entrenamiento:
  - Progress bar animada
  - Texto: "Training in progress..."
  - Spinner/loader
- Post-entrenamiento:
  - Badge verde "Model trained"
  - Métricas del modelo (accuracy, precision, etc.)
  - Botón "Continue to Predictions"

---

### Paso 4: Predict
**Propósito**: Formulario para predecir supervivencia de un pasajero

**Elementos UI**:
- Título: "Predict Survival"
- Formulario con campos:
  - **Pclass**: Select (1st, 2nd, 3rd)
  - **Sex**: Select (Male, Female)
  - **Age**: Input number (0-100)
  - **SibSp**: Input number (hermanos/esposos)
  - **Parch**: Input number (padres/hijos)
  - **Fare**: Input number (precio del ticket)
  - **Embarked**: Select (C, Q, S)
- Botón "Predict"
- Resultado:
  - Card grande con predicción
  - "SURVIVED" (verde) o "NOT SURVIVED" (rojo)
  - Probabilidad en porcentaje
  - Icono representativo

---

### Paso 5: Explain
**Propósito**: Generar explicación narrativa con IA

**Elementos UI**:
- Título: "AI Explanation"
- Resumen de los datos ingresados
- Botón "Generate Explanation"
- Durante generación: Skeleton loader o typing animation
- Resultado:
  - Card con texto narrativo
  - Explicación en lenguaje natural de por qué el modelo predijo ese resultado
  - Factores clave resaltados

---

### Paso 6: What-If Analysis
**Propósito**: Explorar escenarios alternativos

**Elementos UI**:
- Título: "What-If Analysis"
- Formulario similar al de predicción pero con valores pre-llenados
- Sliders para ajustar valores rápidamente
- Comparación lado a lado:
  - **Original**: Datos y predicción original
  - **Modified**: Nuevos datos y nueva predicción
- Diferencia visual entre ambos resultados
- Botón "Analyze Scenario"

---

## Módulo Football - Flujo de 2 Pasos

### Paso 1: Train Model
**Propósito**: Subir Matches.csv y entrenar RandomForest

**Elementos UI**:
- Título: "Train Football Model"
- Zona de upload para Matches.csv
- Campos requeridos mostrados: HomeTeam, AwayTeam, FTHG, FTAG, FTR
- Botón "Upload & Train"
- Progress bar durante entrenamiento
- Métricas post-entrenamiento

---

### Paso 2: Predict Match
**Propósito**: Predecir resultado de un partido

**Elementos UI**:
- Título: "Predict Match Result"
- Dos selectores de equipos:
  - **Home Team**: Dropdown con equipos
  - **Away Team**: Dropdown con equipos
- Botón "Predict Result"
- Resultado:
  - 3 barras de probabilidad:
    - **Home Win** (H) - Azul
    - **Draw** (D) - Gris
    - **Away Win** (A) - Rojo
  - Predicción principal destacada
  - Porcentajes para cada resultado

---

## Estados y Feedback

### Loading States
- Spinners circulares en botones
- Progress bars para entrenamientos
- Skeleton loaders para contenido

### Success States
- Badge verde con checkmark
- Bordes verdes en cards
- Toast notifications

### Error States
- Badge rojo con X
- Mensajes de error debajo de inputs
- Bordes rojos en campos inválidos

---

## Interacciones

### Navegación
- Click en sidebar cambia módulo activo
- Cada módulo mantiene su propio estado de pasos
- Botones "Next" y "Back" para navegar entre pasos

### Formularios
- Validación en tiempo real
- Botones deshabilitados hasta completar campos requeridos
- Feedback inmediato en errores

### Transiciones
- Fade in/out entre pasos
- Animación suave en progress bars
- Hover states en elementos interactivos

---

## Responsive Design

### Desktop (>1024px)
- Sidebar visible fijo
- Contenido centrado con max-width

### Tablet (768-1024px)
- Sidebar colapsable
- Contenido full-width con padding

### Mobile (<768px)
- Sidebar como drawer/modal
- Stepper vertical o simplificado
- Formularios stack vertical

---

## Endpoints API (Referencia)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/titanic/upload` | POST | Subir dataset |
| `/titanic/train` | POST | Entrenar J48 |
| `/titanic/predict` | POST | Predecir supervivencia |
| `/titanic/explain` | POST | Generar explicación IA |
| `/football/train` | POST | Entrenar RandomForest |
| `/football/predict` | POST | Predecir resultado |

---

## Resumen Visual

```
SIDEBAR (oscuro)          CONTENIDO (claro)
┌──────────────┐          ┌─────────────────────────────┐
│ 🧠 ML Platform│          │  ○──○──●──○──○──○  (stepper)│
│              │          │                             │
│ ▸ Titanic    │          │  ┌─────────────────────┐    │
│   Football   │          │  │                     │    │
│              │          │  │   FORMULARIO /      │    │
│              │          │  │   TABLA / RESULTADO │    │
│              │          │  │                     │    │
│              │          │  └─────────────────────┘    │
│              │          │                             │
│              │          │      [ Continuar → ]        │
└──────────────┘          └─────────────────────────────┘
```

---

## Notas para Implementación

1. **Minimalismo**: Usar mucho espacio en blanco, evitar elementos decorativos innecesarios
2. **Jerarquía clara**: Títulos prominentes, subtítulos sutiles, contenido legible
3. **Consistencia**: Mismos patrones de cards, botones y formularios en ambos módulos
4. **Feedback**: Siempre mostrar estado actual al usuario (loading, success, error)
5. **Accesibilidad**: Contraste adecuado, labels en formularios, estados de focus visibles
