import {ComponentType} from "react";

export interface FeatureCardProps {
    icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
    className?: string;
}
