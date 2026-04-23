import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import CargaMasivaFirestore from "../Services/CargaMasivaFirestore";
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // 🔹 Solo usamos esto para mostrar el indicador inicial (sin redirección automática)
  useEffect(() => {
    setInitializing(false);
  }, []);

  //const loader = new CargaMasivaFirestore();

  // 🔥 Cargar 500 usuarios con créditos
  //loader.cargarDatosMasivos(1);

  // 🔹 Validar formato de email
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 🔹 Función de inicio de sesión con Firebase
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);
    try {
      // Iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Obtener el UID del usuario autenticado
      const uid = userCredential.user.uid;

      // Guardar UID en AsyncStorage
      await AsyncStorage.setItem('userUID', uid);

      Alert.alert('Login exitoso', 'Bienvenido');
      navigation.navigate('Home');


    } catch (error) {
      let message = '';
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No existe ninguna cuenta con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido.';
          break;
        default:
          message = 'Error al iniciar sesión. Intenta de nuevo.';
      }
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2E7DFF" />
        <Text style={{ marginTop: 10, color: '#2E7DFF' }}>Verificando sesión...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require("../assets/Logo NoFraud.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />


        {/* Input Correo */}
        <Text style={styles.label}>Correo:</Text>
        <TextInput
          placeholder="Am0123@gmail.com"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Input Contraseña */}
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          placeholder="********"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#A9A9A9"
          />
        </TouchableOpacity>

        {/* Botón */}
        <TouchableOpacity style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* Link */}
        <TouchableOpacity onPress={() => navigation.navigate("Recuperar")}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    justifyContent: "center",
    width: 220,
    height: 220,
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 14,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#0A3D62",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#1B4F72",
    fontSize: 13,
  },
});