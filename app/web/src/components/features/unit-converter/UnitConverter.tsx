import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FeaturesLayout from '../FeaturesLayout';

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
  ],
  weight: [
    { name: 'Grams', symbol: 'g', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Kilograms', symbol: 'kg', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Pounds', symbol: 'lb', toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
  ],
  temperature: [
    { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => (v * 9/5) + 32 },
    { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
};

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  const [currentUnits, setCurrentUnits] = useState<Unit[]>([]);

  // Initialize with default units on category change
  useEffect(() => {
    setCurrentUnits(units[category]);
    setFromUnit(0);
    setToUnit(1);
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
    <FeaturesLayout title="Конвертер единиц" subtitle="Преобразуйте значения между различными единицами измерения">
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Конвертер единиц</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={category}
                  onValueChange={(value: string) => {
                    setCategory(value as UnitCategory);
                    setFromUnit(0);
                    setToUnit(1);
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Выберите категорию" />
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
                <Label>Значение</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Введите значение"
                    className="flex-1"
                  />
                  <Button onClick={handleConvert} className="shrink-0">
                    Конвертировать
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Из</Label>
                <Select
                  value={fromUnit.toString()}
                  onValueChange={(value) => setFromUnit(parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите единицу" />
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
                <Label>В</Label>
                <Select
                  value={toUnit.toString()}
                  onValueChange={(value) => setToUnit(parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите единицу" />
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
                aria-label="Поменять местами"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {result !== null && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Результат</p>
                <p className="text-2xl font-bold">
                  {parseFloat(result.toFixed(8))} {currentUnits[toUnit].name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FeaturesLayout>
  );
}

export default UnitConverter;
