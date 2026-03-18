import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useServerContext } from "@/hooks/useServerContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, TrendingUp, MessageSquare, Settings2, Loader2 } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { servers, serversLoading, selectedServer } = useServerContext();

  // Redirect to onboarding if no servers
  useEffect(() => {
    if (!serversLoading && servers.length === 0) {
      navigate("/onboarding", { replace: true });
    }
  }, [serversLoading, servers.length, navigate]);

  const serverId = selectedServer?.id;

  // Fetch response count
  const { data: totalCount = 0 } = useQuery({
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

  // Fetch this week count
  const { data: weekCount = 0 } = useQuery({
    queryKey: ["response-week-count", serverId],
    enabled: !!serverId,
    queryFn: async () => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count, error } = await supabase
        .from("onboarding_responses")
        .select("*", { count: "exact", head: true })
        .eq("server_id", serverId!)
        .gte("completed_at", weekAgo);
      if (error) throw error;
      return count ?? 0;
    },
  });

  // Fetch recent responses
  const { data: responses = [] } = useQuery({
    queryKey: ["responses-recent", serverId],
    enabled: !!serverId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("server_id", serverId!)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  // Fetch flow questions for column headers
  const { data: flow } = useQuery({
    queryKey: ["active-flow", serverId],
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

  const { data: questions = [] } = useQuery({
    queryKey: ["flow-questions", flow?.id],
    enabled: !!flow?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flow_questions")
        .select("*")
        .eq("flow_id", flow!.id)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const completionRate = totalCount > 0 ? Math.round((weekCount / totalCount) * 100) : null;

  if (serversLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AuthLayout>
    );
  }

  if (!selectedServer) return <AuthLayout><div /></AuthLayout>;

  // Get first 3 questions for table columns
  const displayQuestions = questions.slice(0, 3);

  const getAnswerValue = (answers: any, questionId: string): string => {
    if (!answers || typeof answers !== "object") return "—";
    const val = (answers as Record<string, any>)[questionId];
    if (!val) return "—";
    if (typeof val === "string") return val;
    if (val.label) return val.label;
    return JSON.stringify(val);
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {selectedServer.icon_url ? (
            <img src={selectedServer.icon_url} alt="" className="w-12 h-12 rounded-xl" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-pixel text-lg text-muted-foreground">
              {selectedServer.name[0]}
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-pixel text-sm text-foreground">{selectedServer.name}</h1>
            <Badge variant={selectedServer.is_active ? "default" : "destructive"} className="mt-1 text-[10px]">
              {selectedServer.is_active ? "● Online" : "● Offline"}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/questions")}>
              <MessageSquare className="w-4 h-4 mr-1" /> Edit questions
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/integrations")}>
              <Settings2 className="w-4 h-4 mr-1" /> Edit integrations
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden">
            <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, hsl(var(--mint) / 0.08), hsl(var(--lavender) / 0.08))" }} />
            <div className="relative">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs">Total onboarded</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalCount}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden">
            <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, hsl(var(--mint) / 0.08), hsl(var(--lavender) / 0.08))" }} />
            <div className="relative">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs">This week</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{weekCount}</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden">
            <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, hsl(var(--mint) / 0.08), hsl(var(--lavender) / 0.08))" }} />
            <div className="relative">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Completion rate</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{completionRate !== null ? `${completionRate}%` : "—"}</p>
            </div>
          </div>
        </div>

        {/* Recent responses */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-pixel text-[10px] text-foreground">Recent responses</h2>
          </div>
          {responses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No onboarding responses yet.</p>
              <p className="text-xs text-muted-foreground mt-1">New members will appear here once they complete your flow.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Username</th>
                    {displayQuestions.map(q => (
                      <th key={q.id} className="text-left px-4 py-3 text-xs text-muted-foreground font-medium truncate max-w-[150px]">
                        {q.text}
                      </th>
                    ))}
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map(r => (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-foreground font-medium">{r.discord_username ?? "Unknown"}</td>
                      {displayQuestions.map(q => (
                        <td key={q.id} className="px-4 py-3 text-muted-foreground truncate max-w-[150px]">
                          {getAnswerValue(r.answers, q.id)}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {r.completed_at ? format(new Date(r.completed_at), "MMM d, h:mm a") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Dashboard;
