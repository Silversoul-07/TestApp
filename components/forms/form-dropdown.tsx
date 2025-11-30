import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import React from 'react';
import { View } from 'react-native';

type Option = {
  label: string;
  value: string;
};

type FormDropdownProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: Option[];
};

export function FormDropdown({ label, placeholder, value, onValueChange, options }: FormDropdownProps) {
  return (
    <View className="mb-4 gap-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Select value={value as any} onValueChange={onValueChange as any}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} label={option.label as any}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </View>
  );
}
