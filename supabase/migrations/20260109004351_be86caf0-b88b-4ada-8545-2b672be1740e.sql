-- Table to track phoneme performance for detailed progress reports
CREATE TABLE public.phoneme_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  phoneme TEXT NOT NULL,
  phoneme_type TEXT NOT NULL, -- 'consonant', 'vowel', 'digraph', 'blend'
  wilson_step INTEGER NOT NULL DEFAULT 1,
  correct_count INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, phoneme)
);

-- Table to track individual activity results for detailed analysis
CREATE TABLE public.activity_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- 'wordWall', 'blending', 'phonemeDrill', etc.
  word TEXT,
  phonemes_tested TEXT[], -- Array of phonemes tested in this activity
  correct BOOLEAN NOT NULL,
  time_seconds INTEGER,
  hints_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.phoneme_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for phoneme_performance
CREATE POLICY "Users see own phoneme performance" ON public.phoneme_performance
  FOR SELECT USING (student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users manage own phoneme performance" ON public.phoneme_performance
  FOR ALL USING (student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  ));

-- RLS policies for activity_results
CREATE POLICY "Users see own activity results" ON public.activity_results
  FOR SELECT USING (student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users insert own activity results" ON public.activity_results
  FOR INSERT WITH CHECK (student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  ));

-- Add parent_user_id to students table for parent-child linking
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_user_id UUID REFERENCES auth.users(id);

-- Policy for parents to see their linked children's students
CREATE POLICY "Parents see linked children" ON public.students
  FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = parent_user_id
  );

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();