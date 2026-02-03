-- Create table for daily check-ins
CREATE TABLE public.daily_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood TEXT NOT NULL,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 5),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  muscle_soreness INTEGER CHECK (muscle_soreness >= 1 AND muscle_soreness <= 5),
  goals_for_today TEXT,
  notes TEXT,
  weight_kg NUMERIC,
  shared_to_social BOOLEAN DEFAULT false,
  streak_count INTEGER DEFAULT 1,
  xp_earned INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, checkin_date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own checkins" 
ON public.daily_checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkins" 
ON public.daily_checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins" 
ON public.daily_checkins 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_checkins_user_date ON public.daily_checkins(user_id, checkin_date DESC);