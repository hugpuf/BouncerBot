import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// =====================
// SERVERS
// =====================
export type Server = Tables<"servers">;

export function useServers() {
  return useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useServer(id: string | undefined) {
  return useQuery({
    queryKey: ["servers", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (server: TablesInsert<"servers">) => {
      const { data, error } = await supabase
        .from("servers")
        .insert(server)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["servers"] }),
  });
}

export function useUpdateServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"servers"> & { id: string }) => {
      const { data, error } = await supabase
        .from("servers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["servers"] }),
  });
}

// =====================
// ONBOARDING FLOWS
// =====================
export type OnboardingFlow = Tables<"onboarding_flows">;

export function useFlowByServer(serverId: string | undefined) {
  return useQuery({
    queryKey: ["flows", serverId],
    enabled: !!serverId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_flows")
        .select("*")
        .eq("server_id", serverId!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (flow: TablesInsert<"onboarding_flows">) => {
      const { data, error } = await supabase
        .from("onboarding_flows")
        .insert(flow)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) =>
      qc.invalidateQueries({ queryKey: ["flows", data.server_id] }),
  });
}

export function useUpdateFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"onboarding_flows"> & { id: string }) => {
      const { data, error } = await supabase
        .from("onboarding_flows")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) =>
      qc.invalidateQueries({ queryKey: ["flows", data.server_id] }),
  });
}

// =====================
// FLOW QUESTIONS
// =====================
export type FlowQuestion = Tables<"flow_questions">;

export function useFlowQuestions(flowId: string | undefined) {
  return useQuery({
    queryKey: ["questions", flowId],
    enabled: !!flowId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flow_questions")
        .select("*")
        .eq("flow_id", flowId!)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertQuestions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      flowId,
      questions,
    }: {
      flowId: string;
      questions: TablesInsert<"flow_questions">[];
    }) => {
      // Delete existing, then insert new
      await supabase.from("flow_questions").delete().eq("flow_id", flowId);
      if (questions.length > 0) {
        const { error } = await supabase.from("flow_questions").insert(questions);
        if (error) throw error;
      }
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["questions", vars.flowId] }),
  });
}

// =====================
// DATA DESTINATIONS
// =====================
export type DataDestination = Tables<"data_destinations">;

export function useDestinations(serverId: string | undefined) {
  return useQuery({
    queryKey: ["destinations", serverId],
    enabled: !!serverId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_destinations")
        .select("*")
        .eq("server_id", serverId!);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateDestination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dest: TablesInsert<"data_destinations">) => {
      const { data, error } = await supabase
        .from("data_destinations")
        .insert(dest)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) =>
      qc.invalidateQueries({ queryKey: ["destinations", data.server_id] }),
  });
}

// =====================
// ONBOARDING RESPONSES (read-only from frontend)
// =====================
export type OnboardingResponse = Tables<"onboarding_responses">;

export function useResponses(serverId: string | undefined) {
  return useQuery({
    queryKey: ["responses", serverId],
    enabled: !!serverId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("server_id", serverId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useResponseCount(serverId: string | undefined) {
  return useQuery({
    queryKey: ["response-count", serverId],
    enabled: !!serverId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("onboarding_responses")
        .select("*", { count: "exact", head: true })
        .eq("server_id", serverId!);
      if (error) throw error;
      return count ?? 0;
    },
  });
}
