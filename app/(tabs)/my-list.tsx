import { MediaCard } from '@/components/cards/media-card';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { useMedia } from '@/hooks/use-media';
import { PlusIcon, Edit2Icon, Trash2Icon, ListIcon } from 'lucide-react-native';
import React from 'react';
import { FlatList, ScrollView, View, Pressable, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type CustomList = {
  id: string;
  name: string;
  entryIds: string[];
  createdAt: string;
  isDefault?: boolean;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_LISTS: CustomList[] = [
  {
    id: 'favourites',
    name: 'Favourites',
    entryIds: [],
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
];

export default function MyListScreen() {
  const { entries, incrementProgress, toggleFavorite, loading } = useMedia();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [lists, setLists] = React.useState<CustomList[]>([
    ...DEFAULT_LISTS,
    {
      id: '2',
      name: 'Romance',
      entryIds: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Action',
      entryIds: [],
      createdAt: new Date().toISOString(),
    },
  ]);
  
  const [activeListIndex, setActiveListIndex] = React.useState(0);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [newListName, setNewListName] = React.useState('');
  
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = React.useRef<ScrollView>(null);

  const activeList = lists[activeListIndex];
  const listEntries = React.useMemo(() => {
    if (!activeList) return [];
    return entries.filter(entry => activeList.entryIds.includes(entry.id));
  }, [activeList, entries]);

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    
    const newList: CustomList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      entryIds: [],
      createdAt: new Date().toISOString(),
    };
    
    setLists([...lists, newList]);
    setNewListName('');
    setShowCreateDialog(false);
    setActiveListIndex(lists.length);
  };

  const handleDeleteList = (listId: string) => {
    // Prevent deletion of default lists
    const listToDelete = lists.find(list => list.id === listId);
    if (listToDelete?.isDefault) return;
    
    const newLists = lists.filter(list => list.id !== listId);
    setLists(newLists);
    if (activeListIndex >= newLists.length) {
      setActiveListIndex(Math.max(0, newLists.length - 1));
    }
  };

  const handleTabPress = (index: number) => {
    setActiveListIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * 120,
      animated: true,
    });
  };

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
      {/* Header */}
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <View className="w-10" />
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold">My Lists</Text>
          </View>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onPress={() => setShowCreateDialog(true)}>
            <Icon as={PlusIcon} size={20} />
          </Button>
        </View>
      </View>

      {/* TikTok-style Sliding Tabs */}
      {lists.length > 0 && (
        <View className="mb-4 bg-card/30 border-b border-border/50">
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}>
            {lists.map((list, index) => {
              const isActive = activeListIndex === index;
              return (
                <Pressable
                  key={list.id}
                  onPress={() => handleTabPress(index)}
                  className={`py-3 px-4 rounded-full ${
                    isActive ? 'bg-primary' : 'bg-transparent'
                  }`}>
                  <Text
                    className={`text-sm font-semibold ${
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}>
                    {list.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* List Info Bar */}
      {activeList && (
        <View className="px-4 py-3 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm text-muted-foreground">
              {listEntries.length} {listEntries.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
          <View className="flex-row gap-2">
            {!activeList.isDefault && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onPress={() => {
                    // TODO: Implement edit list
                  }}>
                  <Icon as={Edit2Icon} size={16} className="text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onPress={() => handleDeleteList(activeList.id)}>
                  <Icon as={Trash2Icon} size={16} className="text-destructive" />
                </Button>
              </>
            )}
          </View>
        </View>
      )}

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 96) }}
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          {lists.length === 0 ? (
            <EmptyState
              title="No lists yet"
              description="Create your first custom list to organize your media"
            />
          ) : listEntries.length === 0 ? (
            <EmptyState
              title="Empty list"
              description="Add media to this list from the media detail page"
            />
          ) : (
            <FlatList
              data={listEntries}
              numColumns={3}
              key="grid"
              keyExtractor={(item) => `${item.id}-list`}
              renderItem={renderGridItem}
              scrollEnabled={false}
              columnWrapperStyle={{ marginHorizontal: -6 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Create List Dialog */}
      {showCreateDialog && (
        <View className="absolute inset-0 bg-background/95 items-center justify-center px-6">
          <View className="bg-card rounded-3xl p-6 w-full max-w-md border border-border">
            <View className="mb-6">
              <Text className="text-2xl font-bold mb-2">Create New List</Text>
              <Text className="text-sm text-muted-foreground">
                Organize your media into custom collections
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium mb-2">List Name *</Text>
              <Input
                value={newListName}
                onChangeText={setNewListName}
                placeholder="e.g., Romance, Action, Favorites"
                className="bg-background"
              />
            </View>

            <View className="flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => {
                  setShowCreateDialog(false);
                  setNewListName('');
                }}>
                <Text>Cancel</Text>
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onPress={handleCreateList}
                disabled={!newListName.trim()}>
                <Text>Create</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
