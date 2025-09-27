export const getUnitCategories = async () => {
    return [
        {
            id: 'length',
            name: 'Длина',
            description: 'Единицы измерения длины',
            units: ['meters', 'feet', 'inches', 'centimeters', 'millimeters', 'kilometers', 'miles', 'yards']
        },
        {
            id: 'weight',
            name: 'Вес',
            description: 'Единицы измерения веса',
            units: ['kg', 'lbs', 'grams', 'ounces', 'tons']
        },
        {
            id: 'temperature',
            name: 'Температура',
            description: 'Единицы измерения температуры',
            units: ['celsius', 'fahrenheit', 'kelvin']
        },
        {
            id: 'volume',
            name: 'Объем',
            description: 'Единицы измерения объема',
            units: ['liters', 'gallons', 'cubic_meters', 'cubic_feet']
        },
        {
            id: 'area',
            name: 'Площадь',
            description: 'Единицы измерения площади',
            units: ['square_meters', 'square_feet', 'acres', 'hectares']
        }
    ];
};
