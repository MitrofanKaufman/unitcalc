interface NeuButtonProps extends Omit<ButtonProps, 'variant'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
}