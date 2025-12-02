import { ActivityHeatmap } from '@/components/charts/activity-heatmap';
import { DistributionChart } from '@/components/charts/distribution-chart';
import { FavoriteGenresBar } from '@/components/charts/favorite-genres-bar';
import { MilestoneCard } from '@/components/cards/milestone-card';
import { SectionHeader } from '@/components/shared/section-header';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useMedia } from '@/hooks/use-media';
import type { DistributionDatum, GenreDistribution } from '@/lib/types/media';
import { 
  TrendingUpIcon, 
  HeartIcon, 
  ClockIcon,
  StarIcon,
  BarChart3Icon,
  ZapIcon,
  CheckCircle2Icon,
  TrophyIcon,
  TargetIcon,
  FlameIcon,
  SparklesIcon,
  SettingsIcon
} from 'lucide-react-native';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { stats, entries, loading } = useMedia();
  const insets = useSafeAreaInsets();

  // Calculate mindful watching stats
  const mindfulStats = React.useMemo(() => {
    const completed = entries.filter((e) => e.status === 'completed');
    const inProgress = entries.filter((e) => e.status === 'watching' || e.status === 'reading');
    const dropped = entries.filter((e) => e.status === 'dropped');
    
    // Completion rate (started to finished ratio)
    const completionRate = entries.length > 0 
      ? ((completed.length / (completed.length + inProgress.length + dropped.length)) * 100) 
      : 0;
    
    // Quality score (average rating of completed items)
    const ratedCompleted = completed.filter((e) => e.rating && e.rating > 0);
    const qualityScore = ratedCompleted.length > 0
      ? ratedCompleted.reduce((sum, e) => sum + (e.rating ?? 0), 0) / ratedCompleted.length
      : 0;
    
    // Genre diversity (unique genres / total possible from entries)
    const uniqueGenres = new Set(entries.flatMap((e) => e.genres));
    const genreDiversity = uniqueGenres.size;
    
    // Watch velocity (episodes watched in last 7 days - simulated)
    const recentEpisodes = entries
      .filter((e) => e.unitLabel === 'episodes')
      .slice(0, 7)
      .reduce((sum, e) => sum + (e.progressUnits ?? 0), 0);
    const weeklyVelocity = Math.round(recentEpisodes / 7);
    
    // Efficiency score (% of started shows that are completed or near completion)
    const nearCompletion = entries.filter((e) => 
      e.totalUnits && e.progressUnits && (e.progressUnits / e.totalUnits) >= 0.8
    );
    const efficiencyScore = entries.length > 0
      ? Math.round(((completed.length + nearCompletion.length) / entries.length) * 100)
      : 0;
    
    // Current streak (consecutive days with activity - simulated)
    const currentStreak = Math.min(entries.length, 12); // Simulated
    
    // Hidden gems found (high-rated shows with low trending rank)
    const hiddenGems = completed.filter((e) => 
      (e.rating ?? 0) >= 8 && (!e.trendingRank || e.trendingRank > 50)
    ).length;

    return {
      completionRate: Math.round(completionRate),
      qualityScore: Number(qualityScore.toFixed(1)),
      genreDiversity,
      weeklyVelocity,
      efficiencyScore,
      currentStreak,
      hiddenGems,
      totalCompleted: completed.length,
      totalInProgress: inProgress.length,
    };
  }, [entries]);

  const distribution: DistributionDatum[] = React.useMemo(() => {
    const map: Record<string, number> = {};
    entries.forEach((entry) => {
      map[entry.mediaType] = (map[entry.mediaType] ?? 0) + 1;
    });
    return Object.entries(map).map(([mediaType, value]) => ({ mediaType: mediaType as any, value }));
  }, [entries]);

  const genreDistribution: GenreDistribution[] = React.useMemo(() => {
    const map: Record<string, number> = {};
    entries.forEach((entry) => {
      entry.genres.forEach((genre) => {
        map[genre] = (map[genre] ?? 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([genre, value]) => ({ genre, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [entries]);

  const activity = React.useMemo(() => {
    return entries.slice(0, 30).map((entry, index) => ({
      date: `${entry.updatedAt}-${entry.id}`,
      value: entry.progressUnits ?? 0,
    }));
  }, [entries]);

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
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 96), paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        <View className="px-4">
          {/* Center-Aligned Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <View className="w-10" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold">Profile</Text>
            </View>
            <Link href="/settings" asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon as={SettingsIcon} size={20} />
              </Button>
            </Link>
          </View>

          {/* User Info Card */}
          <View className="mb-6 bg-card rounded-3xl p-6 border border-border/50">
            <View className="flex-row items-center gap-4 mb-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Text className="text-2xl font-bold text-primary">PR</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold">Praveen</Text>
                <Text className="text-sm text-muted-foreground">Mindful Watcher</Text>
              </View>
            </View>
            
            {/* Quick Stats Row - Mindful Focus */}
            <View className="flex-row justify-around pt-4 border-t border-border/50">
              <View className="items-center">
                <View className="flex-row items-center gap-1">
                  <Text className="text-2xl font-bold">{mindfulStats.completionRate}</Text>
                  <Text className="text-lg text-muted-foreground">%</Text>
                </View>
                <Text className="text-xs text-muted-foreground">Completion</Text>
              </View>
              <View className="items-center">
                <View className="flex-row items-center gap-1">
                  <Icon as={StarIcon} size={16} className="text-yellow-500" />
                  <Text className="text-2xl font-bold text-yellow-500">{mindfulStats.qualityScore}</Text>
                </View>
                <Text className="text-xs text-muted-foreground">Quality</Text>
              </View>
              <View className="items-center">
                <View className="flex-row items-center gap-1">
                  <Icon as={FlameIcon} size={16} className="text-orange-500" />
                  <Text className="text-2xl font-bold text-orange-500">{mindfulStats.currentStreak}</Text>
                </View>
                <Text className="text-xs text-muted-foreground">Day Streak</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-500">{mindfulStats.efficiencyScore}%</Text>
                <Text className="text-xs text-muted-foreground">Efficient</Text>
              </View>
            </View>
          </View>

          {/* Mindful Watching Insights */}
          <SectionHeader title="Watching Insights" />
          <MindfulStatsGrid stats={mindfulStats} totalStats={stats} />
          
          {/* Content Balance - Compact Visualization */}
          <SectionHeader title="Content Balance" />
          <View className="mb-6 flex-row gap-3">
            <View className="flex-1">
              <DistributionChart data={distribution} />
            </View>
          </View>
          
          {/* Genre Exploration */}
          <SectionHeader title="Genre Exploration" />
          <View className="mb-6">
            <View className="bg-card rounded-2xl p-4 border border-border/50 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium">Diversity Score</Text>
                <View className="flex-row items-center gap-2">
                  <Icon as={SparklesIcon} size={16} className="text-purple-500" />
                  <Text className="text-lg font-bold text-purple-500">{mindfulStats.genreDiversity}</Text>
                </View>
              </View>
              <Text className="text-xs text-muted-foreground">
                Exploring {mindfulStats.genreDiversity} unique genres
              </Text>
            </View>
            <FavoriteGenresBar data={genreDistribution} />
          </View>
          
          {/* Activity Pattern - Condensed */}
          <SectionHeader title="Recent Activity" />
          <ActivityHeatmap data={activity} />
          
          {/* Achievements - Mindful Focus */}
          <SectionHeader title="Achievements" />
          <View className="mb-6 gap-3">
            {mindfulStats.hiddenGems > 0 && (
              <MilestoneCard
                title={`${mindfulStats.hiddenGems} Hidden Gem${mindfulStats.hiddenGems > 1 ? 's' : ''}`}
                description="Discovered underrated treasures"
                icon={TrophyIcon}
                achievedAt="Your taste!"
              />
            )}
            {mindfulStats.completionRate >= 75 && (
              <MilestoneCard
                title="Finisher's Mindset"
                description={`${mindfulStats.completionRate}% completion rate`}
                icon={CheckCircle2Icon}
                achievedAt="Excellent!"
              />
            )}
            {mindfulStats.currentStreak >= 7 && (
              <MilestoneCard
                title={`${mindfulStats.currentStreak} Day Streak`}
                description="Consistent viewing habits"
                icon={FlameIcon}
                achievedAt="Keep it up!"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Mindful Stats Grid - Focus on quality and efficiency metrics
function MindfulStatsGrid({
  stats,
  totalStats,
}: {
  stats: {
    completionRate: number;
    qualityScore: number;
    genreDiversity: number;
    weeklyVelocity: number;
    efficiencyScore: number;
    currentStreak: number;
    hiddenGems: number;
    totalCompleted: number;
    totalInProgress: number;
  };
  totalStats: {
    totalEntries: number;
    meanScore: number;
    episodesWatched: number;
    chaptersRead: number;
    completed: number;
    inProgress: number;
    daysWatched: number;
  };
}) {
  const insights = [
    {
      label: 'Watch Velocity',
      value: `${stats.weeklyVelocity}/day`,
      sublabel: 'Avg episodes',
      icon: ZapIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      insight: stats.weeklyVelocity > 5 ? 'Intense!' : stats.weeklyVelocity > 2 ? 'Balanced' : 'Casual',
    },
    {
      label: 'Completion Focus',
      value: `${stats.totalCompleted}/${stats.totalInProgress}`,
      sublabel: 'Done/Active',
      icon: TargetIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      insight: stats.completionRate >= 75 ? 'Excellent' : stats.completionRate >= 50 ? 'Good' : 'Try finishing!',
    },
    {
      label: 'Quality Threshold',
      value: stats.qualityScore.toFixed(1),
      sublabel: `of ${totalStats.meanScore.toFixed(1)} avg`,
      icon: StarIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      insight: stats.qualityScore >= 8 ? 'High standards' : stats.qualityScore >= 7 ? 'Selective' : 'Exploring',
    },
    {
      label: 'Time Invested',
      value: `${totalStats.daysWatched}d`,
      sublabel: `${totalStats.episodesWatched} episodes`,
      icon: ClockIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      insight: totalStats.daysWatched > 30 ? 'Dedicated' : 'Growing',
    },
  ];

  return (
    <View className="mb-6 gap-3">
      {insights.map((item) => (
        <View 
          key={item.label} 
          className="bg-card rounded-2xl border border-border/50 p-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              <View className={`h-12 w-12 items-center justify-center rounded-xl ${item.bgColor}`}>
                <Icon as={item.icon} size={20} className={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-muted-foreground">{item.label}</Text>
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-2xl font-bold">{item.value}</Text>
                  <Text className="text-xs text-muted-foreground">{item.sublabel}</Text>
                </View>
              </View>
            </View>
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-xs font-medium text-primary">{item.insight}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function StatsGrid({
  stats,
}: {
  stats: {
    totalEntries: number;
    meanScore: number;
    episodesWatched: number;
    chaptersRead: number;
    completed: number;
    inProgress: number;
    daysWatched: number;
  };
}) {
  const statItems = [
    { 
      label: 'Episodes Watched', 
      value: stats.episodesWatched, 
      icon: TrendingUpIcon,
      color: 'text-blue-500'
    },
    { 
      label: 'Chapters Read', 
      value: stats.chaptersRead, 
      icon: HeartIcon,
      color: 'text-pink-500'
    },
    { 
      label: 'Mean Score', 
      value: stats.meanScore.toFixed(1), 
      icon: StarIcon,
      color: 'text-yellow-500'
    },
    { 
      label: 'Days Watched', 
      value: stats.daysWatched, 
      icon: ClockIcon,
      color: 'text-purple-500'
    },
  ];
  
  return (
    <View className="mb-6 flex-row flex-wrap gap-3">
      {statItems.map((item) => (
        <View key={item.label} className="flex-1 min-w-[45%] bg-card rounded-2xl border border-border/50 p-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold">{item.value}</Text>
            <Icon as={item.icon} size={20} className={item.color} />
          </View>
          <Text className="text-xs text-muted-foreground">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
