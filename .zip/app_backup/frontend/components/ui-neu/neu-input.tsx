// path: src/components/ui-neu/neu-input.tsx
// Neumorphic input компонент. Наследует логику базового Input,
// добавляя класс .neu-input из глобальных стилей.

import * as React from "react";

import { Input, type ComponentProps } from "../../../../../app/client/components/ui/input";
import { cn } from "../../../../../app/client/lib/utils";

const NeuInput = React.forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <Input ref={ref} className={cn("neu-input", className)} {...props} />
  ),
);
NeuInput.displayName = "NeuInput";

export { NeuInput };
