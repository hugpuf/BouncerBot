import { Button } from "@/components/ui/button";
import { BouncerMascot } from "@/components/BouncerMascot";
import { ArrowRight, Eye, Server, LayoutTemplate, MessageSquare, Webhook } from "lucide-react";

interface StepGoLiveProps {
  serverName: string;
  templateName: string;
  questionCount: number;
  destination: string | null;
  isLive: boolean;
  onGoLive: () => void;
  onPreview: () => void;
  onFinish: () => void;
}

const TEMPLATE_MAP: Record<string, { name: string; count: number }> = {
  community: { name: "Community Onboarding", count: 5 },
  research: { name: "Research Network", count: 8 },
  saas: { name: "SaaS Community", count: 6 },
  custom: { name: "Custom (from scratch)", count: 0 },
};

const DEST_MAP: Record<string, string> = {
  webhook: "Webhook",
  sheets: "Google Sheets",
};

export const StepGoLive = ({ serverName, templateName, questionCount, destination, isLive, onGoLive, onPreview, onFinish }: StepGoLiveProps) => {
  if (isLive) {
    return (
      <div className="text-center space-y-6">
        <BouncerMascot pose="nod" size={80} />
        <h2 className="font-pixel text-sm text-foreground">You're open for business.</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          New members of <span className="text-foreground font-medium">"{serverName}"</span> will now be greeted by Bouncer.
        </p>
        <Button
          onClick={onFinish}
          className="gradient-mint-lavender text-primary-foreground font-pixel text-[10px] px-8 py-5"
        >
          Go to The Clipboard <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  const tmpl = TEMPLATE_MAP[templateName] || { name: templateName, count: questionCount };
  const destLabel = destination ? (DEST_MAP[destination] || destination) : "None (skip for now)";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-pixel text-sm text-foreground mb-2">Open the doors</h2>
        <p className="text-sm text-muted-foreground">
          Bouncer is configured and ready. When you go live, every new member will receive your onboarding flow via DM.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Server className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Server</span>
          <span className="text-sm text-foreground font-medium ml-auto">{serverName}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center gap-3">
          <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Template</span>
          <span className="text-sm text-foreground font-medium ml-auto">{tmpl.name}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Questions</span>
          <span className="text-sm text-foreground font-medium ml-auto">{tmpl.count}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center gap-3">
          <Webhook className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Data destination</span>
          <span className="text-sm text-foreground font-medium ml-auto">{destLabel}</span>
        </div>
      </div>

      <Button
        onClick={onGoLive}
        className="w-full gradient-mint-lavender text-primary-foreground font-pixel text-[10px] py-6"
      >
        Go live 🚀
      </Button>

      <button
        onClick={onPreview}
        className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Eye className="w-4 h-4" />
        Preview the flow first
      </button>
    </div>
  );
};
