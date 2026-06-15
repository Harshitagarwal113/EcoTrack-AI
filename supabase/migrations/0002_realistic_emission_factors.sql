-- 0002_realistic_emission_factors.sql

-- Add a unique constraint to name so we can safely upsert. 
-- Note: If there are existing duplicates, this will fail. We assume names are unique.
ALTER TABLE public.activities ADD CONSTRAINT activities_name_key UNIQUE (name);

-- Upsert realistic emission factors
INSERT INTO public.activities (name, category, carbon_factor, unit)
VALUES 
  ('Car', 'Transportation', 0.192, 'km'),
  ('Bus', 'Transportation', 0.089, 'km'),
  ('Train', 'Transportation', 0.041, 'km'),
  ('Metro', 'Transportation', 0.028, 'km'),
  ('Bike', 'Transportation', 0.0, 'km'),
  ('Walking', 'Transportation', 0.0, 'km'),
  
  ('Electricity', 'Energy', 0.4, 'kWh'),
  ('AC Usage', 'Energy', 1.2, 'hour'),
  
  ('Vegetarian', 'Food', 3.8, 'day'),
  ('Mixed Diet', 'Food', 5.6, 'day'),
  ('Non-Vegetarian', 'Food', 7.2, 'day'),
  
  ('Electronics', 'Shopping', 0.35, 'usd'),
  ('Clothing', 'Shopping', 0.25, 'usd'),
  ('General Purchases', 'Shopping', 0.15, 'usd')
ON CONFLICT (name) DO UPDATE SET 
  carbon_factor = EXCLUDED.carbon_factor,
  category = EXCLUDED.category,
  unit = EXCLUDED.unit;
