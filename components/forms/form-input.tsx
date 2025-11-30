import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

type FormInputProps = React.ComponentProps<typeof Input> & {
  label: string;
  helperText?: string;
};

export function FormInput({ label, helperText, ...props }: FormInputProps) {
  return (
    <View className="mb-4 gap-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Input {...props} />
      {helperText ? <Text className="text-xs text-muted-foreground">{helperText}</Text> : null}
    </View>
  );
}
