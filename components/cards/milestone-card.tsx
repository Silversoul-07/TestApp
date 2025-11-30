import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export type MilestoneCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  achievedAt: string;
};

export function MilestoneCard({ title, description, icon, achievedAt }: MilestoneCardProps) {
  return (
    <View className="border-border/60 mb-3 rounded-3xl border px-4 py-4">
      <View className="mb-2 flex-row items-center gap-3">
        <View className="rounded-2xl bg-primary/10 p-3">
          <Icon as={icon} className="text-primary" size={20} />
        </View>
        <View>
          <Text className="text-base font-semibold">{title}</Text>
          <Text className="text-xs text-muted-foreground">{achievedAt}</Text>
        </View>
      </View>
      <Text className="text-sm text-muted-foreground">{description}</Text>
    </View>
  );
}
