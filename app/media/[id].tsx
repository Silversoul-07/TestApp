import { MediaCard } from '@/components/cards/media-card';
import { GenreChip } from '@/components/shared/genre-chip';
import { SectionHeader } from '@/components/shared/section-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { FormDropdown } from '@/components/forms/form-dropdown';
import { FormStepper } from '@/components/forms/form-stepper';
import { StarRating } from '@/components/forms/star-rating';
import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { useMedia } from '@/hooks/use-media';
import type { MediaStatus } from '@/lib/types/media';
import { Link, useLocalSearchParams } from 'expo-router';
import { BookmarkIcon, Share2Icon } from 'lucide-react-native';
import React from 'react';
import { Alert, Image, Linking, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MediaDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { getEntry, incrementProgress, updateStatus, toggleFavorite, saveEntry, loading } = useMedia();
  const insets = useSafeAreaInsets();
  const entry = params.id ? getEntry(String(params.id)) : undefined;
  const [status, setStatus] = React.useState<MediaStatus>(entry?.status ?? 'watching');
  const [notes, setNotes] = React.useState(entry?.notes ?? '');
  const [rating, setRating] = React.useState(entry?.rating ?? 0);

  React.useEffect(() => {
    if (entry) {
      setStatus(entry.status);
      setNotes(entry.notes ?? '');
      setRating(entry.rating ?? 0);
    }
  }, [entry]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>No media found.</Text>
      </View>
    );
  }

  const percent = entry.totalUnits ? Math.round(((entry.progressUnits ?? 0) / entry.totalUnits) * 100) : 0;

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 128) }}>
        <Hero entry={entry} />
        <View className="px-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-3xl font-bold">{entry.title}</Text>
            <Button variant="ghost" size="icon" onPress={() => toggleFavorite(entry.id)}>
              <Icon as={BookmarkIcon} className={entry.isFavorite ? 'text-yellow-400' : 'text-muted-foreground'} />
            </Button>
          </View>
          <Text className="text-sm text-muted-foreground">{entry.alternateTitle}</Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            <StatusBadge status={entry.status} />
            {entry.genres.map((genre) => (
              <GenreChip key={genre} label={genre} />
            ))}
          </View>
          <View className="mt-4 flex-row gap-2">
            <Button
              className="flex-1"
              onPress={() => {
                void saveEntry(entry);
              }}>
              <Text>Add to Library</Text>
            </Button>
            <Button
              className="flex-1"
              variant="secondary"
              onPress={() => {
                setStatus('watching');
                void updateStatus(entry.id, 'watching');
              }}>
              <Text>Mark Watching</Text>
            </Button>
            <Button variant="ghost" size="icon">
              <Icon as={Share2Icon} />
            </Button>
          </View>
          <SectionHeader title="Your Progress" />
          <FormDropdown
            label="Status"
            value={status}
            onValueChange={(value) => {
              setStatus(value as MediaStatus);
              updateStatus(entry.id, value as MediaStatus).catch(() => Alert.alert('Error', 'Unable to update status'));
            }}
            options={[
              { label: 'Watching/Reading', value: 'watching' },
              { label: 'Completed', value: 'completed' },
              { label: 'Plan to', value: 'planned' },
              { label: 'On Hold', value: 'on-hold' },
              { label: 'Dropped', value: 'dropped' },
            ]}
          />
          <FormStepper
            label={`${entry.unitLabel} Completed`}
            value={entry.progressUnits ?? 0}
            min={0}
            max={entry.totalUnits ?? 999}
            onChange={(value) => {
              const delta = value - (entry.progressUnits ?? 0);
              incrementProgress(entry.id, delta);
            }}
          />
          <Progress value={percent} className="mb-2" />
          <Text className="text-xs text-muted-foreground">
            {entry.progressUnits ?? 0}/{entry.totalUnits ?? '∞'} {entry.unitLabel}
          </Text>
          <StarRating
            value={rating}
            onChange={(value) => {
              setRating(value);
              void saveEntry({ ...entry, rating: value });
            }}
          />
          <SectionHeader title="Synopsis" />
          <Text className="text-sm leading-6 text-muted-foreground">{entry.synopsis}</Text>
          <SectionHeader title="Where to Watch/Read" />
          <View className="flex-row flex-wrap gap-2">
            {entry.platforms.map((platform) => (
              <Button key={platform.url} variant="outline" onPress={() => Linking.openURL(platform.url)}>
                <Text>{platform.label}</Text>
              </Button>
            ))}
          </View>
          <SectionHeader title="Related" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <MediaCard entry={entry} className="mr-4" />
          </ScrollView>
          <SectionHeader title="Notes" />
          <FormInput
            label="Personal Notes"
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
            }}
            multiline
            numberOfLines={5}
            placeholder="Add personal notes"
          />
          <Button
            className="mt-2"
            variant="outline"
            onPress={() => {
              void saveEntry({ ...entry, notes });
            }}>
            <Text>Save Notes</Text>
          </Button>
        </View>
      </ScrollView>
      <View className="absolute bottom-6 right-6">
        <Button
          size="icon"
          className="rounded-full"
          onPress={() => incrementProgress(entry.id)}
          accessibilityLabel="Add progress">
          <Text>+1</Text>
        </Button>
      </View>
    </View>
  );
}

function Hero({ entry }: { entry: ReturnType<typeof useMedia>['entries'][number] }) {
  return (
    <View>
      <Image
        source={{ uri: entry.bannerImage ?? entry.coverImage }}
        className="h-48 w-full"
        resizeMode="cover"
      />
      <View className="-mt-12 flex-row px-6">
        <Image source={{ uri: entry.coverImage }} className="h-40 w-28 rounded-3xl border-4 border-background" />
        <View className="ml-4 flex-1 justify-end">
          <Text className="text-lg font-semibold text-white">{entry.title}</Text>
          <Text className="text-white/80">{entry.year}</Text>
        </View>
      </View>
    </View>
  );
}
