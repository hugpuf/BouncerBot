import { motion } from "framer-motion";
import { MessageCircle, ArrowRightLeft, Database } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Bouncer greets every new member",
    description: "When someone joins your server, Bouncer DMs them a friendly onboarding flow. You configure the questions: name, role, company, email, LinkedIn — whatever you need.",
    color: "text-mint",
    bg: "bg-mint/10",
    borderColor: "border-mint/30",
  },
  {
    icon: ArrowRightLeft,
    title: "Data flows where you need it",
    description: "Every response is structured and piped to your CRM, Google Sheets, Airtable, Notion, or any webhook endpoint. No copy-pasting. No manual entry.",
    color: "text-lavender",
    bg: "bg-lavender/10",
    borderColor: "border-lavender/30",
  },
  {
    icon: Database,
    title: "Your Discord becomes a pipeline",
    description: "Members get roles and nicknames automatically. You get clean, structured data on every person in your community.",
    color: "text-peach",
    bg: "bg-peach/10",
    borderColor: "border-peach/30",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="velvet-rope mb-16 mx-auto w-3/4" />
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-pixel text-xl md:text-2xl text-center mb-16 text-foreground"
        >
          How it works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`bg-card rounded-xl p-6 border ${step.borderColor} hover:bg-card-hover transition-colors`}
            >
              <div className={`w-14 h-14 ${step.bg} rounded-lg flex items-center justify-center mb-4`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <div className="font-pixel text-xs text-muted-foreground mb-2">Step {i + 1}</div>
              <h3 className="font-pixel text-xs mb-3 text-foreground leading-relaxed">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
