import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useServerContext } from "@/hooks/useServerContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { selectedServer, refetchServers } = useServerContext();
  const queryClient = useQueryClient();
  const serverId = selectedServer?.id;

  const { data: flow } = useQuery({
    queryKey: ["active-flow", serverId],
    enabled: !!serverId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_flows")
        .select("*")
        .eq("server_id", serverId!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [nicknameFmt, setNicknameFmt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (flow) {
      setWelcomeMsg(flow.welcome_message);
      setSuccessMsg(flow.success_message);
      setNicknameFmt(flow.nickname_format);
    }
    if (selectedServer) {
      setIsActive(selectedServer.is_active);
    }
  }, [flow, selectedServer]);

  const handleSaveMessages = async () => {
    if (!flow) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("onboarding_flows").update({
        welcome_message: welcomeMsg,
        success_message: successMsg,
        nickname_format: nicknameFmt,
      }).eq("id", flow.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["active-flow", serverId] });
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error("Failed to save", { description: err?.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (val: boolean) => {
    if (!serverId) return;
    setIsActive(val);
    const { error } = await supabase.from("servers").update({ is_active: val }).eq("id", serverId);
    if (error) {
      toast.error("Failed to update");
      setIsActive(!val);
    } else {
      refetchServers();
      toast.success(val ? "Bot activated" : "Bot deactivated");
    }
  };

  const handleDeleteServer = async () => {
    if (!serverId) return;
    setDeleting(true);
    try {
      // Delete in order: questions → flows, destinations, responses, server
      const { data: flows } = await supabase.from("onboarding_flows").select("id").eq("server_id", serverId);
      if (flows) {
        for (const f of flows) {
          await supabase.from("flow_questions").delete().eq("flow_id", f.id);
        }
      }
      await supabase.from("onboarding_flows").delete().eq("server_id", serverId);
      await supabase.from("data_destinations").delete().eq("server_id", serverId);
      await supabase.from("onboarding_responses").delete().eq("server_id", serverId);
      await supabase.from("servers").delete().eq("id", serverId);

      refetchServers();
      toast.success("Server removed");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Failed to delete", { description: err?.message });
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
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
      <div className="container mx-auto px-4 py-8 max-w-xl space-y-8">
        <h1 className="font-pixel text-sm text-foreground">Settings</h1>

        {/* Messages section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-pixel text-[10px] text-foreground">Messages</h2>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Welcome message</Label>
              <Textarea value={welcomeMsg} onChange={e => setWelcomeMsg(e.target.value)} className="bg-muted border-border text-sm" rows={2} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Success message</Label>
              <Textarea value={successMsg} onChange={e => setSuccessMsg(e.target.value)} className="bg-muted border-border text-sm" rows={2} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nickname format</Label>
              <Input value={nicknameFmt} onChange={e => setNicknameFmt(e.target.value)} className="bg-muted border-border text-sm" />
              <p className="text-[10px] text-muted-foreground mt-1">Use {"{name}"} and {"{org}"} as placeholders</p>
            </div>
            <Button size="sm" onClick={handleSaveMessages} disabled={saving} className="gradient-mint-lavender text-primary-foreground font-pixel text-[9px] px-5">
              {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
              Save messages
            </Button>
          </div>
        </div>

        {/* Bot section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-pixel text-[10px] text-foreground">Bot</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Active</p>
              <p className="text-xs text-muted-foreground">When off, bot won't run onboarding for this server</p>
            </div>
            <Switch checked={isActive} onCheckedChange={handleToggleActive} />
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-destructive/30 bg-card p-6 space-y-4">
          <h2 className="font-pixel text-[10px] text-destructive">Danger zone</h2>
          <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)} className="text-xs">
            <Trash2 className="w-3 h-3 mr-1" /> Remove server
          </Button>
        </div>

        <Dialog open={showDelete} onOpenChange={setShowDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-sm font-pixel">Remove server</DialogTitle>
              <DialogDescription>
                This will delete all your onboarding data for <strong>{selectedServer.name}</strong>. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteServer} disabled={deleting}>
                {deleting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                Delete everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthLayout>
  );
};

export default Settings;
