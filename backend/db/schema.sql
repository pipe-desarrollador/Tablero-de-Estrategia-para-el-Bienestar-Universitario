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

