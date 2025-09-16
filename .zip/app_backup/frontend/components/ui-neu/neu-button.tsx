// path: src/components/ui-neu/neu-button.tsx
// Neumorphic button компонент-обёртка над базовым Button.
// Добавляет тень .neu-button, определённую в глобальных стилях.

import * as React from "react";

import { Button, type ButtonProps } from "../../../../../app/client/components/ui/button";
import { cn } from "../../../../../app/client/lib/utils";

const NeuButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} className={cn("neu-button", className)} {...props} />
  ),
);
NeuButton.displayName = "NeuButton";

export { NeuButton };
