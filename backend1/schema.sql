-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  usertype VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
  id SERIAL PRIMARY KEY,
  fieldname VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  area DECIMAL(10, 2) NOT NULL,
  croptype VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  soiltype VARCHAR(50) NOT NULL,
  last_irrigated TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  next_irrigation TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  drainage VARCHAR(50) DEFAULT 'moderate',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mac_address VARCHAR(17) UNIQUE NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  field_id INTEGER REFERENCES fields(id) ON DELETE SET NULL,
  last_reading TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  battery_level INTEGER DEFAULT 100,
  firmware_version VARCHAR(50) DEFAULT '1.0.0',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sensor readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
  reading_type VARCHAR(50) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_field_id ON devices(field_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_id ON sensor_readings(device_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp);
