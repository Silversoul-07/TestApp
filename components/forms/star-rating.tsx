// TODO: Explore different rating methods:
// - Add tier-based rating system (S, A, B, C, D tiers)
// - Implement emoji-based rating (😍, 😊, 😐, 😞, 😡)
// - Add percentage-based rating (0-100%)
// - Allow custom rating scales (5-point, 10-point, tier)
// - Add rating categories (story, art, characters, music, etc.)
// - Implement weighted average for multi-category ratings
// - Add user preference for default rating system in settings

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { StarIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

export function StarRating({ value, onChange, max = 10 }: StarRatingProps) {
  return (
    <View className="mb-4 gap-2">
      <Text className="text-sm text-muted-foreground">Score</Text>
      <View className="flex-row flex-wrap gap-1">
        {Array.from({ length: max }).map((_, index) => {
          const current = index + 1;
          const active = current <= value;
          return (
            <Pressable
              key={current}
              accessibilityRole="button"
              onPress={() => onChange(current)}
              className="rounded-full p-1">
              <Icon as={StarIcon} className={active ? 'text-yellow-400' : 'text-muted-foreground'} size={20} />
            </Pressable>
          );
        })}
      </View>
      <Text className="text-xs text-muted-foreground">{value}/10</Text>
    </View>
  );
}
