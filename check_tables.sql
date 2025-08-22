-- Script para verificar la estructura de las tablas
-- Ejecuta esto en pgAdmin o en tu cliente PostgreSQL

-- Ver estructura de survey_responses
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'survey_responses' 
ORDER BY ordinal_position;

-- Ver estructura de survey_factors
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'survey_factors' 
ORDER BY ordinal_position;

-- Ver datos de ejemplo
SELECT * FROM survey_responses LIMIT 5;
SELECT * FROM survey_factors LIMIT 5;
