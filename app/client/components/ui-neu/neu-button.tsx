// path: src/components/ui-neu/neu-button.tsx
// Neumorphic button компонент-обёртка над базовым Button.
// Добавляет тень .neu-button, определённую в глобальных стилях.

import * as React from "react";
import { motion } from "framer-motion";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MotionButton = motion.create(Button);

const NeuButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <MotionButton ref={ref} className={cn("neu-button", className)} {...props} />
  ),
);
NeuButton.displayName = "NeuButton";

export { NeuButton };
