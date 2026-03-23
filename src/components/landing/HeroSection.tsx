import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DiscordMockChat } from "@/components/landing/DiscordMockChat";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import bouncerLogo from "@/assets/bouncer-logo-cropped.png";

const fullText = "Turn anonymous Discord joins into ";
const highlightText = "CRM contacts.";

const sparklePositions = [
  { top: "8%", left: "92%" },
  { top: "25%", left: "3%" },
  { top: "55%", left: "88%" },
  { top: "72%", left: "12%" },
  { top: "40%", left: "50%" },
  { top: "90%", left: "75%" },
  { top: "18%", left: "65%" },
  { top: "65%", left: "35%" },
];

export const HeroSection = () => {
  const [displayedChars, setDisplayedChars] = useState(0);
  const totalChars = fullText.length + highlightText.length;

  useEffect(() => {
    if (displayedChars >= totalChars) return;
    const timeout = setTimeout(() => {
      setDisplayedChars((c) => c + 1);
    }, 45);
    return () => clearTimeout(timeout);
  }, [displayedChars, totalChars]);

  const visibleMain = fullText.slice(0, Math.min(displayedChars, fullText.length));
  const highlightChars = Math.max(0, displayedChars - fullText.length);
  const visibleHighlight = highlightText.slice(0, highlightChars);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Decorative sparkles */}
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-mint rounded-full animate-sparkle"
          style={{
            top: pos.top,
            left: pos.left,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="flex items-end gap-6">
              <img
                src={bouncerLogo}
                alt="Bouncer mascot"
                className="h-36 w-auto object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-card px-4 py-2 rounded-lg pixel-border mb-4"
              >
                <p className="font-pixel text-xs text-mint">You're on the list.</p>
              </motion.div>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl leading-relaxed font-pixel text-foreground">
                {visibleMain}
                {visibleHighlight && (
                  <span className="text-gradient-mint">{visibleHighlight}</span>
                )}
                <span className="inline-block w-[3px] h-[1em] bg-mint ml-1 animate-pulse align-middle" />
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Discord doesn't tell you who just joined. Bouncer captures their name, role, company, email, LinkedIn, and custom fields — then sends it all to your CRM, Google Sheets, or webhook. Automatically.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/onboarding">
                <Button
                  size="lg"
                  className="gradient-mint-lavender text-primary-foreground font-pixel text-xs px-8 py-6 pixel-border-mint hover:scale-105 transition-transform"
                >
                  Start Capturing Data
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Discord mock */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <DiscordMockChat />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
