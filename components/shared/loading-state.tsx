import React from 'react';
import { View } from 'react-native';

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <View key={index} className="h-20 rounded-3xl bg-muted" />
      ))}
    </View>
  );
}
