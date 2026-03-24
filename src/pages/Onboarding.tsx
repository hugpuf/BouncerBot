import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StepAddServer, type SelectedGuild } from "@/components/onboarding/StepAddServer";
import { StepQuestionBuilder, type QuestionItem } from "@/components/onboarding/StepQuestionBuilder";
import { StepDataDestination, type DestinationItem } from "@/components/onboarding/StepDataDestination";
import { StepGoLive } from "@/components/onboarding/StepGoLive";
import { useAuth } from "@/hooks/useAuth";
import { useServerContext } from "@/hooks/useServerContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bouncerLogo from "@/assets/bouncer-logo.png";

const STEPS = ["Server", "Questions", "Data", "Go Live"];

const DEFAULT_WELCOME = "👋 Welcome! Let's get you set up.";
const DEFAULT_SUCCESS = "🎉 You're all set! Welcome aboard!";

const COMMUNITY_TEMPLATE: QuestionItem[] = [
  { text: "What's your full name?", type: "text", required: true, skippable: false, sort_order: 1, options: [] },
  { text: "What best describes your role?", type: "select", required: true, skippable: false, sort_order: 2, options: [{ id: "community-member", label: "Community Member" }, { id: "contributor", label: "Contributor" }, { id: "lurker", label: "Lurker" }] },
  { text: "What are your interests?", type: "text", required: false, skippable: true, sort_order: 3, options: [] },
  { text: "What's your email?", type: "email", required: false, skippable: true, sort_order: 4, options: [] },
  { text: "How did you find us?", type: "text", required: false, skippable: true, sort_order: 5, options: [] },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { servers, serversLoading, setSelectedServerId, refetchServers } = useServerContext();
  const [step, setStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  // Step 1
  const [selectedGuild, setSelectedGuild] = useState<SelectedGuild | null>(null);
  const [botAdded, setBotAdded] = useState(false);

  // Step 2 - pre-loaded with community template
  const [questions, setQuestions] = useState<QuestionItem[]>(COMMUNITY_TEMPLATE);

  // Step 3
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);

  // Step 4
  const [welcomeMessage, setWelcomeMessage] = useState(DEFAULT_WELCOME);
  const [successMessage, setSuccessMessage] = useState(DEFAULT_SUCCESS);
  const [isLive, setIsLive] = useState(false);
  const [saving, setSaving] = useState(false);

  const isFirstTime = !serversLoading && servers.length === 0;

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedGuild && botAdded;
      case 1: return questions.length > 0 && questions.every(q => q.text.trim() !== "");
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 1 && questions.length === 0) {
      toast.error("Add at least one question to continue.");
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (isLive) {
      setIsLive(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  const handleGoLive = async () => {
    if (!session?.user || !selectedGuild) return;
    setSaving(true);

    try {
      // 1. Upsert server
      const { data: server, error: serverErr } = await supabase.from("servers").upsert({
        discord_guild_id: selectedGuild.id,
        name: selectedGuild.name,
        icon_url: selectedGuild.icon
          ? `https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png`
          : null,
        owner_id: session.user.id,
        is_active: true,
      }, { onConflict: "discord_guild_id" }).select().single();

      if (serverErr || !server) throw serverErr || new Error("Failed to create server");

      // 2. Insert flow
      const { data: flow, error: flowErr } = await supabase.from("onboarding_flows").insert({
        server_id: server.id,
        welcome_message: welcomeMessage,
        success_message: successMessage,
        nickname_format: "{name} ({org})",
        is_active: true,
      }).select().single();

      if (flowErr || !flow) throw flowErr || new Error("Failed to create flow");

      // 3. Insert questions
      const questionRows = questions.map((q, i) => ({
        flow_id: flow.id,
        text: q.text,
        type: q.type,
        sort_order: i + 1,
        required: q.required,
        skippable: q.skippable,
        options: q.type === "select" ? q.options : [],
      }));
      const { error: qErr } = await supabase.from("flow_questions").insert(questionRows);
      if (qErr) throw qErr;

      // 4. Insert destinations
      if (destinations.length > 0) {
        const destRows = destinations.map(d => ({
          server_id: server.id,
          type: d.type,
          config: d.config,
          is_active: true,
        }));
        const { error: dErr } = await supabase.from("data_destinations").insert(destRows);
        if (dErr) throw dErr;
      }

      // Set as selected server
      setSelectedServerId(server.id);
      refetchServers();
      setIsLive(true);
      toast.success("You're live! 🚀");
    } catch (err: any) {
      console.error("Go live error:", err);
      toast.error("Something went wrong", { description: err?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Welcome modal for first-time users */}
      {isFirstTime && (
        <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
          <DialogContent className="sm:max-w-md text-center">
            <div className="flex flex-col items-center gap-4 py-4">
              <img
                src={bouncerLogo}
                alt="Bouncer mascot"
                className="h-20 w-auto object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <h2 className="font-pixel text-sm text-foreground">Welcome to Bouncer! 🎉</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Let's set up your first server in under 2 minutes. You'll pick a Discord server, build your question flow, and go live.
              </p>
              <Button
                onClick={() => setShowWelcome(false)}
                className="gradient-mint-lavender text-primary-foreground font-pixel text-[10px] px-8 py-5"
              >
                Let's go
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center gap-3">
          <img src={bouncerLogo} alt="Bouncer logo" className="h-8 w-auto object-contain" style={{ imageRendering: "pixelated" }} />
          <span className="font-pixel text-[9px] text-foreground">Setup</span>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 pt-8 pb-4 max-w-xl">
        <div className="flex items-center gap-2 mb-2">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {STEPS.map((label, i) => (
            <span key={label} className={`text-[10px] font-pixel ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 container mx-auto px-6 max-w-xl pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${isLive}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <StepAddServer
                selectedGuild={selectedGuild}
                botAdded={botAdded}
                onGuildSelect={setSelectedGuild}
                onBotAdded={() => setBotAdded(true)}
              />
            )}
            {step === 1 && (
              <StepQuestionBuilder questions={questions} onChange={setQuestions} />
            )}
            {step === 2 && (
              <StepDataDestination destinations={destinations} onChange={setDestinations} />
            )}
            {step === 3 && (
              <StepGoLive
                guild={selectedGuild}
                questions={questions}
                destinations={destinations}
                welcomeMessage={welcomeMessage}
                successMessage={successMessage}
                onWelcomeMessageChange={setWelcomeMessage}
                onSuccessMessageChange={setSuccessMessage}
                isLive={isLive}
                saving={saving}
                onGoLive={handleGoLive}
                onFinish={handleFinish}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation bar - show on all steps including success */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 max-w-xl flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0 && !isLive} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {step < STEPS.length - 1 && (
            <Button onClick={handleNext} disabled={!canProceed()} className="gradient-mint-lavender text-primary-foreground font-pixel text-[10px] px-6">
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
