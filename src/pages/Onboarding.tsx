import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepAddServer, type SelectedGuild } from "@/components/onboarding/StepAddServer";
import { StepQuestionBuilder, type QuestionItem } from "@/components/onboarding/StepQuestionBuilder";
import { StepDataDestination, type DestinationItem } from "@/components/onboarding/StepDataDestination";
import { StepGoLive } from "@/components/onboarding/StepGoLive";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bouncerLogo from "@/assets/bouncer-logo.png";

const STEPS = ["Server", "Questions", "Data", "Go Live"];

const DEFAULT_WELCOME = "👋 Welcome! Let's get you set up.";
const DEFAULT_SUCCESS = "🎉 You're all set! Welcome aboard!";

const Onboarding = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [step, setStep] = useState(0);

  // Step 1
  const [selectedGuild, setSelectedGuild] = useState<SelectedGuild | null>(null);
  const [botAdded, setBotAdded] = useState(false);

  // Step 2
  const [questions, setQuestions] = useState<QuestionItem[]>([
    { text: "", type: "text", required: true, skippable: false, sort_order: 1, options: [] },
  ]);

  // Step 3
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);

  // Step 4
  const [welcomeMessage, setWelcomeMessage] = useState(DEFAULT_WELCOME);
  const [successMessage, setSuccessMessage] = useState(DEFAULT_SUCCESS);
  const [isLive, setIsLive] = useState(false);
  const [saving, setSaving] = useState(false);

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
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleGoLive = async () => {
    if (!session?.user || !selectedGuild) return;
    setSaving(true);

    try {
      // 1. Insert server
      const { data: server, error: serverErr } = await supabase.from("servers").insert({
        discord_guild_id: selectedGuild.id,
        name: selectedGuild.name,
        icon_url: selectedGuild.icon
          ? `https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png`
          : null,
        owner_id: session.user.id,
        is_active: true,
      }).select().single();

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
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center gap-3">
          <img src={bouncerLogo} alt="Bouncer logo" className="h-8 w-auto object-contain" style={{ imageRendering: "pixelated" }} />
          <span className="font-pixel text-[9px] text-foreground">Setup</span>
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
            key={step}
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

      {!(step === 3) && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 max-w-xl flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} disabled={step === 0} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()} className="gradient-mint-lavender text-primary-foreground font-pixel text-[10px] px-6">
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
