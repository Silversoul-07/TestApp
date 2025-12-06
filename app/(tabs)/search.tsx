// TODO: Discover page complete makeover:
// Backend improvements:
// - Setup serverless backend (Supabase Edge Functions) for recommendations
// - Implement AI-powered personalized recommendations based on watch history
// - Add external API integration (TMDB, AniList, etc.) for search and metadata
// - Create recommendation algorithm using genre preferences and ratings
// - Add caching layer for API responses to reduce costs
// 
// UI improvements:
// - Complete redesign with modern card-based layout
// - Add infinite scroll for search results
// - Implement advanced filters (genre, year, rating, etc.)
// - Add trending section with real-time data
// - Allow users to create and share custom public lists
// - Add "Discover" feed with curated collections
// - Improve search autocomplete and suggestions
// - Add preview cards with quick actions (add to list, view details)

import { MediaCard } from '@/components/cards/media-card';
import { EmptyState } from '@/components/shared/empty-state';
import { FilterChip } from '@/components/shared/filter-chip';
import { LoadingState } from '@/components/shared/loading-state';
import { SearchBar } from '@/components/shared/search-bar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useMedia } from '@/hooks/use-media';
import { MEDIA_TYPE_FILTERS, TRENDING_TABS } from '@/lib/constants/media';
import { PlusCircleIcon, SlidersHorizontalIcon } from 'lucide-react-native';
import React from 'react';
import { FlatList, ScrollView, View, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TABS = ['results', 'trending', 'seasonal', 'recommendations'] as const;

type TabKey = (typeof TABS)[number];

export default function SearchScreen() {
  const { search, trendingByType, entries, loading } = useMedia();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = React.useState('');
  const [quickFilter, setQuickFilter] = React.useState<'all' | string>('all');
  const [activeTab, setActiveTab] = React.useState<TabKey>('results');
  const [trendingTab, setTrendingTab] = React.useState<'anime' | 'manga' | 'tv' | 'movie'>('anime');
  const [showFilters, setShowFilters] = React.useState(false);
  const filterHeight = React.useRef(new Animated.Value(0)).current;

  // Load saved preferences
  React.useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedQuickFilter = await AsyncStorage.getItem('discover_quickFilter');
        const savedActiveTab = await AsyncStorage.getItem('discover_activeTab');
        const savedTrendingTab = await AsyncStorage.getItem('discover_trendingTab');
        
        if (savedQuickFilter) setQuickFilter(savedQuickFilter);
        if (savedActiveTab) setActiveTab(savedActiveTab as TabKey);
        if (savedTrendingTab) setTrendingTab(savedTrendingTab as any);
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  // Save preferences when they change
  React.useEffect(() => {
    AsyncStorage.setItem('discover_quickFilter', quickFilter).catch(console.error);
  }, [quickFilter]);

  React.useEffect(() => {
    AsyncStorage.setItem('discover_activeTab', activeTab).catch(console.error);
  }, [activeTab]);

  React.useEffect(() => {
    AsyncStorage.setItem('discover_trendingTab', trendingTab).catch(console.error);
  }, [trendingTab]);

  React.useEffect(() => {
    Animated.spring(filterHeight, {
      toValue: showFilters ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
  }, [showFilters]);

  const results = search(query, {
    mediaType: quickFilter !== 'all' ? (quickFilter as any) : 'all',
    status: 'all',
  });

  const filterByTrendingTab = React.useCallback(
    (list: typeof entries) => list.filter((item) => item.mediaType === trendingTab),
    [trendingTab]
  );

  const trendingData = trendingByType[trendingTab] ?? [];
  const seasonalData = filterByTrendingTab(
    entries.filter((entry) => entry.seasonalRank).sort((a, b) => (a.seasonalRank ?? 0) - (b.seasonalRank ?? 0))
  );
  const recommendationData = filterByTrendingTab(
    entries
      .filter((entry) => entry.recommendationRank)
      .sort((a, b) => (a.recommendationRank ?? 0) - (b.recommendationRank ?? 0))
  );

  const tabDataMap: Record<TabKey, typeof results> = {
    results,
    trending: trendingData,
    seasonal: seasonalData,
    recommendations: recommendationData,
  };

  const renderGrid = (data: typeof results, keyPrefix: string, showRanking = false) => (
    <FlatList
      data={data}
      numColumns={3}
      scrollEnabled={false}
      key={`${keyPrefix}-${activeTab}`}
      keyExtractor={(item) => `${item.id}-${keyPrefix}`}
      renderItem={({ item, index }) => (
        <View className="w-1/3 p-1.5">
          <MediaCard
            entry={item}
            ranking={showRanking ? index + 1 : undefined}
            onPress={() => router.push(`/media/${item.id}`)}
          />
        </View>
      )}
      columnWrapperStyle={{ marginHorizontal: -6 }}
    />
  );

  const filterMaxHeight = React.useMemo(
    () =>
      filterHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300],
      }),
    [filterHeight]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="px-4 py-6">
          <LoadingState rows={4} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 pt-4 pb-3">
        <DiscoverHeader 
          onAddPress={() => router.push('/(tabs)/add-entry')}
        />
        
        {/* Search Bar with Filter Button */}
        <View className="mb-3 flex-row gap-2 items-center">
          <View className="flex-1">
            <SearchBar 
              value={query} 
              onChangeText={setQuery}
              placeholder="Search media..."
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
                  selected={quickFilter === filter.value}
                  onPress={() => setQuickFilter(filter.value)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-3">
        <View className="flex-row gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onPress={() => setActiveTab(tab)}>
              <Text className="capitalize">{tab}</Text>
            </Button>
          ))}
        </View>
      </ScrollView>

      {/* Content Type Tabs (for trending/seasonal/recommendations) */}
      {activeTab !== 'results' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-3">
          <View className="flex-row gap-2">
            {TRENDING_TABS.map((tab) => (
              <Button
                key={tab.value}
                variant={trendingTab === tab.value ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
                onPress={() => setTrendingTab(tab.value)}>
                <Text>{tab.label}</Text>
              </Button>
            ))}
          </View>
        </ScrollView>
      )}

      <ScrollView 
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 96) }} 
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-2">
          {activeTab === 'results' && (results.length === 0 ? (
            <EmptyState 
              title="No results" 
              description={query ? "Try another keyword." : "Start searching to discover new media"}
            />
          ) : (
            renderGrid(results, 'results')
          ))}
          {activeTab !== 'results' && (
            <>
              {tabDataMap[activeTab].length === 0 ? (
                <EmptyState title="Nothing yet" description="Check back after syncing." />
              ) : (
                renderGrid(tabDataMap[activeTab], activeTab, true)
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

type DiscoverHeaderProps = {
  onAddPress: () => void;
};

function DiscoverHeader({ onAddPress }: DiscoverHeaderProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <View className="w-10" />
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold">Discover</Text>
        </View>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onPress={onAddPress}>
          <Icon as={PlusCircleIcon} size={22} />
        </Button>
      </View>
    </View>
  );
}
