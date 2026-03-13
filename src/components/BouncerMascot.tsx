import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import bouncerLogo from "@/assets/bouncer-logo.png";

type Pose = "arms-crossed" | "nod" | "shake" | "pointing" | "clipboard";

interface BouncerMascotProps {
  pose?: Pose;
  size?: number;
  className?: string;
  animate?: boolean;
}

export const BouncerMascot = ({ pose = "arms-crossed", size = 120, className, animate = true }: BouncerMascotProps) => {
  const animationClass = pose === "nod" ? "animate-nod" : pose === "shake" ? "animate-head-shake" : "";

  return (
    <motion.div
      className={cn("inline-block", animationClass, className)}
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <img
        src={bouncerLogo}
        alt="Bouncer mascot"
        width={size}
        height={size}
        className="object-contain"
        style={{ imageRendering: "pixelated", width: size, height: size }}
      />
    </motion.div>
  );
};
