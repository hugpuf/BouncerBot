import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Webhook, Zap, Lock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SAMPLE_PAYLOAD = `{
  "event": "member_onboarded",
  "timestamp": "2026-03-12T15:00:00Z",
  "server": "Server Name",
  "user": { "id": "123456", "username": "newmember" },
  "onboarding": {
    "full_name": "Jane Smith",
    "role_type": "Designer",
    "organization": "Acme Inc",
    "email": "jane@acme.com"
  }
}`;

interface StepDataDestinationProps {
  selectedDest: string | null;
  onSelect: (id: string | null) => void;
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

export const StepDataDestination = ({ selectedDest, onSelect, webhookUrl, onWebhookUrlChange }: StepDataDestinationProps) => {
  const [testSent, setTestSent] = useState(false);
  const [showPayload, setShowPayload] = useState(false);

  const handleTestPing = () => {
    setTestSent(true);
    toast.success("Test ping sent!", { description: "Check your webhook endpoint for the sample payload." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-pixel text-sm text-foreground mb-2">Where should the data go?</h2>
        <p className="text-sm text-muted-foreground">
          Bouncer captures structured data from every new member. Tell us where to send it.
        </p>
      </div>

      <div className="grid gap-3">
        {/* Webhook */}
        <div>
          <button
            onClick={() => onSelect(selectedDest === "webhook" ? null : "webhook")}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedDest === "webhook"
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-border bg-muted hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Webhook className={`w-5 h-5 ${selectedDest === "webhook" ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Webhook</p>
                <p className="text-xs text-muted-foreground">Send JSON to any endpoint</p>
              </div>
              {selectedDest === "webhook" && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
          </button>
          <AnimatePresence>
            {selectedDest === "webhook" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <Input
                    placeholder="https://your-endpoint.com/webhook"
                    value={webhookUrl}
                    onChange={e => onWebhookUrlChange(e.target.value)}
                    className="bg-muted border-border"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleTestPing}
                      disabled={!webhookUrl.startsWith("http")}
                      className="text-xs"
                    >
                      {testSent ? <><Check className="w-3 h-3 mr-1" /> Sent</> : "Send test ping"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPayload(!showPayload)}
                      className="text-xs text-muted-foreground"
                    >
                      {showPayload ? "Hide" : "View"} payload schema
                    </Button>
                  </div>
                  <AnimatePresence>
                    {showPayload && (
                      <motion.pre
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden text-[11px] text-muted-foreground bg-background rounded-lg p-3 border border-border"
                      >
                        {SAMPLE_PAYLOAD}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Google Sheets */}
        <button
          onClick={() => onSelect(selectedDest === "sheets" ? null : "sheets")}
          className={`w-full text-left p-4 rounded-xl border transition-all ${
            selectedDest === "sheets"
              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
              : "border-border bg-muted hover:border-primary/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <Zap className={`w-5 h-5 ${selectedDest === "sheets" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Google Sheets</p>
              <p className="text-xs text-muted-foreground">Auto-fill a spreadsheet · Standard + VIP</p>
            </div>
            {selectedDest === "sheets" && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
          </div>
        </button>

        {/* Locked integrations */}
        {[
          { name: "Airtable", desc: "Sync onboarding data to Airtable bases" },
          { name: "Notion", desc: "Create database entries in Notion" },
          { name: "CRM (HubSpot, Attio, Salesforce)", desc: "Push contacts to your CRM" },
        ].map(item => (
          <div
            key={item.name}
            className="w-full text-left p-4 rounded-xl border border-border bg-muted opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span className="text-[10px] font-pixel px-2 py-1 rounded bg-secondary/20 text-secondary">
                VIP
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        You can always connect integrations later in the Back Office.
      </p>
    </div>
  );
};
