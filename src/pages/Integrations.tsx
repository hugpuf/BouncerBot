import { useState, useEffect } from "react";
import { useServerContext } from "@/hooks/useServerContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Check, Webhook, Zap, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

const Integrations = () => {
  const { selectedServer } = useServerContext();
  const queryClient = useQueryClient();
  const serverId = selectedServer?.id;

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["destinations", serverId],
    enabled: !!serverId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_destinations")
        .select("*")
        .eq("server_id", serverId!);
      if (error) throw error;
      return data;
    },
  });

  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [sheetsEnabled, setSheetsEnabled] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [showPayload, setShowPayload] = useState(false);

  useEffect(() => {
    const wh = destinations.find(d => d.type === "webhook");
    const gs = destinations.find(d => d.type === "google_sheets");
    setWebhookEnabled(!!wh?.is_active);
    setWebhookUrl((wh?.config as any)?.url ?? "");
    setSheetsEnabled(!!gs?.is_active);
    setSheetsUrl((gs?.config as any)?.sheet_url ?? "");
  }, [destinations]);

  const upsertDestination = async (type: string, isActive: boolean, config: Record<string, string>) => {
    if (!serverId) return;
    const existing = destinations.find(d => d.type === type);
    try {
      if (existing) {
        const { error } = await supabase.from("data_destinations").update({ is_active: isActive, config }).eq("id", existing.id);
        if (error) throw error;
      } else if (isActive) {
        const { error } = await supabase.from("data_destinations").insert({ server_id: serverId, type, config, is_active: true });
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["destinations", serverId] });
      toast.success(`${type === "webhook" ? "Webhook" : "Google Sheets"} updated`);
    } catch (err: any) {
      toast.error("Failed to save", { description: err?.message });
    }
  };

  const handleWebhookToggle = (v: boolean) => {
    setWebhookEnabled(v);
    upsertDestination("webhook", v, { url: webhookUrl });
  };

  const handleWebhookSave = () => {
    upsertDestination("webhook", webhookEnabled, { url: webhookUrl });
  };

  const handleSheetsToggle = (v: boolean) => {
    setSheetsEnabled(v);
    upsertDestination("google_sheets", v, { sheet_url: sheetsUrl });
  };

  const handleSheetsSave = () => {
    upsertDestination("google_sheets", sheetsEnabled, { sheet_url: sheetsUrl });
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
        <h1 className="font-pixel text-sm text-foreground mb-6">Integrations</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Webhook */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Webhook className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Webhook</p>
                    <p className="text-xs text-muted-foreground">Send JSON to any endpoint</p>
                  </div>
                </div>
                <Switch checked={webhookEnabled} onCheckedChange={handleWebhookToggle} />
              </div>
              <AnimatePresence>
                {webhookEnabled && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-3 pt-2">
                      <Input
                        placeholder="https://your-endpoint.com/webhook"
                        value={webhookUrl}
                        onChange={e => setWebhookUrl(e.target.value)}
                        onBlur={handleWebhookSave}
                        className="bg-muted border-border"
                      />
                      {webhookUrl && !webhookUrl.startsWith("https://") && (
                        <p className="text-xs text-destructive">URL must start with https://</p>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setShowPayload(!showPayload)} className="text-xs text-muted-foreground">
                        {showPayload ? "Hide" : "View"} payload schema
                      </Button>
                      {showPayload && (
                        <pre className="text-[11px] text-muted-foreground bg-muted rounded-lg p-3 border border-border overflow-x-auto">{SAMPLE_PAYLOAD}</pre>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Google Sheets */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Google Sheets</p>
                    <p className="text-xs text-muted-foreground">Auto-fill a spreadsheet</p>
                  </div>
                </div>
                <Switch checked={sheetsEnabled} onCheckedChange={handleSheetsToggle} />
              </div>
              <AnimatePresence>
                {sheetsEnabled && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-2">
                      <Input
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        value={sheetsUrl}
                        onChange={e => setSheetsUrl(e.target.value)}
                        onBlur={handleSheetsSave}
                        className="bg-muted border-border"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Locked */}
            {[
              { name: "Airtable", desc: "Sync onboarding data to Airtable bases" },
              { name: "Notion", desc: "Create database entries in Notion" },
              { name: "CRM (HubSpot, Attio, Salesforce)", desc: "Push contacts to your CRM" },
            ].map(item => (
              <div key={item.name} className="rounded-xl border border-border bg-card p-5 opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <span className="text-[10px] font-pixel px-2 py-1 rounded bg-secondary/20 text-secondary">VIP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Integrations;
