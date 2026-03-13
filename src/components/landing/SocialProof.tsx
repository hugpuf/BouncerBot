import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Bouncer replaced our janky Google Form onboarding. Members actually complete it now.",
    author: "Alex R.",
    org: "Web3 Research DAO",
    color: "border-mint/30",
  },
  {
    quote: "We went from 40% onboarding completion to 92%. The conditional logic is a game changer.",
    author: "Priya K.",
    org: "DevConnect Community",
    color: "border-lavender/30",
  },
  {
    quote: "Set it up in 10 minutes. Our webhook pipes data straight into our CRM. Beautiful.",
    author: "Marcus T.",
    org: "Creator Collective",
    color: "border-peach/30",
  },
];

export const SocialProof = () => {
  return (
    <section className="py-24">
      <div className="velvet-rope mb-16 mx-auto w-3/4" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-pixel text-xl md:text-2xl text-foreground mb-3">
            200+ servers. Zero riffraff.
          </h2>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-pale-yellow text-pale-yellow" />
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-card rounded-xl p-6 border ${t.color}`}
            >
              <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.org}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
