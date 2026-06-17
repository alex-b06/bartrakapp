import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { CreateWorkoutInput, Workout } from '@/types/workout';

interface WorkoutContextValue {
  workouts: Workout[];
  addWorkout: (input: CreateWorkoutInput) => Workout;
  deleteWorkout: (workoutId: string) => void;
  getWorkoutById: (workoutId: string) => Workout | undefined;
  isSyncReady: boolean;
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

function createWorkoutId() {
  return `workout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatWorkoutDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const addWorkout = useCallback((input: CreateWorkoutInput) => {
    const createdAt = new Date(input.video.recordedAt);
    const workout: Workout = {
      id: createWorkoutId(),
      date: formatWorkoutDate(createdAt),
      exerciseType: input.exerciseType ?? 'Unknown',
      reps: 0,
      averageVelocity: 0,
      peakVelocity: 0,
      videoUri: input.video.uri,
      createdAt,
      analysisStatus: 'analyzing',
    };

    setWorkouts(currentWorkouts => [workout, ...currentWorkouts]);
    return workout;
  }, []);

  const deleteWorkout = useCallback((workoutId: string) => {
    setWorkouts(currentWorkouts => currentWorkouts.filter(workout => workout.id !== workoutId));
  }, []);

  const getWorkoutById = useCallback(
    (workoutId: string) => workouts.find(workout => workout.id === workoutId),
    [workouts],
  );

  const value = useMemo<WorkoutContextValue>(
    () => ({
      workouts,
      addWorkout,
      deleteWorkout,
      getWorkoutById,
      isSyncReady: false,
    }),
    [addWorkout, deleteWorkout, getWorkoutById, workouts],
  );

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

export function useWorkout() {
  const context = useContext(WorkoutContext);

  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }

  return context;
}
