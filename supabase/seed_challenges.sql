-- Seed Script for Global Challenges

INSERT INTO public.challenges (title, description, start_date, end_date, participants_count)
VALUES 
  ('Vegan Week', 'Eat 100% plant-based meals for 7 straight days to drastically cut your food footprint.', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 0),
  ('Zero-Emission Commute', 'Walk, bike, or use public transit for all your commuting needs this fortnight.', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 0),
  ('Energy Saver Sprint', 'Reduce your electricity usage by 20% compared to last month. Turn off lights, unplug devices, and use natural light.', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 0)
ON CONFLICT DO NOTHING;
