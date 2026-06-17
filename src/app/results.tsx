import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatCard } from '@/components/StatCard';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useWorkout } from '@/context/workout-context';
import { useTheme } from '@/hooks/use-theme';

export default function ResultsScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const videoUri = typeof params.videoUri === 'string' ? params.videoUri : undefined;
  const workoutId = typeof params.workoutId === 'string' ? params.workoutId : undefined;
  const timestamp = typeof params.timestamp === 'string' ? params.timestamp : undefined;
  const { getWorkoutById } = useWorkout();
  const workout = workoutId ? getWorkoutById(workoutId) : undefined;
  const player = useVideoPlayer(videoUri ? { uri: videoUri } : null, videoPlayer => {
    videoPlayer.loop = true;
  });

  const recordedAt = timestamp
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(timestamp))
    : 'Just now';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Set Results</ThemedText>
            <ThemedText themeColor="textSecondary">{recordedAt}</ThemedText>
          </View>

          <View style={[styles.videoFrame, { backgroundColor: theme.backgroundElement }]}>
            {videoUri ? (
              <VideoView
                contentFit="cover"
                fullscreenOptions={{ enable: true }}
                nativeControls
                player={player}
                style={styles.video}
                surfaceType="textureView"
              />
            ) : (
              <View style={styles.missingVideo}>
                <ThemedText type="small" themeColor="textSecondary">
                  Video preview unavailable
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.analysisPanel}>
            <ThemedText style={styles.sectionTitle}>Placeholder Metrics</ThemedText>
            <View style={styles.statsGrid}>
              <StatCard label="Exercise Type" value={workout?.exerciseType ?? 'Analyzing'} />
              <StatCard label="Reps" value="Analyzing" />
              <StatCard label="Peak Velocity" value="Analyzing" detail="m/s" />
              <StatCard label="Average Velocity" value="Analyzing" detail="m/s" />
            </View>
          </View>

          <View style={styles.actions}>
            <ResultButton label="Record Another Set" onPress={() => router.replace('/camera' as Href)} primary />
            <ResultButton label="View History" onPress={() => router.push('/history' as Href)} />
            <ResultButton label="Return Home" onPress={() => router.push('/home' as Href)} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultButton({
  label,
  onPress,
  primary = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: primary ? '#22C55E' : theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <ThemedText style={[styles.buttonLabel, primary && styles.primaryButtonLabel]}>{label}</ThemedText>
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
  header: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  videoFrame: {
    aspectRatio: 9 / 14,
    borderRadius: 8,
    maxHeight: 520,
    overflow: 'hidden',
    width: '100%',
  },
  video: {
    flex: 1,
  },
  missingVideo: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  analysisPanel: {
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
  actions: {
    gap: Spacing.two,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  buttonLabel: {
    fontWeight: '900',
  },
  primaryButtonLabel: {
    color: '#06130A',
  },
  pressed: {
    opacity: 0.78,
  },
});
