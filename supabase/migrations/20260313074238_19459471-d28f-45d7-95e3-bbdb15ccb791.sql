
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================
-- 1. SERVERS
-- =====================
CREATE TABLE public.servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_guild_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can select their servers"
  ON public.servers FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their servers"
  ON public.servers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their servers"
  ON public.servers FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their servers"
  ON public.servers FOR DELETE
  USING (auth.uid() = owner_id);

CREATE TRIGGER update_servers_updated_at
  BEFORE UPDATE ON public.servers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- 2. ONBOARDING FLOWS
-- =====================
CREATE TABLE public.onboarding_flows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  template_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  welcome_message TEXT NOT NULL DEFAULT '👋 Welcome! Let''s get you set up.',
  success_message TEXT NOT NULL DEFAULT 'You''re in. Don''t cause trouble. 😎',
  nickname_format TEXT NOT NULL DEFAULT '{name} ({org})',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can select their flows"
  ON public.onboarding_flows FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = onboarding_flows.server_id AND servers.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can insert their flows"
  ON public.onboarding_flows FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = onboarding_flows.server_id AND servers.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can update their flows"
  ON public.onboarding_flows FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = onboarding_flows.server_id AND servers.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can delete their flows"
  ON public.onboarding_flows FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = onboarding_flows.server_id AND servers.owner_id = auth.uid()
  ));

CREATE TRIGGER update_onboarding_flows_updated_at
  BEFORE UPDATE ON public.onboarding_flows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- 3. FLOW QUESTIONS
-- =====================
CREATE TABLE public.flow_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id UUID NOT NULL REFERENCES public.onboarding_flows(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'text',
  text TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  skippable BOOLEAN NOT NULL DEFAULT false,
  options JSONB DEFAULT '[]'::jsonb,
  branches JSONB DEFAULT '[]'::jsonb,
  validation JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.flow_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can select their questions"
  ON public.flow_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.onboarding_flows f
    JOIN public.servers s ON s.id = f.server_id
    WHERE f.id = flow_questions.flow_id AND s.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can insert their questions"
  ON public.flow_questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.onboarding_flows f
    JOIN public.servers s ON s.id = f.server_id
    WHERE f.id = flow_questions.flow_id AND s.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can update their questions"
  ON public.flow_questions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.onboarding_flows f
    JOIN public.servers s ON s.id = f.server_id
    WHERE f.id = flow_questions.flow_id AND s.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can delete their questions"
  ON public.flow_questions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.onboarding_flows f
    JOIN public.servers s ON s.id = f.server_id
    WHERE f.id = flow_questions.flow_id AND s.owner_id = auth.uid()
  ));

CREATE INDEX idx_flow_questions_flow_id_sort ON public.flow_questions(flow_id, sort_order);

-- =====================
-- 4. DATA DESTINATIONS
-- =====================
CREATE TABLE public.data_destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.data_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can select their destinations"
  ON public.data_destinations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = data_destinations.server_id AND servers.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can insert their destinations"
  ON public.data_destinations FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = data_destinations.server_id AND servers.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can update their destinations"
  ON public.data_destinations FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = data_destinations.server_id AND servers.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can delete their destinations"
  ON public.data_destinations FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = data_destinations.server_id AND servers.owner_id = auth.uid()
  ));

-- =====================
-- 5. ONBOARDING RESPONSES
-- =====================
CREATE TABLE public.onboarding_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  flow_id UUID NOT NULL REFERENCES public.onboarding_flows(id) ON DELETE CASCADE,
  discord_user_id TEXT NOT NULL,
  discord_username TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can select their responses"
  ON public.onboarding_responses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.servers WHERE servers.id = onboarding_responses.server_id AND servers.owner_id = auth.uid()
  ));

-- Bot inserts responses via service role key, no INSERT policy needed for frontend users

CREATE INDEX idx_onboarding_responses_server ON public.onboarding_responses(server_id);
CREATE INDEX idx_onboarding_responses_discord_user ON public.onboarding_responses(discord_user_id);

-- =====================
-- SECURITY DEFINER FUNCTION for bot config lookup (used by edge function with service role)
-- =====================
CREATE OR REPLACE FUNCTION public.get_server_config(p_guild_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'server', row_to_json(s),
    'flow', row_to_json(f),
    'questions', COALESCE((
      SELECT json_agg(q ORDER BY q.sort_order)
      FROM public.flow_questions q
      WHERE q.flow_id = f.id
    ), '[]'::json),
    'destinations', COALESCE((
      SELECT json_agg(d)
      FROM public.data_destinations d
      WHERE d.server_id = s.id AND d.is_active = true
    ), '[]'::json)
  ) INTO result
  FROM public.servers s
  LEFT JOIN public.onboarding_flows f ON f.server_id = s.id AND f.is_active = true
  WHERE s.discord_guild_id = p_guild_id AND s.is_active = true;

  RETURN result;
END;
$$;
