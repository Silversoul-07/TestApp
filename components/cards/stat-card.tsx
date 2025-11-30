import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
};

export function StatCard({ label, value, icon: IconComponent, accent = 'bg-primary/10' }: StatCardProps) {
  return (
    <View className="bg-card flex-1 rounded-3xl px-4 py-5 shadow-sm shadow-black/5">
      <View className="flex-row items-center justify-between">
        <View className={cn('mr-3 h-10 w-10 items-center justify-center rounded-2xl', accent)}>
          <Icon as={IconComponent} className="text-primary" size={20} />
        </View>
        <Text className="text-foreground text-2xl font-bold">{value}</Text>
      </View>
      <Text className="mt-3 text-sm text-muted-foreground">{label}</Text>
    </View>
  );
}
