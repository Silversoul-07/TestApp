import { Text } from '@/components/ui/text';
import type { DistributionDatum } from '@/lib/types/media';
import React from 'react';
import { View } from 'react-native';

const COLORS = ['bg-emerald-400', 'bg-indigo-400', 'bg-amber-400', 'bg-pink-400', 'bg-sky-400'];

type DistributionChartProps = {
  data: DistributionDatum[];
};

export function DistributionChart({ data }: DistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  return (
    <View className="gap-3 rounded-3xl border border-border/70 p-4">
      <Text variant="large">Distribution by Type</Text>
      <View className="flex-row overflow-hidden rounded-full">
        {data.map((item, index) => (
          <View
            key={item.mediaType}
            className={`${COLORS[index % COLORS.length]} h-4`}
            style={{ flex: item.value }}
          />
        ))}
      </View>
      {data.map((item, index) => (
        <View key={item.mediaType} className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className={`${COLORS[index % COLORS.length]} h-2 w-2 rounded-full`} />
            <Text className="text-sm capitalize">{item.mediaType}</Text>
          </View>
          <Text className="text-sm font-semibold">{Math.round((item.value / total) * 100)}%</Text>
        </View>
      ))}
    </View>
  );
}
