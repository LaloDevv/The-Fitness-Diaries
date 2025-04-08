/* eslint-disable prettier/prettier */
import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'


export default function Preview() {
  return (
    <SafeAreaView className="bg-green-500 flex-1 items-center">
      <Text>Open up App.js to start working on your app!</Text>
      <Link href="/otherPage" className="bg-blue-500 p-4 rounded-full">
        Ir a otra pagina
      </Link>
    </SafeAreaView>

  )
}