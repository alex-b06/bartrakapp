import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Workout } from '@/types/workout';

interface WorkoutCardProps {
  onDelete?: (workoutId: string) => void;
  onPress?: (workout: Workout) => void;
  workout: Workout;
}

function formatVelocity(value: number) {
  return value > 0 ? `${value.toFixed(2)} m/s` : 'Analyzing';
}

export function WorkoutCard({ onDelete, onPress, workout }: WorkoutCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(workout)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.exercise}>{workout.exerciseType}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {workout.date}
          </ThemedText>
        </View>
        {onDelete ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${workout.exerciseType} workout`}
            hitSlop={12}
            onPress={() => onDelete(workout.id)}
            style={({ pressed }) => pressed && styles.pressed}>
            <SymbolView name="trash" tintColor={theme.textSecondary} size={18} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.metrics}>
        <Metric label="Reps" value={workout.reps > 0 ? String(workout.reps) : 'Analyzing'} />
        <Metric label="Avg Velocity" value={formatVelocity(workout.averageVelocity)} />
        <Metric label="Peak Velocity" value={formatVelocity(workout.peakVelocity)} />
      </View>
    </Pressable>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText style={styles.metricValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  titleGroup: {
    flex: 1,
    gap: Spacing.half,
  },
  exercise: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  metrics: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metric: {
    flex: 1,
    gap: Spacing.half,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.78,
  },
});
