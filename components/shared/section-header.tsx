import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
  description?: string;
  className?: string;
};

export function SectionHeader({
  title,
  actionLabel = 'View All',
  onPressAction,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <View className={cn('mb-3 flex-row items-center justify-between gap-2', className)}>
      <View className="flex-1">
        <Text variant="large" className="text-foreground">
          {title}
        </Text>
        {description ? <Text className="text-muted-foreground text-sm">{description}</Text> : null}
      </View>
      {onPressAction ? (
        <Button variant="ghost" size="sm" onPress={onPressAction} accessibilityRole="button">
          <Text className="text-primary text-xs font-medium">{actionLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}
