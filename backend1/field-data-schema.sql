-- Field data table to store yield and other field-related data
CREATE TABLE IF NOT EXISTS field_data (
  id SERIAL PRIMARY KEY,
  field_id INTEGER NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  crop_type VARCHAR(100) NOT NULL,
  yield_amount DECIMAL(10, 2),
  unit VARCHAR(50) NOT NULL,
  measurement_date DATE NOT NULL,
  notes TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_field_data_field_id ON field_data(field_id);
CREATE INDEX IF NOT EXISTS idx_field_data_crop_type ON field_data(crop_type);
CREATE INDEX IF NOT EXISTS idx_field_data_measurement_date ON field_data(measurement_date);
CREATE INDEX IF NOT EXISTS idx_field_data_user_id ON field_data(user_id);
