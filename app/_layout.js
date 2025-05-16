/* eslint-disable prettier/prettier */
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "../context/UserContext";
import { View } from "react-native";
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from "../context/AuthContext";
import { uploadUserData } from "../scripts/uploadUserData";


const queryClient = new QueryClient();

export default function Layout() {
  /*
  useEffect(() => {
    uploadUserData(); // ⚠️ Ejecutar solo una vez. Elimina después.
  }, []);
  */

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
          <UserProvider>
            <View className="flex-1 bg-fitness-darkBackground">
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }} />
              <Toast />
            </View>
          </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
  
}
