-- Parent Reward Goals table
CREATE TABLE public.parent_reward_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_user_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    goal_type TEXT NOT NULL DEFAULT 'xp', -- 'xp', 'streak', 'quests', 'time_minutes'
    target_value INTEGER NOT NULL,
    reward_description TEXT NOT NULL,
    is_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.parent_reward_goals ENABLE ROW LEVEL SECURITY;

-- Parents can manage their own goals
CREATE POLICY "Parents manage own goals"
ON public.parent_reward_goals
FOR ALL
USING (auth.uid() = parent_user_id);

-- Students can view goals set for them
CREATE POLICY "Students view their goals"
ON public.parent_reward_goals
FOR SELECT
USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
));

-- Parent email preferences table
CREATE TABLE public.parent_email_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_user_id UUID NOT NULL UNIQUE,
    email TEXT NOT NULL,
    weekly_reports_enabled BOOLEAN DEFAULT true,
    last_report_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.parent_email_preferences ENABLE ROW LEVEL SECURITY;

-- Parents manage own preferences
CREATE POLICY "Parents manage own email preferences"
ON public.parent_email_preferences
FOR ALL
USING (auth.uid() = parent_user_id);

-- Index for efficient weekly report queries
CREATE INDEX idx_parent_email_weekly_enabled ON public.parent_email_preferences(weekly_reports_enabled) WHERE weekly_reports_enabled = true;