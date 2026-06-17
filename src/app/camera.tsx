import { CameraView, useCameraPermissions, useMicrophonePermissions, type CameraView as CameraViewType } from 'expo-camera';
import { router, useIsFocused, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InstructionModal } from '@/components/InstructionModal';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useWorkout } from '@/context/workout-context';
import { useTheme } from '@/hooks/use-theme';

let hasSeenCameraInstructions = false;

export default function CameraScreen() {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraViewType>(null);
  const { addWorkout } = useWorkout();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparingRecording, setIsPreparingRecording] = useState(false);
  const [showInstructions, setShowInstructions] = useState(!hasSeenCameraInstructions);

  const hasPermission = cameraPermission?.granted && microphonePermission?.granted;
  const permissionsLoaded = Boolean(cameraPermission && microphonePermission);

  async function requestPermissions() {
    setErrorMessage(null);
    const [nextCameraPermission, nextMicrophonePermission] = await Promise.all([
      requestCameraPermission(),
      requestMicrophonePermission(),
    ]);

    if (!nextCameraPermission.granted || !nextMicrophonePermission.granted) {
      setErrorMessage('Camera and microphone access are required to record workout sets.');
    }
  }

  async function startRecording() {
    if (!cameraRef.current || isRecording || isPreparingRecording) {
      return;
    }

    setErrorMessage(null);
    setIsPreparingRecording(true);
    setIsRecording(true);

    try {
      const recordedVideo = await cameraRef.current.recordAsync({
        maxDuration: 120,
      });

      if (!recordedVideo?.uri) {
        throw new Error('Recording did not return a video URI.');
      }

      const recordedAt = new Date().toISOString();
      const workout = addWorkout({
        exerciseType: 'Unknown',
        video: {
          uri: recordedVideo.uri,
          recordedAt,
        },
      });

      const resultsRoute = {
        pathname: '/results',
        params: {
          timestamp: recordedAt,
          videoUri: recordedVideo.uri,
          workoutId: workout.id,
        },
      } as unknown as Href;

      router.push(resultsRoute);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save recording.');
    } finally {
      setIsPreparingRecording(false);
      setIsRecording(false);
    }
  }

  function stopRecording() {
    cameraRef.current?.stopRecording();
  }

  function closeInstructions() {
    hasSeenCameraInstructions = true;
    setShowInstructions(false);
  }

  if (!permissionsLoaded) {
    return (
      <CenteredState title="Loading camera permissions" message="Preparing the recording surface..." />
    );
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.permissionContainer}>
          <CenteredState
            title="Camera access needed"
            message="BarTrak needs camera and microphone permission to record workout videos."
          />
          {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}
          <Pressable
            accessibilityRole="button"
            onPress={requestPermissions}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <ThemedText style={styles.primaryButtonLabel}>Grant Access</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Track Workout</ThemedText>
          <ThemedText themeColor="textSecondary">
            Record a set with the full body and barbell visible in frame.
          </ThemedText>
        </View>

        <View style={styles.cameraShell}>
          <CameraView
            ref={cameraRef}
            active={isFocused}
            facing="back"
            mode="video"
            mute={false}
            style={styles.camera}
          />
          <View style={styles.cameraOverlay}>
            <View style={styles.frameGuide} />
          </View>
        </View>

        {errorMessage ? <ThemedText style={styles.errorText}>{errorMessage}</ThemedText> : null}

        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            onPress={isRecording ? stopRecording : startRecording}
            style={({ pressed }) => [
              styles.recordButton,
              isRecording && styles.stopButton,
              pressed && styles.pressed,
            ]}>
            {isPreparingRecording && !isRecording ? (
              <ActivityIndicator color="#06130A" />
            ) : (
              <>
                <SymbolView
                  name={isRecording ? 'stop.fill' : 'record.circle'}
                  tintColor={isRecording ? '#FFFFFF' : '#06130A'}
                  size={24}
                />
                <ThemedText style={[styles.recordLabel, isRecording && styles.stopLabel]}>
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </ThemedText>
              </>
            )}
          </Pressable>
        </View>
      </View>

      <InstructionModal
        body="Place the phone so your full body and barbell are visible. Keep the camera steady and leave room around the bar path for future movement analysis."
        onClose={closeInstructions}
        title="Set up your camera"
        visible={showInstructions}
      />
    </SafeAreaView>
  );
}

function CenteredState({ message, title }: { message: string; title: string }) {
  return (
    <View style={styles.centeredState}>
      <ActivityIndicator color="#22C55E" />
      <ThemedText style={styles.centeredTitle}>{title}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.centeredMessage}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    alignSelf: 'center',
    flex: 1,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
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
  cameraShell: {
    backgroundColor: '#111827',
    borderRadius: 8,
    flex: 1,
    minHeight: 420,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  frameGuide: {
    borderColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 8,
    borderWidth: 2,
    height: '86%',
    width: '74%',
  },
  controls: {
    alignItems: 'center',
  },
  recordButton: {
    alignItems: 'center',
    backgroundColor: '#22C55E',
    borderRadius: 8,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: Spacing.four,
    width: '100%',
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
  recordLabel: {
    color: '#06130A',
    fontWeight: '900',
  },
  stopLabel: {
    color: '#FFFFFF',
  },
  permissionContainer: {
    alignSelf: 'center',
    flex: 1,
    gap: Spacing.three,
    justifyContent: 'center',
    maxWidth: 440,
    padding: Spacing.four,
    width: '100%',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#22C55E',
    borderRadius: 8,
    minHeight: 52,
    justifyContent: 'center',
  },
  primaryButtonLabel: {
    color: '#06130A',
    fontWeight: '900',
  },
  centeredState: {
    alignItems: 'center',
    gap: Spacing.two,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  centeredTitle: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    textAlign: 'center',
  },
  centeredMessage: {
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontWeight: '800',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
});
