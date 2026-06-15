-- 0000_initial_schema.sql
-- EcoTrack AI Supabase Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------
-- 1. PROFILES (Extends auth.users)
--------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  total_carbon_saved NUMERIC DEFAULT 0,
  sustainability_grade TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Trigger to create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


--------------------------------------------------------
-- 2. ACTIVITIES (Lookup Table)
--------------------------------------------------------
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  carbon_factor NUMERIC NOT NULL, -- kg CO2 per unit
  unit TEXT NOT NULL, -- e.g., 'km', 'meal'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activities are viewable by everyone."
  ON public.activities FOR SELECT
  USING ( true );


--------------------------------------------------------
-- 3. CARBON ENTRIES
--------------------------------------------------------
CREATE TABLE public.carbon_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.activities(id),
  amount NUMERIC NOT NULL,
  carbon_calculated NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.carbon_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries."
  ON public.carbon_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries."
  ON public.carbon_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries."
  ON public.carbon_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries."
  ON public.carbon_entries FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_carbon_entries_user_id ON public.carbon_entries(user_id);
CREATE INDEX idx_carbon_entries_date ON public.carbon_entries(date);


--------------------------------------------------------
-- 4. GOALS
--------------------------------------------------------
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_reduction NUMERIC NOT NULL,
  current_progress NUMERIC DEFAULT 0,
  deadline DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals."
  ON public.goals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals."
  ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals."
  ON public.goals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals."
  ON public.goals FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_goals_user_id ON public.goals(user_id);


--------------------------------------------------------
-- 5. CHALLENGES & USER CHALLENGES
--------------------------------------------------------
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  participants_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are viewable by everyone."
  ON public.challenges FOR SELECT USING ( true );


CREATE TABLE public.user_challenges (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  progress NUMERIC DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, challenge_id)
);

ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenge participation."
  ON public.user_challenges FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges."
  ON public.user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress."
  ON public.user_challenges FOR UPDATE USING (auth.uid() = user_id);


--------------------------------------------------------
-- 6. RECEIPTS
--------------------------------------------------------
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  merchant_name TEXT,
  total_amount NUMERIC,
  carbon_estimate NUMERIC,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own receipts."
  ON public.receipts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own receipts."
  ON public.receipts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own receipts."
  ON public.receipts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own receipts."
  ON public.receipts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);


--------------------------------------------------------
-- 7. STORAGE BUCKET: receipt_images
--------------------------------------------------------
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipt_images', 'receipt_images', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Users can upload their own receipt images" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'receipt_images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own receipt images" 
  ON storage.objects FOR SELECT 
  TO authenticated 
  USING (bucket_id = 'receipt_images' AND auth.uid()::text = (storage.foldername(name))[1]);


--------------------------------------------------------
-- 8. AUTOMATIC UPDATED_AT TRIGGERS
--------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
