import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Shield } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_SERVERS = [
  { id: "1", name: "Hugo's Community", icon: "🏠" },
  { id: "2", name: "Design Collective", icon: "🎨" },
  { id: "3", name: "Dev Squad", icon: "💻" },
];

interface StepAddServerProps {
  serverName: string;
  onServerSelect: (name: string) => void;
}

export const StepAddServer = ({ serverName, onServerSelect }: StepAddServerProps) => {
  const [connected, setConnected] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string>("");

  const handleConnect = () => {
    // Mock OAuth flow
    setConnected(true);
  };

  const handleServerChange = (id: string) => {
    setSelectedServerId(id);
    const server = MOCK_SERVERS.find(s => s.id === id);
    if (server) onServerSelect(server.name);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-pixel text-sm text-foreground mb-2">Add Bouncer to your server</h2>
        <p className="text-sm text-muted-foreground">
          Select which Discord server Bouncer should guard. You'll need admin permissions.
        </p>
      </div>

      {!connected ? (
        <Button
          onClick={handleConnect}
          className="w-full py-6 bg-[hsl(235,85%,65%)] hover:bg-[hsl(235,85%,58%)] text-foreground font-medium text-sm"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Connect Discord
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-sm text-primary">
            <Check className="w-4 h-4" />
            <span>Discord connected</span>
          </div>

          <Select value={selectedServerId} onValueChange={handleServerChange}>
            <SelectTrigger className="w-full py-6 bg-muted border-border text-base">
              <SelectValue placeholder="Select a server..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_SERVERS.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  <span className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {serverName && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Bouncer has joined {serverName}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground">
                    Manage Nicknames · Manage Roles · Send Messages · Read History
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
