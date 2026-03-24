import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface QuestionItem {
  text: string;
  type: "text" | "select" | "multi_select" | "email" | "url";
  required: boolean;
  skippable: boolean;
  sort_order: number;
  options: Array<{ id: string; label: string }>;
}

const TYPE_LABELS: Record<QuestionItem["type"], string> = {
  text: "Text",
  select: "Single Select",
  multi_select: "Multi Select",
  email: "Email",
  url: "URL",
};

const TEMPLATES: Record<string, { name: string; emoji: string; questions: QuestionItem[] }> = {
  community: {
    name: "Community Onboarding",
    emoji: "🎉",
    questions: [
      { text: "What's your name?", type: "text", required: true, skippable: false, sort_order: 1, options: [] },
      { text: "What best describes your role?", type: "select", required: true, skippable: false, sort_order: 2, options: [{ id: "community-member", label: "Community Member" }, { id: "contributor", label: "Contributor" }, { id: "moderator", label: "Moderator" }, { id: "just-browsing", label: "Just Browsing" }] },
      { text: "What are you interested in?", type: "multi_select", required: false, skippable: true, sort_order: 3, options: [{ id: "design", label: "Design" }, { id: "engineering", label: "Engineering" }, { id: "product", label: "Product" }, { id: "marketing", label: "Marketing" }, { id: "business", label: "Business" }, { id: "other", label: "Other" }] },
      { text: "How did you find us?", type: "select", required: false, skippable: true, sort_order: 4, options: [{ id: "twitter", label: "Twitter" }, { id: "linkedin", label: "LinkedIn" }, { id: "friend", label: "Friend" }, { id: "google", label: "Google" }, { id: "event", label: "Event" }, { id: "other", label: "Other" }] },
      { text: "What's your email?", type: "email", required: false, skippable: true, sort_order: 5, options: [] },
    ],
  },
  research: {
    name: "Research Network",
    emoji: "🔬",
    questions: [
      { text: "What's your full name?", type: "text", required: true, skippable: false, sort_order: 1, options: [] },
      { text: "What's your role?", type: "select", required: true, skippable: false, sort_order: 2, options: [{ id: "student", label: "Student" }, { id: "postdoc", label: "Postdoc" }, { id: "professor", label: "Professor" }, { id: "industry", label: "Industry Researcher" }] },
      { text: "What's your organization?", type: "text", required: true, skippable: false, sort_order: 3, options: [] },
      { text: "What are your research areas?", type: "multi_select", required: true, skippable: false, sort_order: 4, options: [{ id: "ai-ml", label: "AI / Machine Learning" }, { id: "biology", label: "Biology" }, { id: "physics", label: "Physics" }, { id: "chemistry", label: "Chemistry" }, { id: "engineering", label: "Engineering" }, { id: "social-sciences", label: "Social Sciences" }, { id: "other", label: "Other" }] },
      { text: "What's your institutional email?", type: "email", required: true, skippable: false, sort_order: 5, options: [] },
      { text: "Google Scholar or personal site?", type: "url", required: false, skippable: true, sort_order: 6, options: [] },
      { text: "Open to collaborations?", type: "select", required: true, skippable: false, sort_order: 7, options: [{ id: "yes", label: "Yes, definitely!" }, { id: "maybe", label: "Maybe, depends" }, { id: "no", label: "Just here to learn" }] },
    ],
  },
  saas: {
    name: "SaaS Community",
    emoji: "🚀",
    questions: [
      { text: "What's your name?", type: "text", required: true, skippable: false, sort_order: 1, options: [] },
      { text: "Company name?", type: "text", required: true, skippable: false, sort_order: 2, options: [] },
      { text: "What's your role?", type: "select", required: true, skippable: false, sort_order: 3, options: [{ id: "founder", label: "Founder / CEO" }, { id: "product", label: "Product" }, { id: "engineering", label: "Engineering" }, { id: "marketing", label: "Marketing" }, { id: "sales", label: "Sales" }, { id: "other", label: "Other" }] },
      { text: "Are you a customer?", type: "select", required: true, skippable: false, sort_order: 4, options: [{ id: "yes", label: "Yes" }, { id: "trial", label: "On a trial" }, { id: "evaluating", label: "Evaluating" }, { id: "not-yet", label: "Not yet" }] },
      { text: "What features interest you?", type: "multi_select", required: false, skippable: true, sort_order: 5, options: [{ id: "analytics", label: "Analytics" }, { id: "integrations", label: "Integrations" }, { id: "automation", label: "Automation" }, { id: "api", label: "API" }, { id: "support", label: "Support" }] },
      { text: "Work email?", type: "email", required: true, skippable: false, sort_order: 6, options: [] },
    ],
  },
};

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "option";
}

interface StepQuestionBuilderProps {
  questions: QuestionItem[];
  onChange: (questions: QuestionItem[]) => void;
}

export const StepQuestionBuilder = ({ questions, onChange }: StepQuestionBuilderProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const reorder = (updated: QuestionItem[]) => {
    onChange(updated.map((q, i) => ({ ...q, sort_order: i + 1 })));
  };

  const addQuestion = () => {
    const newQ: QuestionItem = {
      text: "",
      type: "text",
      required: true,
      skippable: false,
      sort_order: questions.length + 1,
      options: [],
    };
    onChange([...questions, newQ]);
    setExpandedIndex(questions.length);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    reorder(updated);
    if (expandedIndex === index) setExpandedIndex(null);
    else if (expandedIndex !== null && expandedIndex > index) setExpandedIndex(expandedIndex - 1);
  };

  const updateQuestion = (index: number, patch: Partial<QuestionItem>) => {
    const updated = questions.map((q, i) => (i === index ? { ...q, ...patch } : q));
    onChange(updated);
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    const updated = [...questions];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    reorder(updated);
    setExpandedIndex(target);
  };

  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    const newOpt = { id: `option-${q.options.length + 1}`, label: "" };
    updateQuestion(qIndex, { options: [...q.options, newOpt] });
  };

  const updateOption = (qIndex: number, optIndex: number, label: string) => {
    const q = questions[qIndex];
    const options = q.options.map((o, i) =>
      i === optIndex ? { ...o, label, id: slugify(label) || o.id } : o
    );
    updateQuestion(qIndex, { options });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const q = questions[qIndex];
    updateQuestion(qIndex, { options: q.options.filter((_, i) => i !== optIndex) });
  };

  const applyTemplate = (key: string) => {
    onChange(TEMPLATES[key].questions);
    setExpandedIndex(0);
  };

  const hasOptions = (type: QuestionItem["type"]) => type === "select" || type === "multi_select";

  const handleTypeChange = (index: number, newType: QuestionItem["type"]) => {
    const q = questions[index];
    const keepOptions = hasOptions(newType);
    updateQuestion(index, {
      type: newType,
      options: keepOptions ? q.options : [],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-pixel text-sm text-foreground mb-2">Build your questions</h2>
        <p className="text-sm text-muted-foreground">
          Create the questions new members will answer. You can start from a template or build from scratch.
        </p>
      </div>

      {/* Template presets */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Quick start from template
        </p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(TEMPLATES).map(([key, tmpl]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => applyTemplate(key)}
              className="text-xs"
            >
              {tmpl.emoji} {tmpl.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Question list */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {questions.map((q, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-border rounded-xl bg-muted overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full flex items-center gap-3 p-3 text-left"
              >
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground flex-1 truncate">
                  {q.text || "Untitled question"}
                </span>
                <span className="text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded">
                  {TYPE_LABELS[q.type]}
                </span>
              </button>

              {/* Expanded editor */}
              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                      <Input
                        placeholder="Question text..."
                        value={q.text}
                        onChange={e => updateQuestion(i, { text: e.target.value })}
                        className="bg-background border-border"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Type</Label>
                          <Select value={q.type} onValueChange={(v) => handleTypeChange(i, v as QuestionItem["type"])}>
                            <SelectTrigger className="bg-background border-border text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="select">Single Select</SelectItem>
                              <SelectItem value="multi_select">Multi Select</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">Required</Label>
                            <Switch checked={q.required} onCheckedChange={v => updateQuestion(i, { required: v, skippable: v ? false : q.skippable })} />
                          </div>
                          {!q.required && (
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">Skippable</Label>
                              <Switch checked={q.skippable} onCheckedChange={v => updateQuestion(i, { skippable: v })} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Multi select note */}
                      {q.type === "multi_select" && (
                        <p className="text-xs text-muted-foreground bg-primary/10 rounded-lg px-3 py-2">
                          Users can pick multiple options.
                        </p>
                      )}

                      {/* Options editor for select & multi_select */}
                      {hasOptions(q.type) && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Options</Label>
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <Input
                                placeholder="Option label..."
                                value={opt.label}
                                onChange={e => updateOption(i, oi, e.target.value)}
                                className="bg-background border-border text-sm flex-1"
                              />
                              <button onClick={() => removeOption(i, oi)} className="text-muted-foreground hover:text-destructive">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" onClick={() => addOption(i)} className="text-xs text-muted-foreground">
                            <Plus className="w-3 h-3 mr-1" /> Add option
                          </Button>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1 pt-1">
                        <Button variant="ghost" size="sm" onClick={() => moveQuestion(i, -1)} disabled={i === 0} className="text-muted-foreground p-1 h-7 w-7">
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => moveQuestion(i, 1)} disabled={i === questions.length - 1} className="text-muted-foreground p-1 h-7 w-7">
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <div className="flex-1" />
                        <Button variant="ghost" size="sm" onClick={() => removeQuestion(i)} className="text-destructive hover:text-destructive p-1 h-7 w-7">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button variant="outline" onClick={addQuestion} className="w-full text-sm">
        <Plus className="w-4 h-4 mr-1" /> Add question
      </Button>
    </div>
  );
};
