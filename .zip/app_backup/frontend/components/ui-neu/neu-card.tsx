// path: src/components/ui-neu/neu-card.tsx
// Neumorphic card-контейнер с мягкими тенями.

import * as React from "react";

import { cn } from "../../../../../app/client/lib/utils";

interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("neu p-4", className)} {...props}>
      {children}
    </div>
  ),
);
NeuCard.displayName = "NeuCard";

export { NeuCard, type NeuCardProps };
