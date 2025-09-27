"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseStyles = 'rounded font-medium transition-colors';
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    return ((0, jsx_runtime_1.jsx)("button", { className: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`, ...props, children: children }));
};
exports.Button = Button;
exports.default = exports.Button;
