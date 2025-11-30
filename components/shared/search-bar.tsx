import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SearchIcon, XIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search media...' }: SearchBarProps) {
  return (
    <View className="border-border/60 bg-card flex-row items-center rounded-3xl border px-3">
      <Icon as={SearchIcon} className="text-muted-foreground" size={18} />
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="flex-1 bg-transparent"
      />
      {value.length > 0 ? (
        <Button variant="ghost" size="sm" onPress={() => onChangeText('')}>
          <Icon as={XIcon} className="text-muted-foreground" size={16} />
          <Text>Clear</Text>
        </Button>
      ) : null}
    </View>
  );
}
