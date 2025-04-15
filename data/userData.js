/* eslint-disable prettier/prettier */
const userData = {
  id: "user1",
  name: "Lalo",
  age: 28,
  height: 180,
  weightEntries: [
    { week: 1, date: "2024-12-23", weight: 90.0 },
    { week: 2, date: "2024-12-30", weight: 89.2 },
    { week: 3, date: "2025-01-06", weight: 88.7 },
    { week: 4, date: "2025-01-13", weight: 87.9 },
    { week: 5, date: "2025-01-20", weight: 87.2 },
    { week: 6, date: "2025-01-27", weight: 86.8 },
    { week: 7, date: "2025-02-05", weight: 86.0 },
    { week: 8, date: "2025-02-12", weight: 85.5 },
    { week: 9, date: "2025-02-24", weight: 85.1 },
    { week: 10, date: "2025-03-03", weight: 84.8 },
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
    {
      id: "workout3",
      name: "Leg Day",
      exercises: [
        { id: "ex9", name: "Squats", sets: 4, reps: 10 },
        { id: "ex10", name: "Leg Press", sets: 3, reps: 12 },
        { id: "ex11", name: "Lunges", sets: 3, reps: 12 },
        { id: "ex12", name: "Hamstring Curl", sets: 3, reps: 12 },
      ],
    },
    {
      id: "workout4",
      name: "Core Blast",
      exercises: [
        { id: "ex13", name: "Planks", sets: 3, reps: 60 },
        { id: "ex14", name: "Crunches", sets: 3, reps: 20 },
        { id: "ex15", name: "Leg Raises", sets: 3, reps: 15 },
        { id: "ex16", name: "Russian Twists", sets: 3, reps: 20 },
      ],
    },
    {
      id: "workout5",
      name: "Full Body Circuit",
      exercises: [
        { id: "ex17", name: "Burpees", sets: 3, reps: 15 },
        { id: "ex18", name: "Mountain Climbers", sets: 3, reps: 30 },
        { id: "ex19", name: "Jump Squats", sets: 3, reps: 12 },
        { id: "ex20", name: "Push-ups", sets: 3, reps: 20 },
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
  weeks: [
    "2024-12-23",
    "2024-12-30",
    "2025-01-06",
    "2025-01-13",
    "2025-01-20",
    "2025-01-27",
    "2025-02-05",
    "2025-02-12",
    "2025-02-24",
    "2025-03-03",
  ],
};

export default userData;
