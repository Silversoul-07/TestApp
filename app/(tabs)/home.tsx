import { MediaCard } from '@/components/cards/media-card';
import { MediaListItem } from '@/components/cards/media-list-item';
import { EmptyState } from '@/components/shared/empty-state';
import { FilterChip } from '@/components/shared/filter-chip';
import { LoadingState } from '@/components/shared/loading-state';
import { SearchBar } from '@/components/shared/search-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useMedia } from '@/hooks/use-media';
import {
  MEDIA_TYPE_FILTERS,
  SORT_OPTIONS,
  STATUS_FILTERS,
} from '@/lib/constants/media';
import type { LibrarySortOption, LibraryViewMode, MediaStatus, MediaType } from '@/lib/types/media';
import { 
  LayoutGridIcon,
  SlidersHorizontalIcon,
  CalendarIcon,
  PlusIcon,
} from 'lucide-react-native';
import React from 'react';
import { FlatList, ScrollView, View, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {
  const { entries, sortEntries, incrementProgress, toggleFavorite, loading } = useMedia();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = React.useState<LibraryViewMode>('grid');
  const [mediaTypeFilter, setMediaTypeFilter] = React.useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | string>('all');
  const [sort, setSort] = React.useState<LibrarySortOption>('lastUpdated');
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const filterHeight = React.useRef(new Animated.Value(0)).current;

  // Load saved preferences
  React.useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedViewMode = await AsyncStorage.getItem('library_viewMode');
        const savedMediaTypeFilter = await AsyncStorage.getItem('library_mediaTypeFilter');
        const savedStatusFilter = await AsyncStorage.getItem('library_statusFilter');
        const savedSort = await AsyncStorage.getItem('library_sort');
        
        if (savedViewMode) setViewMode(savedViewMode as LibraryViewMode);
        if (savedMediaTypeFilter) setMediaTypeFilter(savedMediaTypeFilter);
        if (savedStatusFilter) setStatusFilter(savedStatusFilter);
        if (savedSort) setSort(savedSort as LibrarySortOption);
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  // Save preferences when they change
  React.useEffect(() => {
    AsyncStorage.setItem('library_viewMode', viewMode).catch(console.error);
  }, [viewMode]);

  React.useEffect(() => {
    AsyncStorage.setItem('library_mediaTypeFilter', mediaTypeFilter).catch(console.error);
  }, [mediaTypeFilter]);

  React.useEffect(() => {
    AsyncStorage.setItem('library_statusFilter', statusFilter).catch(console.error);
  }, [statusFilter]);

  React.useEffect(() => {
    AsyncStorage.setItem('library_sort', sort).catch(console.error);
  }, [sort]);

  React.useEffect(() => {
    Animated.spring(filterHeight, {
      toValue: showFilters ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
  }, [showFilters]);

  const filtered = React.useMemo(() => {
    return entries.filter((entry) => {
      const matchesType = mediaTypeFilter === 'all' ? true : entry.mediaType === mediaTypeFilter;
      const matchesStatus = statusFilter === 'all' ? true : entry.status === statusFilter;
      const matchesSearch = searchQuery === '' ? true : 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.alternateTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [entries, mediaTypeFilter, statusFilter, searchQuery]);

  const sorted = React.useMemo(() => sortEntries(filtered, sort), [filtered, sort, sortEntries]);

  const renderGridItem = ({ item }: { item: typeof entries[number] }) => (
    <View className="w-1/3 p-1.5">
      <MediaCard
        entry={item}
        showQuickAction
        onQuickAdd={() => incrementProgress(item.id)}
        onToggleFavorite={() => toggleFavorite(item.id)}
        onPress={() => router.push(`/media/${item.id}`)}
      />
    </View>
  );

  const renderListItem = ({ item }: { item: typeof entries[number] }) => (
    <MediaListItem
      entry={item}
      onIncrement={() => incrementProgress(item.id)}
      onPress={() => router.push(`/media/${item.id}`)}
    />
  );

  const filterMaxHeight = React.useMemo(
    () =>
      filterHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 400],
      }),
    [filterHeight]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="px-4 py-6">
          <LoadingState rows={6} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 pt-4 pb-3">
        <Header 
          viewMode={viewMode} 
          onChangeViewMode={setViewMode}
        />
        
        {/* Search Bar with Filter Button */}
        <View className="mb-3 flex-row gap-2 items-center">
          <View className="flex-1">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search your library..."
            />
          </View>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="icon"
            className="rounded-full"
            onPress={() => setShowFilters(!showFilters)}>
            <Icon as={SlidersHorizontalIcon} size={20} />
          </Button>
        </View>

        {/* Active Filters Display */}
        {(mediaTypeFilter !== 'all' || statusFilter !== 'all') && (
          <View className="mb-3 flex-row flex-wrap gap-2 items-center">
            <Text className="text-xs text-muted-foreground">Filters:</Text>
            {mediaTypeFilter !== 'all' && (
              <Badge variant="secondary" className="rounded-full">
                <Text className="text-xs">
                  {MEDIA_TYPE_FILTERS.find(f => f.value === mediaTypeFilter)?.label}
                </Text>
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="rounded-full">
                <Text className="text-xs">
                  {STATUS_FILTERS.find(f => f.value === statusFilter)?.label}
                </Text>
              </Badge>
            )}
            <Pressable onPress={() => { setMediaTypeFilter('all'); setStatusFilter('all'); }}>
              <Text className="text-xs text-primary font-medium">Clear all</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Collapsible Filter Section */}
      <Animated.View style={{ maxHeight: filterMaxHeight, overflow: 'hidden' }}>
        <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2">Media Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {MEDIA_TYPE_FILTERS.map((filter) => (
                <FilterChip
                  key={filter.value}
                  label={filter.label}
                  selected={mediaTypeFilter === filter.value}
                  onPress={() => setMediaTypeFilter(filter.value)}
                />
              ))}
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2">Status</Text>
            <View className="flex-row flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => (
                <FilterChip
                  key={filter.value}
                  label={filter.label}
                  selected={statusFilter === filter.value}
                  onPress={() => setStatusFilter(filter.value)}
                />
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2">Sort By</Text>
            <View className="flex-row flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={sort === option.value}
                  onPress={() => setSort(option.value)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Results count and sort indicator */}
      <View className="px-4 py-2 flex-row items-center justify-between">
        <Text className="text-sm text-muted-foreground">
          {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {SORT_OPTIONS.find(o => o.value === sort)?.label}
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 96) }} 
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-4">
          {sorted.length === 0 ? (
            <EmptyState 
              title="No entries found" 
              description={mediaTypeFilter !== 'all' || statusFilter !== 'all' 
                ? "Try adjusting your filters to see more results." 
                : "Start adding media to your library!"}
            />
          ) : viewMode === 'grid' ? (
            <FlatList
              data={sorted}
              numColumns={3}
              key={'grid'}
              keyExtractor={(item) => `${item.id}-grid`}
              renderItem={renderGridItem}
              scrollEnabled={false}
              columnWrapperStyle={{ marginHorizontal: -6 }}
            />
          ) : (
            <FlatList
              data={sorted}
              key={'list'}
              keyExtractor={(item) => `${item.id}-list`}
              renderItem={renderListItem}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

type HeaderProps = {
  viewMode: LibraryViewMode;
  onChangeViewMode: (mode: LibraryViewMode) => void;
};

function Header({ viewMode, onChangeViewMode }: HeaderProps) {
  const toggleViewMode = () => {
    onChangeViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <Link href="/calendar" asChild>
          <Button 
          variant="ghost"
          size="icon"
          className="rounded-full"
          >
            <Icon as={CalendarIcon} size={20} />
          </Button>
        </Link>
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold">Home</Text>
        </View>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onPress={toggleViewMode}>
          <Icon as={LayoutGridIcon} size={20} />
        </Button>
      </View>
    </View>
  );
}
