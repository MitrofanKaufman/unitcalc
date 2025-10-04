import { type Product } from '@/types';
interface CalculatorFormProps {
    product: Product;
    onClose: () => void;
}
/**
 * Форма калькулятора доходности для конкретного товара
 */
export declare function CalculatorForm({ product, onClose }: CalculatorFormProps): import("react/jsx-runtime").JSX.Element;
export default CalculatorForm;
