/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../app/(tabs)/index';

//mock del router de Expo 
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

//mock del contexto UserContext, devolviendo datos simulados
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
            { name: 'Chest Fly' }, //más de 3 ejercicios
          ],
        },
      ],
    },
    loading: false,
    deleteWorkout: jest.fn(),
  }),
}));

//Test 1: verifica que se muestra el mensaje de bienvenida con el nombre del usuario
it('muestra el mensaje de bienvenida con el nombre del usuario', () => {
    const { getByText } = render(<Home />);
    //busca el texto que contiene tanto "Welcome" como "Test User"
    expect(getByText(/welcome, test user/i)).toBeTruthy();
  });
  

//Test 2: comprueba que se renderiza la tarjeta del entrenamiento
it('muestra una tarjeta con el nombre del entrenamiento y ejercicios', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Push Day')).toBeTruthy();     
  expect(getByText('4 exercises')).toBeTruthy();       
});

//Test 3: verifica que se muestra "+1 more" si hay más de 3 ejercicios
it('muestra el texto "+1 more" cuando hay más de 3 ejercicios', () => {
  const { getByText } = render(<Home />);
  expect(getByText('+1 more')).toBeTruthy();            
});

//Test 4: comprueba que el botón "Add Workout" navega correctamente
it('navega a "/add-workout" al pulsar el botón', () => {
  const mockPush = jest.fn();

  //cuando el componente Home llame a useRouter(), en lugar de usar el router real, usará mockPush
  jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({ push: mockPush });

  const { getByText } = render(<Home />);
  fireEvent.press(getByText(/add workout/i)); //simula pulsar el botón

  expect(mockPush).toHaveBeenCalledWith('/add-workout'); //comprueba que se llamó a push con la ruta '/add-workout'
});