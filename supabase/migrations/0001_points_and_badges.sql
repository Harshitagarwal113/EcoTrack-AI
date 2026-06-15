-- Migration: Add points and badges to profiles
ALTER TABLE public.profiles
ADD COLUMN points INTEGER DEFAULT 0,
ADD COLUMN badges TEXT[] DEFAULT '{}';
