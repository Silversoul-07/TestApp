import { Text } from '@/components/ui/text';
import type { ActivityPoint } from '@/lib/types/media';
import React from 'react';
import { View } from 'react-native';

type ActivityHeatmapProps = {
  data: ActivityPoint[];
};

const COLOR_STOPS = ['bg-muted', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400'];

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const max = data.reduce((acc, point) => Math.max(acc, point.value), 0) || 1;
  return (
    <View className="gap-3 rounded-3xl border border-border/70 p-4">
      <Text variant="large">Watching Activity</Text>
      <View className="flex-row flex-wrap gap-2">
        {data.map((point) => {
          const intensity = Math.min(COLOR_STOPS.length - 1, Math.floor((point.value / max) * COLOR_STOPS.length));
          return <View key={point.date} className={`h-5 w-5 rounded ${COLOR_STOPS[intensity]}`} />;
        })}
      </View>
    </View>
  );
}
