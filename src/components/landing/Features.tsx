import { motion } from "framer-motion";
import {
  Database, GitBranch, Table2, Webhook,
  User, Shield, MessageSquare, Paintbrush,
} from "lucide-react";

const dataFeatures = [
  { icon: Database, label: "Structured data capture", desc: "Collect name, role, org, email, LinkedIn, and custom fields via DM. Every response stored and forwarded.", color: "text-mint" },
  { icon: GitBranch, label: "CRM sync", desc: "Push new member data to Attio, HubSpot, Salesforce, or any CRM via webhook. Every Discord join becomes a contact record.", color: "text-lavender" },
  { icon: Table2, label: "Sheets / Airtable / Notion", desc: "Auto-populate a spreadsheet or database with every new member. No manual data entry ever again.", color: "text-peach" },
  { icon: Webhook, label: "Webhook output", desc: "Full JSON payload with every field. Pipe it to Zapier, Make, n8n, or your own backend.", color: "text-baby-blue" },
];

const discordFeatures = [
  { icon: User, label: "Auto nickname formatting", desc: 'Set nicknames to "Name (Company)" automatically.', color: "text-pastel-pink" },
  { icon: Shield, label: "Auto role assignment", desc: "Assign Discord roles based on answers (researcher, developer, etc.)", color: "text-pale-yellow" },
  { icon: MessageSquare, label: "Custom question builder", desc: "Text, select, multi-select, URL, email fields. Conditional logic. Skip options.", color: "text-mint" },
  { icon: Paintbrush, label: "White-label branding", desc: "Custom bot name, avatar, and embed colors (VIP plan).", color: "text-lavender" },
];

export const Features = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-pixel text-xl md:text-2xl text-center mb-4 text-foreground"
        >
          Your data pipeline
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          Every Discord join becomes a structured data record in your stack.
        </p>

        {/* Data & Integration features - primary row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-4">
          {dataFeatures.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="bg-card rounded-xl p-5 border border-mint/20 hover:border-mint/40 transition-all group"
            >
              <f.icon className={`w-5 h-5 ${f.color} mb-3 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-sm text-foreground mb-1">{f.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Discord features - secondary row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {discordFeatures.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="bg-card rounded-xl p-5 border border-border hover:border-lavender/30 transition-all group"
            >
              <f.icon className={`w-5 h-5 ${f.color} mb-3 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-sm text-foreground mb-1">{f.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
