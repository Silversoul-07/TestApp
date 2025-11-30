import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { View } from 'react-native';

type GenreChipProps = {
  label: string;
  selected?: boolean;
};

export function GenreChip({ label, selected }: GenreChipProps) {
  return (
    <View
      className={cn(
        'border-border/70 bg-secondary mr-2 rounded-full border px-3 py-1',
        selected && 'border-primary bg-primary/10'
      )}>
      <Text className="text-xs font-medium text-foreground">{label}</Text>
    </View>
  );
}
