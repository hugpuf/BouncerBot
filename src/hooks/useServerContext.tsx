import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

type Server = Tables<"servers">;

interface ServerContextType {
  servers: Server[];
  serversLoading: boolean;
  selectedServer: Server | null;
  selectedServerId: string | null;
  setSelectedServerId: (id: string | null) => void;
  refetchServers: () => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export function ServerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  const { data: servers = [], isLoading: serversLoading, refetch: refetchServers } = useQuery({
    queryKey: ["servers", user?.id],
    enabled: !!user,
    queryFn: async () => {
      console.log("Fetching servers for user:", user!.id);
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Server fetch error:", error);
        throw error;
      }
      console.log("Servers found:", data?.length, data);
      return data;
    },
  });

  // Auto-select first server if none selected
  useEffect(() => {
    if (!selectedServerId && servers.length > 0) {
      setSelectedServerId(servers[0].id);
    }
    // Clear selection if server no longer exists
    if (selectedServerId && servers.length > 0 && !servers.find(s => s.id === selectedServerId)) {
      setSelectedServerId(servers[0].id);
    }
  }, [servers, selectedServerId]);

  const selectedServer = servers.find(s => s.id === selectedServerId) ?? null;

  return (
    <ServerContext.Provider value={{ servers, serversLoading, selectedServer, selectedServerId, setSelectedServerId, refetchServers }}>
      {children}
    </ServerContext.Provider>
  );
}

export function useServerContext() {
  const ctx = useContext(ServerContext);
  if (!ctx) throw new Error("useServerContext must be used within ServerProvider");
  return ctx;
}
