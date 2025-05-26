import { motion } from "framer-motion";

const grid = Array.from({ length: 9 });

export default function Loader({ brandColor = "#03C9D7" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="grid grid-cols-3 gap-2 w-24 h-24">
        {grid.map((_, i) => (
          <motion.div
            key={i}
            className="w-5 h-5 rounded bg-current"
            style={{ color: brandColor }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.4, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: (i % 3) * 0.1 + Math.floor(i / 3) * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
