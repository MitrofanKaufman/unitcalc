export interface AnimationVariants {
    hidden: {
        opacity: number;
        y?: number;
    };
    visible: {
        opacity: number;
        y?: number;
        transition?: {
            staggerChildren?: number;
            duration?: number;
            delay?: number;
        };
    };
}
