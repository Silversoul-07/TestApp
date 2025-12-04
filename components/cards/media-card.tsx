import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import type { MediaEntry } from '@/lib/types/media';
import { BookmarkIcon, PlusIcon, StarIcon } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

const AnimatedPressable = Pressable;

type MediaCardProps = {
  entry: MediaEntry;
  onPress?: (entry: MediaEntry) => void;
  onLongPress?: (entry: MediaEntry) => void;
  onQuickAdd?: (entry: MediaEntry) => void;
  onToggleFavorite?: (entry: MediaEntry) => void;
  showQuickAction?: boolean;
  ranking?: number;
  className?: string;
};

export function MediaCard({
  entry,
  onPress,
  onLongPress,
  onQuickAdd,
  onToggleFavorite,
  showQuickAction,
  ranking,
  className,
}: MediaCardProps) {
  const progressPercent = React.useMemo(() => {
    if (!entry.totalUnits) return 0;
    return Math.round(((entry.progressUnits ?? 0) / entry.totalUnits) * 100);
  }, [entry]);
  const mediaLabel = React.useMemo(() => {
    let label = '';
    if (typeof entry.mediaType === 'string') {
      label = entry.mediaType;
    } else if (
      entry.mediaType &&
      typeof entry.mediaType === 'object' &&
      'value' in entry.mediaType &&
      typeof (entry.mediaType as any).value === 'string'
    ) {
      label = (entry.mediaType as { value: string }).value;
    }
    return label.replace('-', ' ').toUpperCase();
  }, [entry.mediaType]);

  return (
    <AnimatedPressable
      onPress={() => onPress?.(entry)}
      onLongPress={() => onLongPress?.(entry)}
      className={cn('bg-card rounded-2xl p-2', className)}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
      <View className="relative">
        <AspectRatio ratio={2 / 3}>
          <Image
            source={{ uri: entry.coverImage }}
            className="h-full w-full rounded-xl"
            resizeMode="cover"
          />
        </AspectRatio>
        <Badge variant="secondary" className="absolute left-2 top-2 rounded-full px-2 py-0.5">
          <Text className="text-[10px] uppercase tracking-wide">
            {mediaLabel}
          </Text>
        </Badge>
        {ranking ? (
          <View className="absolute left-2 top-8 rounded-full bg-primary px-1.5 py-0.5">
            <Text className="text-[9px] font-semibold text-primary-foreground">#{ranking}</Text>
          </View>
        ) : null}
        <View className="absolute inset-x-0 bottom-0 px-1.5 pb-1.5">
          <Progress
            value={progressPercent}
            className="h-1.5"
            indicatorClassName="bg-primary"
          />
        </View>
        {showQuickAction ? (
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-1.5 top-1.5 h-7 w-7 rounded-full"
            onPress={() => onQuickAdd?.(entry)}
            disabled={!onQuickAdd}
            accessibilityLabel="Quick increment">
            <Icon as={PlusIcon} size={14} />
          </Button>
        ) : null}
        {onToggleFavorite && entry.isFavorite ? (
          <View className="absolute left-1.5 bottom-1.5">
            <Icon as={BookmarkIcon} className="text-yellow-400" size={14} />
          </View>
        ) : null}
      </View>
      <View className="mt-2 gap-0.5">
        <Text className="text-xs font-semibold" numberOfLines={2}>
          {entry.title}
        </Text>
        <View className="flex-row items-center justify-between mt-0.5">
          <Text className="text-[10px] text-muted-foreground">{progressPercent}%</Text>
          {entry.rating ? (
            <View className="flex-row items-center gap-0.5">
              <Icon as={StarIcon} className="text-yellow-400" size={10} />
              <Text className="text-[10px] font-semibold">{entry.rating?.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </AnimatedPressable>
  );
}
