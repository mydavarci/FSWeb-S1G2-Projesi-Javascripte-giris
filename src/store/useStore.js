import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // User Progress
      totalScore: 0,
      currentLevel: 1, // 1-10
      completedExercises: [], // Array of exercise IDs
      userStats: {
        totalExercisesCompleted: 0,
        perfectScores: 0,
        hintsUsed: 0,
        streak: 0,
        bestStreak: 0,
      },

      // Current Session
      currentTopic: 'javascript', // 'javascript' or 'react'
      currentExercise: null,
      currentCode: '',
      consoleOutput: [],
      apiKey: '',

      // Exercise Management
      exercisePool: {}, // { javascript: { level1: [], level2: [] }, react: { level1: [] } }
      currentExerciseIndex: 0,

      // Actions
      setApiKey: (key) => set({ apiKey: key }),

      setCurrentTopic: (topic) => set({ currentTopic: topic }),

      setCurrentCode: (code) => set({ currentCode: code }),

      addConsoleOutput: (output) => set((state) => ({
        consoleOutput: [...state.consoleOutput, {
          ...output,
          timestamp: new Date().toLocaleTimeString()
        }]
      })),

      clearConsole: () => set({ consoleOutput: [] }),

      setCurrentExercise: (exercise) => set({ currentExercise: exercise }),

      completeExercise: (exerciseId, score) => set((state) => {
        const newCompletedExercises = [...state.completedExercises, exerciseId];
        const isPerfect = score >= 90;
        const newStreak = state.userStats.streak + 1;

        return {
          completedExercises: newCompletedExercises,
          userStats: {
            ...state.userStats,
            totalExercisesCompleted: state.userStats.totalExercisesCompleted + 1,
            perfectScores: isPerfect ? state.userStats.perfectScores + 1 : state.userStats.perfectScores,
            streak: newStreak,
            bestStreak: Math.max(newStreak, state.userStats.bestStreak),
          }
        };
      }),

      addScore: (points) => set((state) => {
        const newScore = state.totalScore + points;
        // Level progression: every 100 points = +1 level (max 10)
        const newLevel = Math.min(10, Math.floor(newScore / 100) + 1);

        return {
          totalScore: newScore,
          currentLevel: newLevel
        };
      }),

      useHint: () => set((state) => ({
        totalScore: Math.max(0, state.totalScore - 2),
        userStats: {
          ...state.userStats,
          hintsUsed: state.userStats.hintsUsed + 1
        }
      })),

      resetStreak: () => set((state) => ({
        userStats: {
          ...state.userStats,
          streak: 0
        }
      })),

      // Exercise Pool Management
      addExerciseToPool: (topic, level, exercises) => set((state) => ({
        exercisePool: {
          ...state.exercisePool,
          [topic]: {
            ...state.exercisePool[topic],
            [level]: exercises
          }
        }
      })),

      getNextExercise: () => {
        const state = get();
        const { currentTopic, currentLevel, exercisePool, currentExerciseIndex } = state;
        const levelKey = `level${currentLevel}`;

        if (!exercisePool[currentTopic] || !exercisePool[currentTopic][levelKey]) {
          return null;
        }

        const exercises = exercisePool[currentTopic][levelKey];
        if (exercises.length === 0) return null;

        const nextIndex = currentExerciseIndex % exercises.length;
        set({ currentExerciseIndex: nextIndex + 1 });

        return exercises[nextIndex];
      },

      // Reset
      resetProgress: () => set({
        totalScore: 0,
        currentLevel: 1,
        completedExercises: [],
        userStats: {
          totalExercisesCompleted: 0,
          perfectScores: 0,
          hintsUsed: 0,
          streak: 0,
          bestStreak: 0,
        },
        currentExerciseIndex: 0,
      }),
    }),
    {
      name: 'ai-code-tutor-storage',
      partialize: (state) => ({
        totalScore: state.totalScore,
        currentLevel: state.currentLevel,
        completedExercises: state.completedExercises,
        userStats: state.userStats,
        apiKey: state.apiKey,
        exercisePool: state.exercisePool,
        currentTopic: state.currentTopic,
      }),
    }
  )
);

export default useStore;
