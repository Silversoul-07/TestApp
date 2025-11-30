import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({ title, description, actionLabel, onActionPress }: EmptyStateProps) {
  return (
    <View className="items-center justify-center rounded-3xl border border-dashed border-border/60 px-6 py-10">
      <View className="mb-4 h-20 w-20 rounded-full bg-primary/10" />
      <Text variant="large" className="mb-1 text-center">
        {title}
      </Text>
      <Text className="text-center text-sm text-muted-foreground">{description}</Text>
      {actionLabel ? (
        <Button className="mt-4" onPress={onActionPress}>
          <Text>{actionLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}
