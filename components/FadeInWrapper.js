"use client";

import { motion } from 'framer-motion';

export default function FadeInWrapper({ children, delay = 0, duration = 1.0, y = 20 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
