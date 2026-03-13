import bouncerLogo from "@/assets/bouncer-logo.png";

const links = [
  { label: "House Rules", href: "#" },
  { label: "Discord", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={bouncerLogo} alt="Bouncer logo" className="h-12 w-auto object-contain" style={{ imageRendering: "pixelated" }} />
            <div>
              <p className="font-pixel text-xs text-foreground">Bouncer</p>
              <p className="text-xs text-muted-foreground">Checking IDs since 2026</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
