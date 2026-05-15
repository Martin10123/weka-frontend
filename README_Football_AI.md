# ⚽ Football Match Intelligence System

## 📌 Descripción
Aplicación web basada en Machine Learning que predice resultados de partidos de fútbol utilizando la API de Weka en Java.  

El sistema integra múltiples funcionalidades en una sola plataforma tipo dashboard.

---

## 🎯 Objetivo del Proyecto
- Predecir el resultado de un partido
- Estimar la cantidad de goles (Over/Under)
- Analizar la forma de los equipos
- Detectar oportunidades de apuestas
- Simular temporadas completas

---

## 📊 Dataset
https://github.com/xgabora/Club-Football-Match-Data-2000-2025

---

## 🧠 Enfoque de Machine Learning
> 2 modelos principales + lógica adicional

---

## 🔵 Modelo 1: Predicción de Resultado
Target: FTResult  
Algoritmo: RandomForest  

---

## 🔴 Modelo 2: Over / Under
Target: Over25  
Algoritmo: RandomForest  

---

## 🧩 Módulos
1. Predictor de partidos  
2. Over/Under  
3. Rachas  
4. Apuestas  
5. Simulador  

---

## 🏗️ Arquitectura
Backend: Java + Spring Boot + Weka  
Frontend: React / HTML  

---

## 📡 Endpoints
POST /predict-match  
POST /predict-overunder  
GET /team-form  
GET /bet-suggestions  
POST /simulate-season  

---

## 🎯 Conclusión
Sistema completo basado en reutilización de modelos para análisis deportivo.
