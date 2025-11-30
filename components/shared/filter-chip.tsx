import { cn } from '@/lib/utils';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

type FilterChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        'border-border/60 bg-background mr-2 flex-row items-center rounded-full border px-4 py-2',
        selected && 'border-primary bg-primary/10'
      )}>
      <Text className={cn('text-sm font-medium', selected ? 'text-primary' : 'text-muted-foreground')}>
        {label}
      </Text>
      {selected ? <View className="ml-2 h-2 w-2 rounded-full bg-primary" /> : null}
    </Pressable>
  );
}
