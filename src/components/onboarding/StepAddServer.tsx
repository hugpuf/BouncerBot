import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Shield, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  permissions: number;
}

export interface SelectedGuild {
  id: string;
  name: string;
  icon: string | null;
}

interface StepAddServerProps {
  selectedGuild: SelectedGuild | null;
  botAdded: boolean;
  onGuildSelect: (guild: SelectedGuild) => void;
  onBotAdded: () => void;
}

const BOT_CLIENT_ID = "1481674934446063848";
const BOT_PERMISSIONS = "402728960";

export const StepAddServer = ({ selectedGuild, botAdded, onGuildSelect, onBotAdded }: StepAddServerProps) => {
  const { session } = useAuth();
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [botInviteClicked, setBotInviteClicked] = useState(false);

  useEffect(() => {
    const fetchGuilds = async () => {
      const token = session?.provider_token;
      if (!token) {
        setError("Discord session expired. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setError("Failed to fetch servers. Please log in again.");
          setLoading(false);
          return;
        }
        const data: DiscordGuild[] = await res.json();
        // Filter to admin-only guilds
        const adminGuilds = data.filter(g => (g.permissions & 0x8) === 0x8);
        setGuilds(adminGuilds);
      } catch {
        setError("Failed to fetch servers.");
      } finally {
        setLoading(false);
      }
    };
    fetchGuilds();
  }, [session?.provider_token]);

  const handleGuildChange = (guildId: string) => {
    const guild = guilds.find(g => g.id === guildId);
    if (guild) {
      onGuildSelect({ id: guild.id, name: guild.name, icon: guild.icon });
    }
  };

  const handleAddBot = () => {
    if (!selectedGuild) return;
    const url = `https://discord.com/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=${BOT_PERMISSIONS}&scope=bot+applications.commands&guild_id=${selectedGuild.id}`;
    window.open(url, "_blank");
    // After they return, they click the confirm button
  };

  const guildIconUrl = (guild: SelectedGuild) =>
    guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`
      : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-pixel text-sm text-foreground mb-2">Add Bouncer to your server</h2>
          <p className="text-sm text-muted-foreground">Loading your Discord servers...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-pixel text-sm text-foreground mb-2">Add Bouncer to your server</h2>
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-pixel text-sm text-foreground mb-2">Add Bouncer to your server</h2>
        <p className="text-sm text-muted-foreground">
          Select which Discord server Bouncer should guard. Only servers where you're an admin are shown.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-primary">
        <Check className="w-4 h-4" />
        <span>Discord connected</span>
      </div>

      {guilds.length === 0 ? (
        <p className="text-sm text-muted-foreground">No servers found where you have admin permissions.</p>
      ) : (
        <Select value={selectedGuild?.id || ""} onValueChange={handleGuildChange}>
          <SelectTrigger className="w-full py-6 bg-muted border-border text-base">
            <SelectValue placeholder="Select a server..." />
          </SelectTrigger>
          <SelectContent>
            {guilds.map(g => (
              <SelectItem key={g.id} value={g.id}>
                <span className="flex items-center gap-2">
                  {g.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=32`}
                      alt=""
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center text-[10px]">
                      {g.name[0]}
                    </span>
                  )}
                  <span>{g.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedGuild && !botAdded && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {!botInviteClicked ? (
            <Button
              onClick={() => { handleAddBot(); setBotInviteClicked(true); }}
              className="w-full py-6 bg-[hsl(235,85%,65%)] hover:bg-[hsl(235,85%,58%)] text-foreground font-medium text-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Add Bouncer to {selectedGuild.name}
            </Button>
          ) : (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Complete the bot authorization in the new tab, then come back here.
              </p>
              <Button
                onClick={onBotAdded}
                className="w-full py-6 gradient-mint-lavender text-primary-foreground font-pixel text-[10px]"
              >
                <Check className="w-4 h-4 mr-2" />
                I've added the bot — continue
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { handleAddBot(); }}
                className="w-full text-xs text-muted-foreground"
              >
                <ExternalLink className="w-3 h-3 mr-1" /> Re-open invite link
              </Button>
            </>
          )}
        </motion.div>
      )}

      {selectedGuild && botAdded && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Bouncer has joined {selectedGuild.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <Shield className="w-3 h-3 text-muted-foreground" />
              <p className="text-[11px] text-muted-foreground">
                Manage Nicknames · Manage Roles · Send Messages · Read History
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
