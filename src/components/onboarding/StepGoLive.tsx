import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BouncerMascot } from "@/components/BouncerMascot";
import { ArrowRight, Eye, Server, MessageSquare, Webhook, Loader2, Sparkles, CheckSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SelectedGuild } from "./StepAddServer";
import type { QuestionItem } from "./StepQuestionBuilder";
import type { DestinationItem } from "./StepDataDestination";

interface StepGoLiveProps {
  guild: SelectedGuild | null;
  questions: QuestionItem[];
  destinations: DestinationItem[];
  welcomeMessage: string;
  successMessage: string;
  onWelcomeMessageChange: (msg: string) => void;
  onSuccessMessageChange: (msg: string) => void;
  isLive: boolean;
  saving: boolean;
  onGoLive: () => void;
  onFinish: () => void;
}

const FAKE_RESPONSES: Record<string, string> = {
  text: "Sarah Chen",
  email: "sarah@example.com",
  url: "https://sarahchen.dev",
};

export const StepGoLive = ({
  guild, questions, destinations, welcomeMessage, successMessage,
  onWelcomeMessageChange, onSuccessMessageChange,
  isLive, saving, onGoLive, onFinish,
}: StepGoLiveProps) => {
  const [showPreview, setShowPreview] = useState(false);

  if (isLive) {
    return (
      <div className="text-center space-y-6">
        <BouncerMascot pose="nod" size={80} />
        <h2 className="font-pixel text-sm text-foreground">You're open for business.</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          New members of <span className="text-foreground font-medium">"{guild?.name}"</span> will now be greeted by Bouncer.
        </p>
        <Button
          onClick={onFinish}
          className="gradient-mint-lavender text-primary-foreground font-pixel text-[10px] px-8 py-5"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  const destLabels = destinations.map(d => {
    if (d.type === "webhook") return "Webhook";
    if (d.type === "google_sheets") return "Google Sheets";
    return d.type;
  });

  // Replace {server_name} in messages for display
  const resolveVars = (msg: string) => msg.replace(/\{server_name\}/g, guild?.name || "your server");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-pixel text-sm text-foreground mb-2">Open the doors</h2>
        <p className="text-sm text-muted-foreground">
          Review your setup, then go live. Every new member will receive your onboarding flow via DM.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-muted p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Server className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Server</span>
          <span className="text-sm text-foreground font-medium ml-auto">{guild?.name || "—"}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Questions</span>
          <span className="text-sm text-foreground font-medium ml-auto">{questions.length}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center gap-3">
          <Webhook className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Destinations</span>
          <span className="text-sm text-foreground font-medium ml-auto">
            {destLabels.length > 0 ? destLabels.join(", ") : "None"}
          </span>
        </div>
      </div>

      {/* Editable messages */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Welcome message</label>
          <Textarea
            value={welcomeMessage}
            onChange={e => onWelcomeMessageChange(e.target.value)}
            className="bg-muted border-border text-sm"
            rows={2}
          />
          <p className="text-[10px] text-muted-foreground mt-1">Use {"{server_name}"} to insert the server name</p>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Success message</label>
          <Textarea
            value={successMessage}
            onChange={e => onSuccessMessageChange(e.target.value)}
            className="bg-muted border-border text-sm"
            rows={2}
          />
        </div>
      </div>

      <Button
        onClick={onGoLive}
        disabled={saving}
        className="w-full gradient-mint-lavender text-primary-foreground font-pixel text-[10px] py-6"
      >
        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Go live 🚀"}
      </Button>

      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Eye className="w-4 h-4" />
        Preview the flow first
      </button>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-md bg-[hsl(228,10%,15%)] border-[hsl(228,10%,20%)] text-foreground max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-pixel">DM Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Welcome message */}
            <BotMessage text={resolveVars(welcomeMessage)} />

            {/* Questions with fake responses */}
            {questions.map((q, i) => (
              <div key={i} className="space-y-2">
                <BotMessage
                  text={`**${q.text}**${!q.required || q.skippable ? " _(optional)_" : ""}${q.skippable ? '\nType "skip" to skip.' : ""}`}
                />
                {q.type === "select" && q.options.length > 0 && (
                  <div className="ml-12">
                    <DiscordSelect options={q.options} selectedIndex={i === 1 ? 0 : undefined} />
                  </div>
                )}
                {q.type === "multi_select" && q.options.length > 0 && (
                  <div className="ml-12">
                    <DiscordMultiSelect options={q.options} selectedIndices={i === 2 ? [0, 2] : undefined} />
                  </div>
                )}
                {(q.type === "text" || q.type === "email" || q.type === "url") && (
                  <div className="ml-12">
                    <div className="bg-[hsl(228,10%,20%)] rounded-lg px-3 py-2 text-xs text-muted-foreground border border-[hsl(228,10%,25%)]">
                      Type your answer...
                    </div>
                  </div>
                )}
                {/* Fake user response */}
                {i < 3 && (
                  <UserMessage
                    text={
                      q.type === "select" ? q.options[0]?.label || "—" :
                      q.type === "multi_select" ? q.options.slice(0, 2).map(o => o.label).join(", ") :
                      FAKE_RESPONSES[q.type] || "Sarah Chen"
                    }
                  />
                )}
              </div>
            ))}

            {/* Success message */}
            <BotMessage text={resolveVars(successMessage)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function BotMessage({ text }: { text: string }) {
  return (
    <div className="flex gap-2">
      <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-[10px] flex-shrink-0">
        🚪
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-primary">BouncerBot.gg</span>
          <span className="text-[8px] bg-primary/20 text-primary px-1 py-0.5 rounded font-bold uppercase tracking-wider">APP</span>
          <span className="text-[10px] text-muted-foreground">Today</span>
        </div>
        <p className="text-sm text-foreground whitespace-pre-wrap">
          {text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/_(.*?)_/g, "$1")
          }
        </p>
      </div>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex gap-2 justify-end">
      <div className="flex-1 min-w-0 text-right">
        <div className="flex items-center gap-2 mb-0.5 justify-end">
          <span className="text-[10px] text-muted-foreground">Today</span>
          <span className="text-xs font-semibold text-[hsl(200,70%,70%)]">Sarah Chen</span>
        </div>
        <p className="text-sm text-foreground">{text}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-[hsl(200,70%,40%)] flex items-center justify-center text-[10px] flex-shrink-0 text-white font-bold">
        SC
      </div>
    </div>
  );
}

function DiscordSelect({ options, selectedIndex }: { options: Array<{ id: string; label: string }>; selectedIndex?: number }) {
  return (
    <div className="bg-[hsl(228,10%,12%)] rounded-lg border border-[hsl(228,10%,25%)] overflow-hidden">
      <div className="px-3 py-2 text-xs text-muted-foreground border-b border-[hsl(228,10%,20%)]">
        Select an option ▾
      </div>
      <div className="p-1">
        {options.map((o, i) => (
          <div
            key={o.id}
            className={`text-xs py-1.5 px-2 rounded flex items-center gap-2 ${
              i === selectedIndex
                ? "bg-primary/20 text-primary"
                : "text-foreground/80 hover:bg-[hsl(228,10%,20%)]"
            }`}
          >
            {i === selectedIndex && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscordMultiSelect({ options, selectedIndices }: { options: Array<{ id: string; label: string }>; selectedIndices?: number[] }) {
  const selected = selectedIndices || [];
  return (
    <div className="bg-[hsl(228,10%,12%)] rounded-lg border border-[hsl(228,10%,25%)] overflow-hidden">
      <div className="px-3 py-2 text-xs text-muted-foreground border-b border-[hsl(228,10%,20%)]">
        Select options ▾
      </div>
      <div className="p-1">
        {options.map((o, i) => (
          <div
            key={o.id}
            className={`text-xs py-1.5 px-2 rounded flex items-center gap-2 ${
              selected.includes(i)
                ? "bg-primary/20 text-primary"
                : "text-foreground/80"
            }`}
          >
            <CheckSquare className={`w-3 h-3 ${selected.includes(i) ? "text-primary" : "text-muted-foreground/40"}`} />
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}
