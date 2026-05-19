import { motion } from "framer-motion";

type FieldNoteProps = {
  children: string;
  index: number;
};

export function FieldNote({ children, index }: FieldNoteProps) {
  return (
    <motion.li
      className="field-note"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.12 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.li>
  );
}
