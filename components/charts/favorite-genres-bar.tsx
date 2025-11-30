import { Text } from '@/components/ui/text';
import type { GenreDistribution } from '@/lib/types/media';
import React from 'react';
import { View } from 'react-native';

type FavoriteGenresBarProps = {
  data: GenreDistribution[];
};

export function FavoriteGenresBar({ data }: FavoriteGenresBarProps) {
  const max = data.reduce((acc, item) => Math.max(acc, item.value), 1);
  return (
    <View className="gap-3 rounded-3xl border border-border/70 p-4">
      <Text variant="large">Favorite Genres</Text>
      {data.map((item) => (
        <View key={item.genre} className="mb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium">{item.genre}</Text>
            <Text className="text-xs text-muted-foreground">{item.value}%</Text>
          </View>
          <View className="mt-1 h-2 rounded-full bg-muted">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
