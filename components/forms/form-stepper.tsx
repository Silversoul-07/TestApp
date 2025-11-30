import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

type FormStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function FormStepper({ label, value, onChange, min = 0, max = Number.MAX_SAFE_INTEGER }: FormStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm text-muted-foreground">{label}</Text>
      <View className="flex-row items-center gap-3 rounded-2xl bg-secondary px-3 py-2">
        <Button variant="ghost" size="icon" onPress={decrement}>
          <Text className="text-lg">-</Text>
        </Button>
        <Text className="flex-1 text-center text-lg font-semibold">{value}</Text>
        <Button variant="ghost" size="icon" onPress={increment}>
          <Text className="text-lg">+</Text>
        </Button>
      </View>
    </View>
  );
}
