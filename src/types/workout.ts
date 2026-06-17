export type ExerciseType = 'Back Squat' | 'Bench Press' | 'Deadlift' | 'Overhead Press' | 'Unknown';

export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'failed';

export interface WorkoutMetrics {
  reps: number;
  averageVelocity: number;
  peakVelocity: number;
}

export interface VideoMetadata {
  uri: string;
  durationSeconds?: number;
  recordedAt: string;
}

export interface Workout {
  id: string;
  date: string;
  exerciseType: ExerciseType | string;
  reps: number;
  averageVelocity: number;
  peakVelocity: number;
  videoUri: string;
  createdAt: Date;
  analysisStatus: AnalysisStatus;
}

export interface CreateWorkoutInput {
  exerciseType?: ExerciseType | string;
  video: VideoMetadata;
}
