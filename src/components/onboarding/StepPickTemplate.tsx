import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const flowTemplates = [
  {
    id: "community",
    name: "Community Onboarding",
    description: "Name, role, interests, email, how did you find us",
    questions: 5,
    emoji: "🎉",
    questionList: ["What's your full name?", "What best describes your role?", "What are your interests?", "What's your email?", "How did you find us?"],
  },
  {
    id: "research",
    name: "Research Network",
    description: "Name, role type, org, org website, domains, email, LinkedIn, confirmation",
    questions: 8,
    emoji: "🔬",
    questionList: ["What's your full name?", "Role type (academic/industry/dev)?", "Organization name?", "Organization website?", "Domains of interest?", "Email address?", "LinkedIn profile URL?", "Confirm your details"],
  },
  {
    id: "saas",
    name: "SaaS Community",
    description: "Name, company, job title, use case, email, how did you hear about us",
    questions: 6,
    emoji: "🚀",
    questionList: ["What's your full name?", "Company name?", "Job title?", "What's your use case?", "Email address?", "How did you hear about us?"],
  },
  {
    id: "custom",
    name: "Start from scratch",
    description: "Build your own flow in the Door Policy editor",
    questions: 0,
    emoji: "✏️",
    questionList: [],
  },
];

interface StepPickTemplateProps {
  selectedFlow: string | null;
  onSelect: (id: string) => void;
}

export const StepPickTemplate = ({ selectedFlow, onSelect }: StepPickTemplateProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-pixel text-sm text-foreground mb-2">Pick a starting template</h2>
        <p className="text-sm text-muted-foreground">
          Choose a template to start with. You can customize everything in the Door Policy editor.
        </p>
      </div>
      <div className="grid gap-3">
        {flowTemplates.map(ft => (
          <div key={ft.id}>
            <button
              onClick={() => {
                onSelect(ft.id);
                if (ft.questionList.length > 0) toggleExpand(ft.id);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedFlow === ft.id
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-muted hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{ft.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{ft.name}</p>
                  <p className="text-xs text-muted-foreground">{ft.description}</p>
                </div>
                {ft.questions > 0 && (
                  <span className="text-[10px] text-muted-foreground bg-background px-2 py-1 rounded">
                    {ft.questions} questions
                  </span>
                )}
                {ft.questionList.length > 0 && (
                  expandedId === ft.id
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                {selectedFlow === ft.id && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </div>
            </button>
            <AnimatePresence>
              {expandedId === ft.id && ft.questionList.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-10 mt-2 mb-1 space-y-1">
                    {ft.questionList.map((q, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                        <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium">{i + 1}</span>
                        {q}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
