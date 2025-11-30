import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { MediaStatus } from '@/lib/types/media';
import React from 'react';
import { View } from 'react-native';

const STATUS_STYLES: Record<MediaStatus, string> = {
  watching: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
  reading: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-100',
  planned: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-100',
  'on-hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-100',
  dropped: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-100',
};

const STATUS_LABELS: Record<MediaStatus, string> = {
  watching: 'Watching',
  reading: 'Reading',
  completed: 'Completed',
  planned: 'Plan to',
  'on-hold': 'On Hold',
  dropped: 'Dropped',
};

type StatusBadgeProps = {
  status: MediaStatus;
  size?: 'sm' | 'md';
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <View
      className={cn(
        'rounded-full px-3 py-1',
        STATUS_STYLES[status],
        size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'
      )}>
      <Text className={cn('text-xs font-semibold uppercase tracking-wide', size === 'sm' && 'text-[10px]')}>
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}
