import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { SearchBar } from '@/components/SearchBar';
import { ThemedText } from '@/components/themed-text';
import { WorkoutCard } from '@/components/WorkoutCard';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useWorkout } from '@/context/workout-context';
import { useTheme } from '@/hooks/use-theme';

type SortOption = 'newest' | 'oldest';

export default function HistoryScreen() {
  const theme = useTheme();
  const { deleteWorkout, workouts } = useWorkout();
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const filteredWorkouts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return workouts
      .filter(workout => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          workout.exerciseType.toLowerCase().includes(normalizedQuery) ||
          workout.date.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        const difference = b.createdAt.getTime() - a.createdAt.getTime();
        return sortOption === 'newest' ? difference : -difference;
      });
  }, [query, sortOption, workouts]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Workout History</ThemedText>
            <ThemedText themeColor="textSecondary">
              Review recorded sets and placeholder analysis as the ML pipeline comes online.
            </ThemedText>
          </View>

          <SearchBar
            onChangeText={setQuery}
            placeholder="Search by exercise or date"
            value={query}
          />

          <View style={styles.sortRow}>
            <SortButton
              active={sortOption === 'newest'}
              label="Newest First"
              onPress={() => setSortOption('newest')}
            />
            <SortButton
              active={sortOption === 'oldest'}
              label="Oldest First"
              onPress={() => setSortOption('oldest')}
            />
          </View>

          {workouts.length === 0 ? (
            <EmptyState
              actionLabel="Record Your First Workout"
              message="No workouts recorded yet. Start with one set and BarTrak will save it here."
              onActionPress={() => router.push('/camera' as Href)}
              title="No workouts recorded yet."
            />
          ) : filteredWorkouts.length === 0 ? (
            <EmptyState
              message="Try a different exercise name or date."
              title="No matching workouts"
              icon="magnifyingglass"
            />
          ) : (
            <View style={styles.list}>
              {filteredWorkouts.map(workout => (
                <WorkoutCard key={workout.id} onDelete={deleteWorkout} workout={workout} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SortButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.sortButton,
        { backgroundColor: active ? '#22C55E' : theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <ThemedText style={[styles.sortLabel, active && styles.activeSortLabel]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: BottomTabInset + Spacing.four,
  },
  container: {
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    width: '100%',
  },
  header: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  sortRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  sortButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  activeSortLabel: {
    color: '#06130A',
  },
  list: {
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.78,
  },
});
