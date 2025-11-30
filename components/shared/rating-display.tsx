import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { StarIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

type RatingDisplayProps = {
  rating?: number;
  size?: 'sm' | 'md' | 'lg';
};

export function RatingDisplay({ rating = 0, size = 'md' }: RatingDisplayProps) {
  const textClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  const iconSize = size === 'lg' ? 18 : size === 'sm' ? 12 : 14;
  return (
    <View className="flex-row items-center gap-1">
      <Icon as={StarIcon} className="text-yellow-500" size={iconSize} />
      <Text className={`font-semibold text-foreground ${textClass}`}>{rating?.toFixed(1) ?? '0.0'}</Text>
    </View>
  );
}
