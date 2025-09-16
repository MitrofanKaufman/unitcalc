type BaseButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ExtendedVariant = 'primary' | 'accent' | 'glass';
export type ButtonVariant = BaseButtonVariant | ExtendedVariant;  // Remove the period at the end
