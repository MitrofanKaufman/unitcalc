// path: src/components/ui-neu/neu-button.tsx
// Neumorphic button компонент-обёртка над базовым Button.
// Добавляет тень .neu-button, определённую в глобальных стилях.

import * as React from "react";
import { Button, type ButtonProps } from "@components/theme/ui/button";
import { cn } from "@utils/utils";

const NeuButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} className={cn("neu-button", className)} {...props} />
  ),
);
NeuButton.displayName = "NeuButton";

export { NeuButton };
