import { motion } from "framer-motion";
import { Code2, FlaskConical, Briefcase, Coins, Users } from "lucide-react";

const audiences = [
  {
    icon: Code2,
    title: "Developer communities",
    desc: "Know who's joining, what they build, where they work. Route them to the right channels.",
    color: "text-mint",
    borderColor: "border-mint/30",
  },
  {
    icon: FlaskConical,
    title: "Research groups",
    desc: "Capture academic institution, research domain, and contact info from every new member.",
    color: "text-lavender",
    borderColor: "border-lavender/30",
  },
  {
    icon: Briefcase,
    title: "SaaS communities",
    desc: "Turn your Discord into a lead gen channel. Every join is a potential customer record in your CRM.",
    color: "text-peach",
    borderColor: "border-peach/30",
  },
  {
    icon: Coins,
    title: "DAOs & Web3",
    desc: "Onboard contributors with verified info. Pipe to Notion or Airtable for governance.",
    color: "text-baby-blue",
    borderColor: "border-baby-blue/30",
  },
  {
    icon: Users,
    title: "Creator communities",
    desc: "Collect audience data you actually own. No more anonymous followers.",
    color: "text-pastel-pink",
    borderColor: "border-pastel-pink/30",
  },
];

export const WhoItsFor = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-pixel text-xl md:text-2xl text-center mb-4 text-foreground"
        >
          Who it's for
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
          If your community lives on Discord, your data shouldn't stay trapped there.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className={`bg-card rounded-xl p-5 border ${a.borderColor} hover:bg-card-hover transition-all`}
            >
              <a.icon className={`w-6 h-6 ${a.color} mb-3`} />
              <h3 className="font-semibold text-sm text-foreground mb-2">{a.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
