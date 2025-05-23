/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../app/(tabs)/index';

// Mock del router de Expo para interceptar navegación sin errores
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(), // Simula la función push de navegación
  }),
}));

// Mock del contexto UserContext, devolviendo datos simulados
jest.mock('../context/UserContext', () => ({
  useUser: () => ({
    user: {
      name: 'Test User',
      workouts: [
        {
          id: '1',
          name: 'Push Day',
          exercises: [
            { name: 'Bench Press' },
            { name: 'Shoulder Press' },
            { name: 'Triceps Dips' },
            { name: 'Chest Fly' }, // más de 3 ejercicios
          ],
        },
      ],
    },
    loading: false,
    deleteWorkout: jest.fn(),
  }),
}));

// Test 1: Verifica que se muestra el mensaje de bienvenida con el nombre del usuario
it('muestra el mensaje de bienvenida con el nombre del usuario', () => {
    const { getByText } = render(<Home />);
    // Busca el texto que contiene tanto "Welcome" como "Test User"
    expect(getByText(/welcome, test user/i)).toBeTruthy();
  });
  

// Test 2: Comprueba que se renderiza la tarjeta del entrenamiento
it('muestra una tarjeta con el nombre del entrenamiento y ejercicios', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Push Day')).toBeTruthy();           // Verifica el nombre del entrenamiento
  expect(getByText('4 exercises')).toBeTruthy();        // Verifica la cantidad total de ejercicios
});

// Test 3: Verifica que se muestra "+1 more" si hay más de 3 ejercicios
it('muestra el texto "+1 more" cuando hay más de 3 ejercicios', () => {
  const { getByText } = render(<Home />);
  expect(getByText('+1 more')).toBeTruthy();            // Verifica el mensaje adicional por ejercicios extra
});

// Test 4: Comprueba que el botón "Add Workout" navega correctamente
it('navega a "/add-workout" al pulsar el botón', () => {
  const mockPush = jest.fn(); // Función simulada para rastrear navegación

  // Sobrescribe el mock anterior con una versión espía
  jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({ push: mockPush });

  const { getByText } = render(<Home />);
  fireEvent.press(getByText(/add workout/i));           // Simula pulsar el botón

  expect(mockPush).toHaveBeenCalledWith('/add-workout'); // Comprueba que se llamó a push con la ruta esperada
});