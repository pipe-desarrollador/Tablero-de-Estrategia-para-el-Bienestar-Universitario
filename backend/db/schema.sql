-- Esquema base para Tablero de Estrategia - Bienestar Universitario
-- Tabla principal: survey_responses (snake_case plural) con PK _id

CREATE TABLE IF NOT EXISTS survey_responses (
  survey_response_id SERIAL PRIMARY KEY,
  gender                VARCHAR(50),
  age                   INTEGER,
  stress_experience     VARCHAR(255),
  palpitations          VARCHAR(10),
  anxiety               VARCHAR(10),
  sleep_problems        VARCHAR(10),
  anxiety_duplicate     VARCHAR(10),
  headaches             VARCHAR(10),
  irritability          VARCHAR(10),
  concentration_issues  VARCHAR(10),
  sadness               VARCHAR(10),
  illness               VARCHAR(255),
  loneliness            VARCHAR(255),
  academic_overload     VARCHAR(255),
  competition           VARCHAR(255),
  relationship_stress   VARCHAR(255),
  professor_difficulty  VARCHAR(255),
  work_environment      VARCHAR(255),
  leisure_time          VARCHAR(255),
  home_environment      VARCHAR(255),
  low_confidence_performance VARCHAR(255),
  low_confidence_subjects    VARCHAR(255),
  academic_conflict     VARCHAR(255),
  class_attendance      VARCHAR(255),
  weight_change         VARCHAR(255),
  stress_type           VARCHAR(255),
  source                VARCHAR(64),
  created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_survey_responses_source ON survey_responses (source);
CREATE INDEX IF NOT EXISTS idx_survey_responses_gender ON survey_responses (gender);
CREATE INDEX IF NOT EXISTS idx_survey_responses_age ON survey_responses (age);

-- Restricciones para evitar duplicados
-- Constraint único basado en combinación de campos clave para identificar registros duplicados
-- Esto evita que se inserten registros con la misma combinación de datos esenciales
CREATE UNIQUE INDEX IF NOT EXISTS idx_survey_responses_unique_record 
ON survey_responses (gender, age, stress_type, source, 
                     COALESCE(palpitations, ''), COALESCE(anxiety, ''), 
                     COALESCE(sleep_problems, ''), COALESCE(headaches, ''));

-- Constraint adicional para evitar duplicados exactos (todos los campos iguales)
-- Esto es más estricto y evita registros completamente idénticos
CREATE UNIQUE INDEX IF NOT EXISTS idx_survey_responses_exact_duplicate
ON survey_responses (gender, age, stress_experience, palpitations, anxiety, 
                     sleep_problems, anxiety_duplicate, headaches, irritability,
                     concentration_issues, sadness, illness, loneliness,
                     academic_overload, competition, relationship_stress,
                     professor_difficulty, work_environment, leisure_time,
                     home_environment, low_confidence_performance,
                     low_confidence_subjects, academic_conflict, class_attendance,
                     weight_change, stress_type, source);

