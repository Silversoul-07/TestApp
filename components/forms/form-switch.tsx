import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

type FormSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
};

export function FormSwitch({ label, value, onValueChange, description }: FormSwitchProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-border/70 px-4 py-3">
      <View className="flex-1 pr-3">
        <Text className="font-medium">{label}</Text>
        {description ? <Text className="text-xs text-muted-foreground">{description}</Text> : null}
      </View>
      <Switch checked={value} onCheckedChange={onValueChange} />
    </View>
  );
}
