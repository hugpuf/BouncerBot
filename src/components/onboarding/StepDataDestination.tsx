import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Webhook, Zap, Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface DestinationItem {
  type: string;
  config: Record<string, string>;
}

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
  destinations: DestinationItem[];
  onChange: (destinations: DestinationItem[]) => void;
}

export const StepDataDestination = ({ destinations, onChange }: StepDataDestinationProps) => {
  const [showPayload, setShowPayload] = useState(false);

  const isSelected = (type: string) => destinations.some(d => d.type === type);
  const getConfig = (type: string) => destinations.find(d => d.type === type)?.config || {};

  const toggleDestination = (type: string) => {
    if (isSelected(type)) {
      onChange(destinations.filter(d => d.type !== type));
    } else {
      onChange([...destinations, { type, config: {} }]);
    }
  };

  const updateConfig = (type: string, key: string, value: string) => {
    onChange(
      destinations.map(d =>
        d.type === type ? { ...d, config: { ...d.config, [key]: value } } : d
      )
    );
  };

  const webhookUrl = getConfig("webhook").url || "";
  const sheetsUrl = getConfig("google_sheets").sheet_url || "";

  const handleTestPing = () => {
    toast.success("Test ping sent!", { description: "Check your webhook endpoint for the sample payload." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-pixel text-sm text-foreground mb-2">Where should the data go?</h2>
        <p className="text-sm text-muted-foreground">
          Bouncer captures structured data from every new member. You can select multiple destinations.
        </p>
      </div>

      <div className="grid gap-3">
        {/* Webhook */}
        <div>
          <button
            onClick={() => toggleDestination("webhook")}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              isSelected("webhook")
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-border bg-muted hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Webhook className={`w-5 h-5 ${isSelected("webhook") ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Webhook</p>
                <p className="text-xs text-muted-foreground">Send JSON to any endpoint</p>
              </div>
              {isSelected("webhook") && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
          </button>
          <AnimatePresence>
            {isSelected("webhook") && (
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
                    onChange={e => updateConfig("webhook", "url", e.target.value)}
                    className="bg-muted border-border"
                  />
                  {webhookUrl && !webhookUrl.startsWith("https://") && (
                    <p className="text-xs text-destructive">URL must start with https://</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleTestPing}
                      disabled={!webhookUrl.startsWith("https://")}
                      className="text-xs"
                    >
                      Send test ping
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
        <div>
          <button
            onClick={() => toggleDestination("google_sheets")}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              isSelected("google_sheets")
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-border bg-muted hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap className={`w-5 h-5 ${isSelected("google_sheets") ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Google Sheets</p>
                <p className="text-xs text-muted-foreground">Auto-fill a spreadsheet</p>
              </div>
              {isSelected("google_sheets") && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
          </button>
          <AnimatePresence>
            {isSelected("google_sheets") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  <Input
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetsUrl}
                    onChange={e => updateConfig("google_sheets", "sheet_url", e.target.value)}
                    className="bg-muted border-border"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
