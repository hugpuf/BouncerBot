import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useServerContext } from "@/hooks/useServerContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import bouncerLogo from "@/assets/bouncer-logo.png";

const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Questions", to: "/questions" },
  { label: "Integrations", to: "/integrations" },
  { label: "Settings", to: "/settings" },
];

export function AppNavbar() {
  const { discordAvatar, discordUsername, signOut } = useAuth();
  const { servers, selectedServer, setSelectedServerId } = useServerContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={bouncerLogo} alt="Bouncer" className="h-7 w-auto" style={{ imageRendering: "pixelated" }} />
        </Link>

        {/* Server selector */}
        {servers.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-sm max-w-[200px]">
                {selectedServer?.icon_url ? (
                  <img src={selectedServer.icon_url} alt="" className="w-5 h-5 rounded-full" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold">
                    {selectedServer?.name?.[0] ?? "?"}
                  </span>
                )}
                <span className="truncate">{selectedServer?.name ?? "Select server"}</span>
                <ChevronDown className="w-3 h-3 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {servers.map(s => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => setSelectedServerId(s.id)}
                  className={s.id === selectedServer?.id ? "bg-muted" : ""}
                >
                  <span className="flex items-center gap-2">
                    {s.icon_url ? (
                      <img src={s.icon_url} alt="" className="w-5 h-5 rounded-full" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center text-[9px]">
                        {s.name[0]}
                      </span>
                    )}
                    <span className="truncate">{s.name}</span>
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/onboarding")}>
                <Plus className="w-4 h-4 mr-2" />
                Add server
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                location.pathname === link.to
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="hidden md:flex items-center gap-2 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                {discordAvatar ? (
                  <img src={discordAvatar} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-muted" />
                )}
                <span className="text-sm truncate max-w-[100px]">{discordUsername ?? "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden ml-auto text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm ${
                location.pathname === link.to ? "bg-muted text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground w-full">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </header>
  );
}
