import React from "react";
import clsx from "clsx";

type ButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    disabled?: boolean;
    onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = "primary",
                                                  size = "md",
                                                  fullWidth,
                                                  disabled,
                                                  onClick
                                              }) => {
    const base = "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500";
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border border-gray-300 text-gray-900 hover:bg-gray-50"
    };
    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg"
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                base,
                variants[variant],
                sizes[size],
                { "w-full": fullWidth },
                { "opacity-50 cursor-not-allowed": disabled }
            )}
        >
            {children}
        </button>
    );
};
