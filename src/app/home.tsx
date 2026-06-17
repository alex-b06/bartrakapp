import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { ThemedText } from '@/components/themed-text';
import { WorkoutCard } from '@/components/WorkoutCard';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useWorkout } from '@/context/workout-context';
import { useTheme } from '@/hooks/use-theme';
import type { Workout } from '@/types/workout';

const mockDashboard = {
  weeklyWorkoutCount: 4,
  personalRecords: [
    { lift: 'Back Squat', value: '315 lb' },
    { lift: 'Bench Press', value: '225 lb' },
  ],
  quickStats: [
    { label: 'Sets Tracked', value: '18', detail: 'This month' },
    { label: 'Best Peak VBT', value: '0.92', detail: 'm/s' },
    { label: 'Training Streak', value: '3', detail: 'days' },
  ],
};

const mockLastWorkout: Workout = {
  id: 'mock-last-workout',
  date: 'Jun 14, 2026',
  exerciseType: 'Back Squat',
  reps: 5,
  averageVelocity: 0.54,
  peakVelocity: 0.72,
  videoUri: '',
  createdAt: new Date('2026-06-14T17:30:00.000Z'),
  analysisStatus: 'complete',
};

export default function HomeScreen() {
  const theme = useTheme();
  const { workouts } = useWorkout();
  const recentWorkout = workouts[0] ?? mockLastWorkout;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Header
            actions={[
              { accessibilityLabel: 'Open profile', icon: 'person.crop.circle', onPress: () => undefined },
              { accessibilityLabel: 'Open settings', icon: 'gearshape', onPress: () => undefined },
            ]}
          />

          <View style={styles.hero}>
            <ThemedText style={styles.eyebrow}>AI workout tracking foundation</ThemedText>
            <ThemedText style={styles.title}>Train, record, analyze.</ThemedText>
            <ThemedText themeColor="textSecondary">
              Capture sets now. Pose estimation, rep counting, and velocity metrics can plug into
              this workflow later.
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <ActionCard
              icon="video.fill"
              label="Track Workout"
              onPress={() => router.push('/camera' as Href)}
              primary
            />
            <ActionCard
              icon="clock.arrow.circlepath"
              label="Workout History"
              onPress={() => router.push('/history' as Href)}
            />
          </View>

          <Section title="Quick Stats">
            <View style={styles.statsGrid}>
              {mockDashboard.quickStats.map(stat => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </View>
          </Section>

          <Section title="Recent Workout Summary">
            <WorkoutCard workout={recentWorkout} />
          </Section>

          <View style={styles.twoColumn}>
            <View style={[styles.panel, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small" themeColor="textSecondary">
                Weekly Workout Count
              </ThemedText>
              <ThemedText style={styles.largeNumber}>{mockDashboard.weeklyWorkoutCount}</ThemedText>
            </View>
            <View style={[styles.panel, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small" themeColor="textSecondary">
                Personal Records
              </ThemedText>
              {mockDashboard.personalRecords.map(record => (
                <View key={record.lift} style={styles.recordRow}>
                  <ThemedText type="smallBold">{record.lift}</ThemedText>
                  <ThemedText type="smallBold">{record.value}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
}

function ActionCard({
  icon,
  label,
  onPress,
  primary = false,
}: {
  icon: 'video.fill' | 'clock.arrow.circlepath';
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const theme = useTheme();
  const backgroundColor = primary ? '#22C55E' : theme.backgroundElement;
  const foregroundColor = primary ? '#06130A' : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor },
        pressed && styles.pressed,
      ]}>
      <SymbolView name={icon} tintColor={foregroundColor} size={26} />
      <ThemedText style={[styles.actionLabel, { color: foregroundColor }]}>{label}</ThemedText>
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
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    width: '100%',
  },
  hero: {
    gap: Spacing.two,
  },
  eyebrow: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 44,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  actionCard: {
    alignItems: 'flex-start',
    borderRadius: 8,
    flex: 1,
    gap: Spacing.three,
    minHeight: 126,
    justifyContent: 'space-between',
    padding: Spacing.three,
  },
  actionLabel: {
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 24,
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 28,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  panel: {
    borderRadius: 8,
    flex: 1,
    gap: Spacing.two,
    minHeight: 130,
    padding: Spacing.three,
  },
  largeNumber: {
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 50,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.78,
  },
});
