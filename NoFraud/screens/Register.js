import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
   View,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { registerUser } from "../Services/Register";
import LottieView from 'lottie-react-native';

export default function RegisterScreen({ navigation }) {

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaExpedicion: new Date()
  });

  const dominiosPermitidos = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com"
  ];

  const esDominioValido = (correo) => {
    const partes = correo.split("@");

    if (partes.length !== 2) return false;

    const dominio = partes[1].toLowerCase();

    return dominiosPermitidos.includes(dominio);
  };

  const esCorreoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const [showDate, setShowDate] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleNumeroDocumento = (text) => {
    // Solo números y máximo 10
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 10);
    handleChange("numeroDocumento", cleaned);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) {
      if (selectedDate > new Date()) {
        Alert.alert("Error", "La fecha no puede ser mayor a hoy");
        return;
      }
      handleChange("fechaExpedicion", selectedDate);
    }
  };

  const handleSubmit = async () => {
    // Validar campos vacíos
    if (!form.nombre || !form.correo || !form.password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    // Validar tipo de documento
    if (!form.tipoDocumento) {
      Alert.alert("Error", "Selecciona un tipo de documento");
      return;
    }

    // Validar número de documento
    if (form.numeroDocumento.length !== 10) {
      Alert.alert("Error", "El número de documento debe tener 10 dígitos");
      return;
    }

    // Validar fecha
    if (form.fechaExpedicion > new Date()) {
      Alert.alert("Error", "La fecha no puede ser futura");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!/[A-Z]/.test(form.password)) {
      Alert.alert("Error", "Debe contener al menos una letra mayúscula");
      return;
    }

    if (!/[0-9]/.test(form.password)) {
      Alert.alert("Error", "Debe contener al menos un número");
      return;
    }

    if (!/[^a-zA-Z0-9]/.test(form.password)) {
      Alert.alert("Error", "Debe contener un carácter especial (@, #, etc.)");
      return;
    }

    if (!esCorreoValido(form.correo)) {
      Alert.alert("Error", "El correo no tiene un formato válido");
      return;
    }

    if (!esDominioValido(form.correo)) {
      Alert.alert(
        "Error",
        "Dominio no permitido. Usa Gmail, Hotmail, Outlook o Yahoo"
      );
      return;
    }

    // 🔥 Activar animación
    setLoading(true);

    try {
      const result = await registerUser(form);

      if (result.success) {
        Alert.alert("Éxito", "Usuario registrado correctamente");

        // Opcional: limpiar formulario
        setForm({
          nombre: "",
          correo: "",
          password: "",
          tipoDocumento: "",
          numeroDocumento: "",
          fechaExpedicion: new Date()
        });

        // Opcional: navegar al login
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", result.error);
      }

    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema inesperado");
    }
    finally {
      // Apagar animación
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/*OVERLAY DE CARGA */}
      {loading && (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../assets/Sign up.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.loadingText}>Registrando usuario...</Text>
        </View>
      )}


      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Mateo"
          value={form.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
        />

        <Text style={styles.label}>Correo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Mateo@gmail.com"
          keyboardType="email-address"
          value={form.correo}
          onChangeText={(text) => handleChange("correo", text)}
        />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />

        <Text style={styles.label}>Tipo de documento:</Text>
        <Picker
          selectedValue={form.tipoDocumento}
          onValueChange={(value) => handleChange("tipoDocumento", value)}
          style={styles.input}
        >
          <Picker.Item label="Seleccione..." value="" />
          <Picker.Item label="Pasaporte" value="pasaporte" />
          <Picker.Item label="Cédula de ciudadanía" value="cc" />
          <Picker.Item label="Cédula de extranjería" value="ce" />
        </Picker>

        <Text style={styles.label}>Número de documento:</Text>
        <TextInput
          style={styles.input}
          placeholder="10 dígitos"
          keyboardType="numeric"
          value={form.numeroDocumento}
          onChangeText={handleNumeroDocumento}
        />

        <Text style={styles.label}>Fecha de expedición:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {form.fechaExpedicion.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={form.fechaExpedicion}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Ya tengo cuenta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center"
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#1f3c5b",
    fontWeight: "bold"
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center"
  },
  button: {
    backgroundColor: "#1f3c5b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#1f3c5b",
    textDecorationLine: "underline"
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontWeight: "bold"
  }
});