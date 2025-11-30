import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, View } from 'react-native';

type FormDatePickerProps = {
  label: string;
  value?: Date | null;
  onChange: (value: Date | null) => void;
};

export function FormDatePicker({ label, value, onChange }: FormDatePickerProps) {
  const [show, setShow] = React.useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm text-muted-foreground">{label}</Text>
      <Button variant="outline" onPress={() => setShow(true)}>
        <Text>{value ? value.toDateString() : 'Select date'}</Text>
      </Button>
      {show ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            if (Platform.OS !== 'ios') {
              setShow(false);
            }
            if (event.type === 'dismissed') {
              return;
            }
            onChange(selectedDate ?? null);
          }}
          style={Platform.OS === 'ios' ? { alignSelf: 'flex-start' } : undefined}
        />
      ) : null}
    </View>
  );
}
