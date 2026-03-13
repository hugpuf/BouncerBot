import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import bouncerLogo from "@/assets/bouncer-logo.png";

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={bouncerLogo} alt="Bouncer logo" className="h-10 w-auto object-contain" style={{ imageRendering: "pixelated" }} />
          <span className="font-pixel text-xs text-foreground">Bouncer</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="font-pixel text-[9px]">
              The Clipboard
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button size="sm" className="gradient-mint-lavender text-primary-foreground font-pixel text-[9px]">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
