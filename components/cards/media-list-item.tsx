// TODO: Media List Item UI improvements:
// - Add swipe gestures for quick actions (delete, favorite, increment)
// - Implement smooth animations for progress updates
// - Add thumbnail loading placeholders
// - Improve spacing and visual hierarchy
// - Add long-press context menu
// - Implement reordering with drag handles
// - Add better visual feedback for interactions

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import type { MediaEntry } from '@/lib/types/media';
import { PlusIcon } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

interface MediaListItemProps {
  entry: MediaEntry;
  onPress?: (entry: MediaEntry) => void;
  onLongPress?: (entry: MediaEntry) => void;
  onIncrement?: (entry: MediaEntry) => void;
}

export function MediaListItem({ entry, onPress, onLongPress, onIncrement }: MediaListItemProps) {
  const percent = entry.totalUnits ? Math.round(((entry.progressUnits ?? 0) / entry.totalUnits) * 100) : 0;

  return (
    <Pressable
      onPress={() => onPress?.(entry)}
      onLongPress={() => onLongPress?.(entry)}
      accessibilityRole="button"
      className="border-border/70 flex-row items-center gap-3 border-b py-3">
      <Image
        source={{ uri: entry.coverImage }}
        resizeMode="cover"
        className="h-24 w-20 rounded-2xl"
      />
      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold" numberOfLines={1}>
            {entry.title}
          </Text>
          <Button size="sm" variant="secondary" onPress={() => onIncrement?.(entry)}>
            <Icon as={PlusIcon} className="text-primary" size={14} />
            <Text className="text-xs font-semibold text-primary">+1</Text>
          </Button>
        </View>
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {entry.mediaType.toUpperCase()} • {entry.unitLabel}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {entry.progressUnits ?? 0}/{entry.totalUnits ?? '∞'} {entry.unitLabel}
        </Text>
        <Progress value={percent} indicatorClassName="bg-primary" className="mt-1" />
      </View>
    </Pressable>
  );
}
