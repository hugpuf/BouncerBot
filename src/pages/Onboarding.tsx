import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepAddServer } from "@/components/onboarding/StepAddServer";
import { StepPickTemplate } from "@/components/onboarding/StepPickTemplate";
import { StepDataDestination } from "@/components/onboarding/StepDataDestination";
import { StepGoLive } from "@/components/onboarding/StepGoLive";
import bouncerLogo from "@/assets/bouncer-logo.png";

const STEPS = ["Server", "Template", "Data", "Go Live"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 1: Server
  const [serverName, setServerName] = useState("");

  // Step 2: Template
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);

  // Step 3: Data destination
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");

  // Step 4: Go Live
  const [isLive, setIsLive] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 0: return !!serverName;
      case 1: return !!selectedFlow;
      case 2: return true; // destination is optional
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

  const handleGoLive = () => {
    setIsLive(true);
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  const questionCount = selectedFlow === "community" ? 5 : selectedFlow === "research" ? 8 : selectedFlow === "saas" ? 6 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center gap-3">
          <img
            src={bouncerLogo}
            alt="Bouncer logo"
            className="h-8 w-auto object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <span className="font-pixel text-[9px] text-foreground">Setup</span>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-6 pt-8 pb-4 max-w-xl">
        <div className="flex items-center gap-2 mb-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`text-[10px] font-pixel ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
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
              <StepAddServer serverName={serverName} onServerSelect={setServerName} />
            )}
            {step === 1 && (
              <StepPickTemplate selectedFlow={selectedFlow} onSelect={setSelectedFlow} />
            )}
            {step === 2 && (
              <StepDataDestination
                selectedDest={selectedDest}
                onSelect={setSelectedDest}
                webhookUrl={webhookUrl}
                onWebhookUrlChange={setWebhookUrl}
              />
            )}
            {step === 3 && (
              <StepGoLive
                serverName={serverName}
                templateName={selectedFlow || "custom"}
                questionCount={questionCount}
                destination={selectedDest}
                isLive={isLive}
                onGoLive={handleGoLive}
                onPreview={() => {}}
                onFinish={handleFinish}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav (hidden on last step when live) */}
      {!(step === 3 && isLive) && step !== 3 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 max-w-xl flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gradient-mint-lavender text-primary-foreground font-pixel text-[10px] px-6"
            >
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
