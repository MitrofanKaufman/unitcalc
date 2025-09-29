import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchUnits } from '@/services/api';
import { Search, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'time';

type Unit = {
  name: string;
  symbol?: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

const units: Record<UnitCategory, Unit[]> = {
  length: [
    { name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Centimeters', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: 'Millimeters', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
  ],
  weight: [
    { name: 'Grams', symbol: 'g', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Kilograms', symbol: 'kg', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Milligrams', symbol: 'mg', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Pounds', symbol: 'lb', toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
    { name: 'Ounces', symbol: 'oz', toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
  ],
  temperature: [
    { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => (v * 9/5) + 32 },
    { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  area: [
    { name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Square Kilometers', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { name: 'Square Feet', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { name: 'Square Miles', symbol: 'mi²', toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },
    { name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
  ],
  volume: [
    { name: 'Liters', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Milliliters', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Cubic Meters', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Cubic Centimeters', symbol: 'cm³', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Cubic Inches', symbol: 'in³', toBase: (v) => v * 0.0163871, fromBase: (v) => v / 0.0163871 },
    { name: 'Cubic Feet', symbol: 'ft³', toBase: (v) => v * 28.3168, fromBase: (v) => v / 28.3168 },
    { name: 'Gallons (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { name: 'Quarts (US)', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { name: 'Pints (US)', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { name: 'Cups (US)', symbol: 'cup', toBase: (v) => v * 0.24, fromBase: (v) => v / 0.24 },
    { name: 'Fluid Ounces (US)', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
  ],
  time: [
    { name: 'Seconds', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Milliseconds', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Minutes', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { name: 'Hours', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { name: 'Days', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { name: 'Weeks', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
  ]
};

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUnits, setCurrentUnits] = useState<Unit[]>([]);

  useEffect(() => {
    const search = async () => {
      if (!searchQuery.trim()) {
        setCurrentUnits(units[category]);
        return;
      }
      
      try {
        const results = await searchUnits(searchQuery, category);
        setCurrentUnits(results);
      } catch (error) {
        console.error('Search failed:', error);
        setCurrentUnits(units[category]);
      }
    };

    const debounceTimer = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, category]);

  // Initialize with default units on category change
  useEffect(() => {
    setCurrentUnits(units[category]);
    setSearchQuery('');
  }, [category]);

  const handleConvert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult(null);
      return;
    }

    const baseValue = currentUnits[fromUnit].toBase(numValue);
    const convertedValue = currentUnits[toUnit].fromBase(baseValue);
    setResult(convertedValue);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result !== null) {
      setValue(result.toString());
      setResult(parseFloat(value));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Unit Converter</CardTitle>
      </CardHeader>
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value: string) => {
                setCategory(value as UnitCategory);
                setFromUnit(0);
                setToUnit(1);
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(units).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Value</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                className="flex-1"
              />
              <Button onClick={handleConvert} className="shrink-0">
                Convert
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>From</Label>
            <Select
              value={fromUnit.toString()}
              onValueChange={(value) => setFromUnit(parseInt(value, 10))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {currentUnits.map((unit, index) => (
                  <SelectItem key={`from-${index}`} value={index.toString()}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <Select
              value={toUnit.toString()}
              onValueChange={(value) => setToUnit(parseInt(value, 10))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {currentUnits.map((unit, index) => (
                  <SelectItem key={`to-${index}`} value={index.toString()}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="rounded-full"
            aria-label="Swap units"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {result !== null && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-2xl font-bold">
              {parseFloat(result.toFixed(8))} {currentUnits[toUnit].name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
