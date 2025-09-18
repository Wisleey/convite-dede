-- Criando tabela para armazenar confirmações de presença
CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  guests_count INTEGER DEFAULT 1,
  guest_names TEXT[], -- Array para armazenar nomes dos convidados adicionais
  message TEXT,
  will_attend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_rsvps_name ON rsvps(name);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);
CREATE INDEX IF NOT EXISTS idx_rsvps_will_attend ON rsvps(will_attend);
