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
    workoutSessions: [],
  };
  
  export default userData;
  