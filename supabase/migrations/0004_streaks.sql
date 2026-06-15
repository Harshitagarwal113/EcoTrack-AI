-- Migration for streaks table

CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_updated DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, streak_type)
);

-- RLS
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks" 
ON public.streaks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.streaks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" 
ON public.streaks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own streaks" 
ON public.streaks FOR DELETE 
USING (auth.uid() = user_id);
