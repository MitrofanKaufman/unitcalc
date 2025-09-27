export const convertUnits = async (from, to, value) => {
    const conversions = {
        meters: { feet: 3.28084, inches: 39.3701 },
        feet: { meters: 0.3048, inches: 12 },
        kg: { lbs: 2.20462 },
        lbs: { kg: 0.453592 },
        celsius: { fahrenheit: (c) => c * 9 / 5 + 32 },
        fahrenheit: { celsius: (f) => (f - 32) * 5 / 9 }
    };
    if (from === to) {
        return { result: value, from, to };
    }
    const fromConversions = conversions[from];
    if (!fromConversions) {
        throw new Error(`Неизвестная единица измерения: ${from}`);
    }
    const conversion = fromConversions[to];
    if (!conversion) {
        throw new Error(`Неизвестная единица измерения: ${to}`);
    }
    let result;
    if (typeof conversion === 'function') {
        result = conversion(value);
    }
    else {
        result = value * conversion;
    }
    return {
        result: Math.round(result * 10000) / 10000,
        from,
        to,
        formula: `${from} → ${to}`
    };
};
