// TODO: Add Entry improvements:
// UI enhancements:
// - Redesign form with step-by-step wizard interface
// - Add visual feedback for form validation
// - Improve layout with better spacing and typography
// - Add image picker for custom cover images
// - Add quick templates for common media types
// - Implement auto-save to prevent data loss
// 
// Form improvements:
// - Add search integration to auto-fill metadata from APIs
// - Add genre multi-select with suggestions
// - Add voice input for title and notes
// - Implement smart defaults based on media type
// - Add bulk import functionality
// - Add duplicate detection before saving

import { MediaCard } from '@/components/cards/media-card';
import { FormDatePicker } from '@/components/forms/form-date-picker';
import { FormDropdown } from '@/components/forms/form-dropdown';
import { FormInput } from '@/components/forms/form-input';
import { FormStepper } from '@/components/forms/form-stepper';
import { FormSwitch } from '@/components/forms/form-switch';
import { StarRating } from '@/components/forms/star-rating';
import { SectionHeader } from '@/components/shared/section-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useMedia } from '@/hooks/use-media';
import type { MediaEntry, MediaStatus, MediaType } from '@/lib/types/media';
import { XIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MEDIA_TYPE_OPTIONS = [
  { label: 'Anime', value: 'anime' },
  { label: 'Manga', value: 'manga' },
  { label: 'Light Novel', value: 'light-novel' },
  { label: 'Novel', value: 'novel' },
  { label: 'Movie', value: 'movie' },
  { label: 'TV Series', value: 'tv' },
  { label: 'Drama', value: 'drama' },
];

const STATUS_OPTIONS = [
  { label: 'Watching/Reading', value: 'watching' },
  { label: 'Completed', value: 'completed' },
  { label: 'Plan to', value: 'planned' },
  { label: 'On Hold', value: 'on-hold' },
  { label: 'Dropped', value: 'dropped' },
];

export default function AddEntryScreen() {
  const { saveEntry } = useMedia();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = React.useState('');
  const [mediaType, setMediaType] = React.useState<MediaType>('anime');
  const [status, setStatus] = React.useState<MediaStatus>('watching');
  const [totalUnits, setTotalUnits] = React.useState(12);
  const [progressUnits, setProgressUnits] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [notes, setNotes] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);

  React.useEffect(() => {
    setProgressUnits((prev) => Math.min(prev, totalUnits));
  }, [totalUnits]);

  const previewEntry: MediaEntry = {
    id: 'preview',
    title: title || 'New Entry',
    mediaType,
    status,
    totalUnits,
    progressUnits,
    unitLabel: getUnitLabel(mediaType),
    rating,
    coverImage:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    genres: [],
    platforms: [],
    updatedAt: new Date().toISOString(),
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please provide a title.');
      return;
    }

    const newEntry: MediaEntry = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      mediaType,
      status,
      totalUnits,
      progressUnits,
      unitLabel: getUnitLabel(mediaType),
      rating,
      coverImage:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
      genres: [],
      platforms: [],
      notes,
      updatedAt: new Date().toISOString(),
      releaseDate: startDate?.toISOString(),
      isFavorite: false,
      isPrivate,
    };

    await saveEntry(newEntry);
    router.push('/(tabs)/home');
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 96), paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        <View className="px-4">
          {/* Center-Aligned Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <View className="w-10" />
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold">Add Entry</Text>
            </View>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onPress={() => router.push('/(tabs)/search')}
            >
              <Icon as={XIcon} size={20} />
            </Button>
          </View>

          {/* Preview Card Section */}
          <View className="mb-6 bg-card rounded-3xl border border-border/50 p-4">
            <Text className="mb-3 text-sm font-semibold text-muted-foreground">PREVIEW</Text>
            <View className="items-center">
              <View className="w-32">
                <MediaCard entry={previewEntry} />
              </View>
              <Text className="mt-3 text-center text-sm text-muted-foreground">
                {title || 'Enter a title to see preview'}
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <SectionHeader title="Basic Information" />
          <FormInput 
            label="Title" 
            value={title} 
            onChangeText={setTitle} 
            placeholder="Enter media title" 
          />
          <View className="flex-row gap-2">
            <View className="flex-1">
              <FormDropdown
                label="Media Type"
                value={mediaType}
                onValueChange={(value) => setMediaType(value as MediaType)}
                options={MEDIA_TYPE_OPTIONS}
                placeholder="Select type"
              />
            </View>
            <View className="flex-1">
              <FormDropdown
                label="Status"
                value={status}
                onValueChange={(value) => setStatus(value as MediaStatus)}
                options={STATUS_OPTIONS}
                placeholder="Select status"
              />
            </View>
          </View>

          <SectionHeader title="Progress" />
          <View className="flex-row gap-2">
            <View className="flex-1">
              <FormStepper 
                label="Progress" 
                value={progressUnits} 
                onChange={setProgressUnits} 
                min={0} 
                max={totalUnits} 
              />
            </View>
            <View className="flex-1">
              <FormStepper 
                label="Total" 
                value={totalUnits} 
                onChange={setTotalUnits} 
                min={1} 
                max={999} 
              />
            </View>
          </View>

          <SectionHeader title="Rating" />
          <StarRating value={rating} onChange={setRating} />

          <SectionHeader title="Dates" />
          <View className="flex-row gap-2">
            <View className="flex-1">
              <FormDatePicker label="Start Date" value={startDate} onChange={setStartDate} />
            </View>
            <View className="flex-1">
              <FormDatePicker label="Finish Date" value={endDate} onChange={setEndDate} />
            </View>
          </View>

          <SectionHeader title="Additional Details" />
          <FormInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add personal notes, thoughts, or reminders"
            multiline
            numberOfLines={4}
          />
          <FormSwitch
            label="Private"
            description="Hide this entry from shared statistics"
            value={isPrivate}
            onValueChange={setIsPrivate}
          />

          <Button onPress={handleSave} className="mt-6 mb-4">
            <Text>Save Entry</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

function getUnitLabel(mediaType: MediaType) {
  switch (mediaType) {
    case 'manga':
    case 'light-novel':
    case 'novel':
      return 'chapters';
    case 'movie':
      return 'entries';
    default:
      return 'episodes';
  }
}
