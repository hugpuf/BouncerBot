import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    tagline: "Try the door. No cover charge.",
    price: "€0",
    color: "border-mint/30",
    buttonClass: "bg-muted text-foreground hover:bg-card-hover",
    features: [
      "Up to 10 onboarding flows/month",
      "Structured data capture (name, role, org, email, LinkedIn)",
      "Conditional question logic",
      "Auto nickname and role assignment",
      "Custom welcome message & confirmation card",
      "Webhook output with full JSON payload",
      "Bouncer branding on welcome message",
    ],
  },
  {
    name: "Standard",
    tagline: "Unlimited flows. No questions asked.",
    price: "€10",
    color: "border-mint/40",
    buttonClass: "gradient-mint-lavender text-primary-foreground",
    features: [
      "Everything in Free",
      "Unlimited onboarding flows",
      "Unlimited members",
      "Google Sheets integration",
      "Analytics dashboard (completion rates, drop-off)",
      "Priority support",
    ],
  },
  {
    name: "VIP",
    tagline: "Your bot. Your brand. Your data pipeline.",
    price: "€20",
    color: "border-lavender/40",
    buttonClass: "gradient-peach-pink text-primary-foreground",
    popular: true,
    features: [
      "Everything in Standard",
      "Remove Bouncer branding (white-label)",
      "Custom bot name, avatar & embed colors",
      "CRM integrations (Attio, HubSpot, Salesforce via webhook)",
      "Airtable & Notion sync",
      "Branded onboarding experience",
      "Dedicated support",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="py-24" id="pricing">
      <div className="velvet-rope mb-16 mx-auto w-3/4" />
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-pixel text-xl md:text-2xl text-center mb-4 text-foreground"
        >
          Pick your tier
        </motion.h2>
        <p className="text-center text-muted-foreground mb-16">No cover charge to try. Cancel anytime.</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative bg-card rounded-xl p-8 border-2 flex flex-col ${plan.color} ${plan.popular ? "animate-pulse-glow" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lavender text-primary-foreground font-pixel text-[8px] px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-pixel text-sm text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className={`w-full font-pixel text-[10px] py-5 ${plan.buttonClass} hover:scale-[1.02] transition-transform`}>
                Get {plan.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
