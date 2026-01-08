-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER ROLES (for admin/parent access)
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'parent', 'student');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================
-- PROFILES & STUDENTS
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Character/Avatar
  character_name TEXT NOT NULL DEFAULT 'Word Quester',
  avatar_emoji TEXT DEFAULT '🦊',
  avatar_config JSONB DEFAULT '{}',
  
  -- Progress
  current_region TEXT DEFAULT 'phoneme_forest',
  current_wilson_step INT DEFAULT 1,
  
  -- Gamification
  total_xp INT DEFAULT 0,
  current_level INT DEFAULT 1,
  treasures_collected INT DEFAULT 0,
  
  -- Streaks
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  streak_freeze_tokens INT DEFAULT 1,
  
  -- Settings
  font_preference TEXT DEFAULT 'lexend',
  background_preference TEXT DEFAULT 'cream',
  audio_speed DECIMAL DEFAULT 1.0,
  
  -- Owned items
  owned_items TEXT[] DEFAULT '{}',
  active_pet TEXT,
  active_accessory TEXT,
  active_theme TEXT DEFAULT 'default',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUESTS & CHALLENGES
-- ============================================
CREATE TABLE public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name TEXT NOT NULL,
  description TEXT,
  region TEXT NOT NULL,
  wilson_step INT NOT NULL,
  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  estimated_minutes INT NOT NULL DEFAULT 5,
  
  story_intro TEXT,
  story_conclusion TEXT,
  base_xp INT DEFAULT 50,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
  
  challenge_type TEXT NOT NULL,
  challenge_order INT NOT NULL,
  content JSONB NOT NULL,
  pass_threshold DECIMAL DEFAULT 0.8,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYER PROGRESS
-- ============================================
CREATE TABLE public.quest_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id),
  
  overall_accuracy DECIMAL NOT NULL,
  total_time_seconds INT NOT NULL,
  hints_used INT DEFAULT 0,
  star_rating INT CHECK (star_rating BETWEEN 1 AND 3),
  
  xp_earned INT NOT NULL,
  treasure_found BOOLEAN DEFAULT FALSE,
  
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.challenge_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completion_id UUID REFERENCES public.quest_completions(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id),
  
  attempts INT DEFAULT 1,
  correct BOOLEAN NOT NULL,
  time_seconds INT,
  hints_used INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  quests_completed INT DEFAULT 0,
  total_xp_earned INT DEFAULT 0,
  total_time_minutes INT DEFAULT 0,
  
  is_daily_champion BOOLEAN DEFAULT FALSE,
  is_super_champion BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- ============================================
-- ACHIEVEMENTS
-- ============================================
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INT NOT NULL,
  xp_reward INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.student_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, achievement_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users see own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Students policies
CREATE POLICY "Users see own students" ON public.students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users manage own students" ON public.students
  FOR ALL USING (auth.uid() = user_id);

-- Quests are public readable
CREATE POLICY "Quests are public" ON public.quests
  FOR SELECT USING (true);

CREATE POLICY "Challenges are public" ON public.challenges
  FOR SELECT USING (true);

CREATE POLICY "Achievements are public" ON public.achievements
  FOR SELECT USING (true);

-- Quest completions
CREATE POLICY "Students see own completions" ON public.quest_completions
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

CREATE POLICY "Students insert own completions" ON public.quest_completions
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

-- Challenge results
CREATE POLICY "Students see own results" ON public.challenge_results
  FOR SELECT USING (
    completion_id IN (
      SELECT id FROM public.quest_completions 
      WHERE student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Students insert own results" ON public.challenge_results
  FOR INSERT WITH CHECK (
    completion_id IN (
      SELECT id FROM public.quest_completions 
      WHERE student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    )
  );

-- Daily progress
CREATE POLICY "Students see own progress" ON public.daily_progress
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

CREATE POLICY "Students manage own progress" ON public.daily_progress
  FOR ALL USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

-- Student achievements
CREATE POLICY "Students see own achievements" ON public.student_achievements
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

CREATE POLICY "Students insert own achievements" ON public.student_achievements
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

-- User roles policy
CREATE POLICY "Users see own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA: Initial Quests
-- ============================================
INSERT INTO public.quests (name, description, region, wilson_step, difficulty, estimated_minutes, story_intro, story_conclusion, base_xp) VALUES
('Sound Springs Discovery', 'Learn the sounds of letters in the magical Sound Springs', 'phoneme_forest', 1, 1, 5, 'Welcome to Sound Springs, where letters learn to sing! The Jumble Monster has scrambled the sounds. Can you help restore them?', 'You did it! The Sound Springs are singing again. The letters thank you, brave Quester!', 50),
('Echo Cave Challenge', 'Match sounds to letters in the mysterious Echo Cave', 'phoneme_forest', 1, 2, 7, 'Deep in Echo Cave, sounds bounce off the walls. Listen carefully and find the matching letters!', 'The echoes are clear again! You have restored harmony to Echo Cave.', 65),
('Rhyme Grove Adventure', 'Find rhyming words in the enchanted Rhyme Grove', 'phoneme_forest', 2, 2, 8, 'The Rhyme Grove is where words that sound alike live together. Can you reunite the rhyming friends?', 'The rhymes are reunited! The Grove celebrates with a song of matching sounds.', 75);

-- Seed initial achievements
INSERT INTO public.achievements (name, description, icon, requirement_type, requirement_value, xp_reward) VALUES
('First Steps', 'Complete your first quest', '⭐', 'quests_completed', 1, 25),
('Sound Seeker', 'Complete 5 quests', '🎵', 'quests_completed', 5, 50),
('Word Warrior', 'Complete 10 quests', '⚔️', 'quests_completed', 10, 100),
('Streak Starter', 'Reach a 3-day streak', '🔥', 'streak', 3, 30),
('Week Warrior', 'Reach a 7-day streak', '🏆', 'streak', 7, 75),
('XP Hunter', 'Earn 100 XP', '💎', 'total_xp', 100, 25),
('XP Master', 'Earn 500 XP', '👑', 'total_xp', 500, 100);