import { motion } from "framer-motion";
import { BouncerMascot } from "@/components/BouncerMascot";

const messages = [
  { from: "bot", text: "👋 Welcome! Let's get you set up.", delay: 0.2 },
  { from: "bot", text: "What's your name?", delay: 0.6 },
  { from: "user", text: "Alex Chen", delay: 1.2 },
  { from: "bot", text: "What brings you here?", delay: 1.8, hasSelect: true },
  { from: "user", text: "🎨 Design", delay: 2.6 },
  { from: "bot", text: "You're in. Don't cause trouble. 😎", delay: 3.2, isSuccess: true },
];

export const DiscordMockChat = () => {
  return (
    <div className="bg-[#2b2d31] rounded-xl border border-border overflow-hidden shadow-2xl max-w-md mx-auto">
      {/* Title bar */}
      <div className="bg-[#1e1f22] px-4 py-3 flex items-center gap-2 border-b border-[#1e1f22]">
        <div className="w-3 h-3 rounded-full bg-velvet-red" />
        <div className="w-3 h-3 rounded-full bg-pale-yellow" />
        <div className="w-3 h-3 rounded-full bg-mint" />
        <span className="text-sm text-muted-foreground ml-2">Direct Message</span>
      </div>

      {/* Chat area */}
      <div className="p-4 space-y-3 min-h-[320px]">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: msg.delay, duration: 0.3 }}
            className={`flex items-start gap-2 ${msg.from === "user" ? "justify-end" : ""}`}
          >
            {msg.from === "bot" && (
              <div className="w-8 h-8 rounded-full bg-mint/20 flex items-center justify-center flex-shrink-0">
                <BouncerMascot size={24} animate={false} pose="arms-crossed" />
              </div>
            )}
            <div
              className={`px-3 py-2 rounded-lg text-sm max-w-[260px] ${
                msg.from === "bot"
                  ? msg.isSuccess
                    ? "bg-mint/20 text-mint border border-mint/30"
                    : "bg-[#383a40] text-foreground"
                  : "bg-[#5865f2] text-foreground"
              }`}
            >
              {msg.text}
              {msg.hasSelect && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {["🎨 Design", "💻 Engineering", "📊 Product"].map((opt) => (
                    <span key={opt} className="text-xs bg-[#2b2d31] px-2 py-1 rounded border border-border">
                      {opt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
