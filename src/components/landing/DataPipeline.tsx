import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BouncerMascot } from "@/components/BouncerMascot";

const contactFields = [
  { label: "Name", value: "Sarah Chen" },
  { label: "Role", value: "Industry Researcher" },
  { label: "Company", value: "Tesla" },
  { label: "Website", value: "tesla.com" },
  { label: "LinkedIn", value: "linkedin.com/in/sarahchen" },
  { label: "Email", value: "sarah@tesla.com" },
  { label: "Simulation domains", value: "CFD, Multiphysics" },
  { label: "Source", value: "Discord" },
  { label: "Joined", value: "March 12, 2026" },
];

const dmMessages = [
  { from: "bot", text: "👋 Hey! Quick intro so we can get you set up." },
  { from: "bot", text: "What's your full name?" },
  { from: "user", text: "Sarah Chen" },
  { from: "bot", text: "What's your role?" },
  { from: "user", text: "Industry Researcher" },
  { from: "bot", text: "Company?" },
  { from: "user", text: "Tesla" },
  { from: "bot", text: "Your LinkedIn?" },
  { from: "user", text: "linkedin.com/in/sarahchen" },
  { from: "bot", text: "✅ You're in. Don't cause trouble." },
];

export const DataPipeline = () => {
  return (
    <section className="py-24">
      <div className="velvet-rope mb-16 mx-auto w-3/4" />
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-pixel text-xl md:text-2xl text-center mb-4 text-foreground"
        >
          What you capture
        </motion.h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
          Anonymous Discord user in. Structured CRM contact out.
        </p>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-6 items-start">
            {/* Discord DM side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#2b2d31] rounded-xl border border-border overflow-hidden"
            >
              <div className="bg-[#1e1f22] px-4 py-3 flex items-center gap-2 border-b border-[#1e1f22]">
                <div className="w-2.5 h-2.5 rounded-full bg-velvet-red" />
                <div className="w-2.5 h-2.5 rounded-full bg-pale-yellow" />
                <div className="w-2.5 h-2.5 rounded-full bg-mint" />
                <span className="text-xs text-muted-foreground ml-2">Discord DM</span>
              </div>
              <div className="p-3 space-y-2 max-h-[420px] overflow-y-auto">
                {dmMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className={`flex ${msg.from === "user" ? "justify-end" : ""}`}
                  >
                    <div
                      className={`px-3 py-1.5 rounded-lg text-xs max-w-[220px] ${
                        msg.from === "bot"
                          ? msg.text.includes("✅")
                            ? "bg-mint/20 text-mint border border-mint/30"
                            : "bg-[#383a40] text-foreground"
                          : "bg-[#5865f2] text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Arrow / pipeline center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex flex-col items-center justify-center gap-3 py-16"
            >
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-mint to-transparent" />
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 text-mint" />
              </motion.div>
              <p className="font-pixel text-[7px] text-muted-foreground text-center leading-relaxed">
                AUTO<br />SYNC
              </p>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-mint to-transparent" />
            </motion.div>

            {/* Mobile arrow */}
            <div className="flex lg:hidden justify-center py-4">
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center rotate-90"
              >
                <ArrowRight className="w-4 h-4 text-mint" />
              </motion.div>
            </div>

            {/* CRM Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-lavender/30 overflow-hidden"
            >
              <div className="bg-lavender/10 px-4 py-3 flex items-center gap-2 border-b border-lavender/20">
                <div className="w-8 h-8 rounded-full bg-lavender/20 flex items-center justify-center text-sm font-bold text-lavender">
                  SC
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Sarah Chen</p>
                  <p className="text-[10px] text-muted-foreground">CRM Contact Record</p>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                {contactFields.map((field, i) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span className="text-muted-foreground w-28 flex-shrink-0">{field.label}</span>
                    <span className="text-foreground font-medium">{field.value}</span>
                  </motion.div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["Google Sheets", "HubSpot", "Webhook"].map((tag) => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-mint/10 text-mint border border-mint/20">
                      ✓ Synced to {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
