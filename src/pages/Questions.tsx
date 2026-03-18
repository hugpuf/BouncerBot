import { useState, useEffect } from "react";
import { useServerContext } from "@/hooks/useServerContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthLayout";
import { StepQuestionBuilder, type QuestionItem } from "@/components/onboarding/StepQuestionBuilder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Save, RotateCcw, Eye, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Discord DM preview (reused from StepGoLive pattern)
function BotMessage({ text }: { text: string }) {
  return (
    <div className="flex gap-2">
      <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-[10px] flex-shrink-0">🚪</div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-primary">BouncerBot.gg</span>
          <span className="text-[10px] text-muted-foreground">Today</span>
        </div>
        <p className="text-sm text-foreground whitespace-pre-wrap">{text.replace(/\*\*(.*?)\*\*/g, "$1")}</p>
      </div>
    </div>
  );
}

const TEMPLATES: Record<string, { name: string; emoji: string; questions: QuestionItem[] }> = {
  community: {
    name: "Community Onboarding", emoji: "🎉",
    questions: [
      { text: "What's your full name?", type: "text", required: true, skippable: false, sort_order: 1, options: [] },
      { text: "What best describes your role?", type: "select", required: true, skippable: false, sort_order: 2, options: [{ id: "community-member", label: "Community Member" }, { id: "contributor", label: "Contributor" }, { id: "lurker", label: "Lurker" }] },
      { text: "What are your interests?", type: "text", required: false, skippable: true, sort_order: 3, options: [] },
      { text: "What's your email?", type: "email", required: false, skippable: true, sort_order: 4, options: [] },
      { text: "How did you find us?", type: "text", required: false, skippable: true, sort_order: 5, options: [] },
    ],
  },
  research: {
    name: "Research Network", emoji: "🔬",
    questions: [
      { text: "What's your full name?", type: "text", required: true, skippable: false, sort_order: 1, options: [] },
      { text: "What's your role type?", type: "select", required: true, skippable: false, sort_order: 2, options: [{ id: "academic", label: "Academic Researcher" }, { id: "industry", label: "Industry Researcher" }, { id: "developer", label: "Software Developer" }, { id: "other", label: "Something Else" }] },
      { text: "What's your organization?", type: "text", required: true, skippable: false, sort_order: 3, options: [] },
      { text: "Organization website?", type: "url", required: false, skippable: true, sort_order: 4, options: [] },
      { text: "What's your email?", type: "email", required: false, skippable: true, sort_order: 5, options: [] },
      { text: "LinkedIn profile URL?", type: "url", required: false, skippable: true, sort_order: 6, options: [] },
    ],
  },
  saas: {
    name: "SaaS Community", emoji: "🚀",
    questions: [
      { text: "What's your full name?", type: "text", required: true, skippable: false, sort_order: 1, options: [] },
      { text: "Company name?", type: "text", required: true, skippable: false, sort_order: 2, options: [] },
      { text: "Job title?", type: "text", required: true, skippable: false, sort_order: 3, options: [] },
      { text: "What's your use case?", type: "text", required: false, skippable: true, sort_order: 4, options: [] },
      { text: "Email address?", type: "email", required: false, skippable: true, sort_order: 5, options: [] },
      { text: "How did you hear about us?", type: "text", required: false, skippable: true, sort_order: 6, options: [] },
    ],
  },
};

const Questions = () => {
  const { selectedServer } = useServerContext();
  const queryClient = useQueryClient();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateConfirm, setShowTemplateConfirm] = useState<string | null>(null);

  const serverId = selectedServer?.id;

  // Fetch active flow
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

  // Fetch questions
  const { data: dbQuestions, isLoading } = useQuery({
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

  // Sync from DB
  useEffect(() => {
    if (dbQuestions) {
      setQuestions(
        dbQuestions.map(q => ({
          text: q.text,
          type: q.type as QuestionItem["type"],
          required: q.required,
          skippable: q.skippable,
          sort_order: q.sort_order,
          options: (q.options as Array<{ id: string; label: string }>) ?? [],
        }))
      );
      setHasChanges(false);
    }
  }, [dbQuestions]);

  const handleChange = (updated: QuestionItem[]) => {
    setQuestions(updated);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!flow) return;
    setSaving(true);
    try {
      await supabase.from("flow_questions").delete().eq("flow_id", flow.id);
      if (questions.length > 0) {
        const rows = questions.map((q, i) => ({
          flow_id: flow.id,
          text: q.text,
          type: q.type,
          sort_order: i + 1,
          required: q.required,
          skippable: q.skippable,
          options: q.type === "select" ? q.options : [],
        }));
        const { error } = await supabase.from("flow_questions").insert(rows);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["flow-questions", flow.id] });
      setHasChanges(false);
      toast.success("Questions saved");
    } catch (err: any) {
      toast.error("Failed to save", { description: err?.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (dbQuestions) {
      setQuestions(
        dbQuestions.map(q => ({
          text: q.text,
          type: q.type as QuestionItem["type"],
          required: q.required,
          skippable: q.skippable,
          sort_order: q.sort_order,
          options: (q.options as Array<{ id: string; label: string }>) ?? [],
        }))
      );
    }
    setHasChanges(false);
  };

  const applyTemplate = (key: string) => {
    setQuestions(TEMPLATES[key].questions);
    setHasChanges(true);
    setShowTemplateConfirm(null);
  };

  if (!selectedServer) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center py-32">
          <p className="text-sm text-muted-foreground">Select a server first.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-pixel text-sm text-foreground">Questions</h1>
          <div className="flex items-center gap-2">
            {/* Load template */}
            <div className="relative">
              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => setShowTemplateConfirm("pick")}>
                <Sparkles className="w-3 h-3" /> Load template
              </Button>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => setShowPreview(true)}>
              <Eye className="w-3 h-3" /> Preview
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <StepQuestionBuilder questions={questions} onChange={handleChange} />

            {/* Save / Discard bar */}
            {hasChanges && (
              <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md z-40">
                <div className="container mx-auto px-4 py-3 max-w-xl flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={handleDiscard} className="text-muted-foreground text-xs">
                    <RotateCcw className="w-3 h-3 mr-1" /> Discard changes
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="gradient-mint-lavender text-primary-foreground font-pixel text-[9px] px-5">
                    {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                    Save changes
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Preview modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-md bg-[hsl(228,10%,15%)] border-[hsl(228,10%,20%)] text-foreground max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-sm font-pixel">DM Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <BotMessage text="👋 Welcome! Let's get you set up." />
              {questions.map((q, i) => (
                <div key={i}>
                  <BotMessage text={`${q.required ? "" : "(optional) "}**${q.text}**${q.skippable ? '\nType "skip" to skip.' : ""}`} />
                  {q.type === "select" && q.options.length > 0 ? (
                    <div className="ml-12 mt-1 bg-[hsl(228,10%,20%)] rounded-lg p-2 border border-[hsl(228,10%,25%)]">
                      <p className="text-xs text-muted-foreground mb-1">Select an option</p>
                      {q.options.map(o => (
                        <div key={o.id} className="text-xs text-foreground py-1 px-2 rounded hover:bg-[hsl(228,10%,25%)]">{o.label}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="ml-12 mt-1">
                      <div className="bg-[hsl(228,10%,20%)] rounded-lg px-3 py-2 text-xs text-muted-foreground border border-[hsl(228,10%,25%)]">Type your answer...</div>
                    </div>
                  )}
                </div>
              ))}
              <BotMessage text="🎉 You're all set! Welcome aboard!" />
            </div>
          </DialogContent>
        </Dialog>

        {/* Template confirmation */}
        <Dialog open={showTemplateConfirm === "pick"} onOpenChange={() => setShowTemplateConfirm(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm font-pixel">Load template</DialogTitle>
              <DialogDescription>This will replace your current questions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {Object.entries(TEMPLATES).map(([key, tmpl]) => (
                <Button key={key} variant="outline" className="w-full justify-start text-sm" onClick={() => applyTemplate(key)}>
                  {tmpl.emoji} {tmpl.name}
                </Button>
              ))}
            </div>
            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setShowTemplateConfirm(null)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthLayout>
  );
};

export default Questions;
