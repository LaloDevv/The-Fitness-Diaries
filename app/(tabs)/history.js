/* eslint-disable prettier/prettier */
import { Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function Preview() {
  const router = useRouter();
  const week = 1; // Replace with the actual week value or logic

  return (
    <View className="bg-green-500 flex-1 items-center">
      <Text>HISTORY</Text>
      <View onTouchEnd={() => router.push(`/history/week/${week}`)}>
        <Text>Ejemplo de navegacion a una semana en concreto, ahora no funciona.</Text>
      </View>
    </View>
    
  )
}