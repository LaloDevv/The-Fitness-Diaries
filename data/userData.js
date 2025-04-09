/* eslint-disable prettier/prettier */
const userData = {
    id: "user1",
    name: "Alex Johnson",
    age: 28,
    height: 180,
    weightEntries: [
      { week: 1, date: "2025-03-01", weight: 85.5 },
      { week: 2, date: "2025-03-08", weight: 84.8 },
      { week: 3, date: "2025-03-15", weight: 84.2 },
      { week: 4, date: "2025-03-22", weight: 83.9 },
      { week: 5, date: "2025-03-29", weight: 83.5 },
    ],
    workouts: [
      {
        id: "workout1",
        name: "Push Day",
        exercises: [
          { id: "ex1", name: "Bench Press", sets: 4, reps: 8 },
          { id: "ex2", name: "Shoulder Press", sets: 3, reps: 10 },
          { id: "ex3", name: "Tricep Pushdown", sets: 3, reps: 12 },
          { id: "ex4", name: "Chest Flyes", sets: 3, reps: 12 },
        ],
      },
      {
        id: "workout2",
        name: "Pull Day",
        exercises: [
          { id: "ex5", name: "Deadlift", sets: 4, reps: 6 },
          { id: "ex6", name: "Pull-ups", sets: 3, reps: 8 },
          { id: "ex7", name: "Barbell Rows", sets: 3, reps: 10 },
          { id: "ex8", name: "Bicep Curls", sets: 3, reps: 12 },
        ],
      },
    ],
    workoutSessions: [
      {
        id: "session1",
        weekNumber: 1,
        date: "2025-03-02",
        exercises: [
          {
            exerciseId: "ex1",
            name: "Bench Press",
            sets: [
              { id: "set1", weight: 80, reps: 8, completed: true },
              { id: "set2", weight: 80, reps: 8, completed: true },
              { id: "set3", weight: 75, reps: 7, completed: true },
              { id: "set4", weight: 75, reps: 6, completed: true },
            ],
          },
          {
            exerciseId: "ex2",
            name: "Shoulder Press",
            sets: [
              { id: "set5", weight: 50, reps: 10, completed: true },
              { id: "set6", weight: 50, reps: 8, completed: true },
              { id: "set7", weight: 45, reps: 8, completed: true },
            ],
          },
          {
            exerciseId: "ex3",
            name: "Tricep Pushdown",
            sets: [
              { id: "set8", weight: 30, reps: 12, completed: true },
              { id: "set9", weight: 30, reps: 10, completed: true },
              { id: "set10", weight: 25, reps: 12, completed: true },
            ],
          },
        ],
      },
      {
        id: "session2",
        weekNumber: 1,
        date: "2025-03-04",
        exercises: [
          {
            exerciseId: "ex5",
            name: "Deadlift",
            sets: [
              { id: "set11", weight: 120, reps: 6, completed: true },
              { id: "set12", weight: 120, reps: 6, completed: true },
              { id: "set13", weight: 110, reps: 6, completed: true },
              { id: "set14", weight: 110, reps: 5, completed: true },
            ],
          },
          {
            exerciseId: "ex6",
            name: "Pull-ups",
            sets: [
              { id: "set15", weight: 0, reps: 8, completed: true },
              { id: "set16", weight: 0, reps: 7, completed: true },
              { id: "set17", weight: 0, reps: 6, completed: true },
            ],
          },
        ],
      },
      {
        id: "session3",
        weekNumber: 2,
        date: "2025-03-09",
        exercises: [
          {
            exerciseId: "ex1",
            name: "Bench Press",
            sets: [
              { id: "set18", weight: 85, reps: 8, completed: true },
              { id: "set19", weight: 85, reps: 7, completed: true },
              { id: "set20", weight: 80, reps: 8, completed: true },
              { id: "set21", weight: 80, reps: 6, completed: true },
            ],
          },
          {
            exerciseId: "ex2",
            name: "Shoulder Press",
            sets: [
              { id: "set22", weight: 55, reps: 9, completed: true },
              { id: "set23", weight: 55, reps: 8, completed: true },
              { id: "set24", weight: 50, reps: 9, completed: true },
            ],
          },
        ],
      },
    ],
  };
  
  export default userData;
  