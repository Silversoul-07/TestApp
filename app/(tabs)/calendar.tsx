// TODO: Calendar feature enhancements:
// - Swap to display all entries in daily view instead of filtered by date
// - Add support for future date entries (allow scheduling future watching/reading)
// - Implement reminder system with notification support
// - Add option to set and manage reminders for entries
// - Consider adding week view and month view options
// - Add entry completion predictions based on progress
// - Integrate with device calendar for external reminders

import { MediaListItem } from '@/components/cards/media-list-item';
import { LoadingState } from '@/components/shared/loading-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useMedia } from '@/hooks/use-media';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon,
  TvIcon,
  BookOpenIcon,
  XIcon
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import type { MediaEntry } from '@/lib/types/media';

export default function CalendarScreen() {
  const { entries, loading, incrementProgress, toggleFavorite } = useMedia();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [viewMode, setViewMode] = React.useState<'day' | 'all'>('day');
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  // Group entries by date
  const entriesByDate = React.useMemo(() => {
    const grouped: Record<string, MediaEntry[]> = {};
    
    entries.forEach((entry) => {
      const dateKey = entry.updatedAt.split('T')[0]; // Extract YYYY-MM-DD
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });
    
    return grouped;
  }, [entries]);

  // Get entries for selected date
  const selectedDateEntries = React.useMemo(() => {
    if (viewMode === 'all') {
      return entries;
    }
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    return entriesByDate[dateKey] || [];
  }, [selectedDate, entriesByDate, entries, viewMode]);

  // Get calendar days for current month
  const calendarDays = React.useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  // Check if a date has entries
  const hasEntriesOnDate = (date: Date | null): boolean => {
    if (!date) return false;
    const dateKey = date.toISOString().split('T')[0];
    return !!entriesByDate[dateKey]?.length;
  };

  const isSelectedDate = (date: Date | null): boolean => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate stats for selected view
  const stats = React.useMemo(() => {
    const episodes = selectedDateEntries
      .filter(e => e.unitLabel === 'episodes')
      .reduce((sum, e) => sum + (e.progressUnits || 0), 0);
    
    const chapters = selectedDateEntries
      .filter(e => e.unitLabel === 'chapters')
      .reduce((sum, e) => sum + (e.progressUnits || 0), 0);
    
    return { episodes, chapters, total: selectedDateEntries.length };
  }, [selectedDateEntries]);

  if (loading) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="px-4 py-10">
          <LoadingState rows={4} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-4">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold">Activity Calendar</Text>
              <Text className="text-sm text-muted-foreground">
                Track your viewing history
              </Text>
            </View>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onPress={() => router.back()}
            >
              <Icon as={XIcon} size={20} />
            </Button>
          </View>

          {/* View Mode Toggle */}
          <View className="mb-4 flex-row gap-2">
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full flex-1"
              onPress={() => setViewMode('day')}
            >
              <Text>Daily View</Text>
            </Button>
            <Button
              variant={viewMode === 'all' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full flex-1"
              onPress={() => setViewMode('all')}
            >
              <Text>All Entries</Text>
            </Button>
          </View>

          {/* Calendar Card */}
          {viewMode === 'day' && (
            <View className="mb-6 bg-card rounded-3xl p-4 border border-border/50">
              {/* Month Navigation */}
              <View className="mb-4 flex-row items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onPress={goToPreviousMonth}
                >
                  <Icon as={ChevronLeftIcon} size={20} />
                </Button>
                <Text className="text-lg font-semibold">{monthName}</Text>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onPress={goToNextMonth}
                >
                  <Icon as={ChevronRightIcon} size={20} />
                </Button>
              </View>

              {/* Week Day Headers */}
              <View className="mb-2 flex-row">
                {weekDays.map((day) => (
                  <View key={day} className="flex-1 items-center">
                    <Text className="text-xs font-medium text-muted-foreground">{day}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View className="flex-row flex-wrap">
                {calendarDays.map((date, index) => {
                  const hasEntries = hasEntriesOnDate(date);
                  const selected = isSelectedDate(date);
                  const today = isToday(date);

                  return (
                    <View key={index} className="w-[14.28%] p-1">
                      {date ? (
                        <Pressable
                          onPress={() => setSelectedDate(date)}
                          className={`
                            aspect-square items-center justify-center rounded-xl
                            ${selected ? 'bg-primary' : hasEntries ? 'bg-primary/10' : 'bg-transparent'}
                            ${today && !selected ? 'border border-primary' : ''}
                          `}
                        >
                          <Text 
                            className={`
                              text-sm font-medium
                              ${selected ? 'text-primary-foreground' : hasEntries ? 'text-primary' : 'text-foreground'}
                            `}
                          >
                            {date.getDate()}
                          </Text>
                          {hasEntries && !selected && (
                            <View className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                          )}
                        </Pressable>
                      ) : (
                        <View className="aspect-square" />
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Selected Date Info */}
              <View className="mt-4 pt-4 border-t border-border/50">
                <Text className="text-sm font-medium mb-2">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
                <View className="flex-row gap-4">
                  <View className="flex-row items-center gap-1">
                    <Icon as={CalendarIcon} size={14} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">
                      {stats.total} {stats.total === 1 ? 'entry' : 'entries'}
                    </Text>
                  </View>
                  {stats.episodes > 0 && (
                    <View className="flex-row items-center gap-1">
                      <Icon as={TvIcon} size={14} className="text-muted-foreground" />
                      <Text className="text-xs text-muted-foreground">
                        {stats.episodes} ep
                      </Text>
                    </View>
                  )}
                  {stats.chapters > 0 && (
                    <View className="flex-row items-center gap-1">
                      <Icon as={BookOpenIcon} size={14} className="text-muted-foreground" />
                      <Text className="text-xs text-muted-foreground">
                        {stats.chapters} ch
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Stats Summary for All View */}
          {viewMode === 'all' && (
            <View className="mb-6 bg-card rounded-3xl p-4 border border-border/50">
              <Text className="text-lg font-semibold mb-3">All Activity</Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-2xl font-bold">{stats.total}</Text>
                  <Text className="text-xs text-muted-foreground">Entries</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold">{stats.episodes}</Text>
                  <Text className="text-xs text-muted-foreground">Episodes</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold">{stats.chapters}</Text>
                  <Text className="text-xs text-muted-foreground">Chapters</Text>
                </View>
              </View>
            </View>
          )}

          {/* Entries List */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold">
              {viewMode === 'day' ? 'Activity on this day' : 'All Activity'}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {selectedDateEntries.length} {selectedDateEntries.length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {selectedDateEntries.length === 0 ? (
            <EmptyState
              title={viewMode === 'day' ? 'No activity on this day' : 'No entries yet'}
              description={viewMode === 'day' ? 'Select a different date or add new entries' : 'Start tracking your media'}
            />
          ) : (
            <View className="gap-3">
              {selectedDateEntries.map((entry) => (
                <MediaListItem
                  key={entry.id}
                  entry={entry}
                  onPress={() => router.push(`/media/${entry.id}`)}
                  onIncrement={() => incrementProgress(entry.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
