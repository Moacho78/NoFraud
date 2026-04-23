import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { recuperarContrasena } from "../Services/Register";



const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Ingresa un correo");
            return;
        }

        try {
            await recuperarContrasena(email);
            Alert.alert("Éxito", "Se envió el correo de recuperación");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Logo */}
                <Image
                    source={require("../assets/Logo NoFraud.jpeg")} 
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Título */}
                <Text style={styles.title}>Olvidé mi Contraseña</Text>

                {/* Input */}
                <Text style={styles.label}>Correo:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="correo@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                {/* Botones */}
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleResetPassword}
                    >
                        <Text style={styles.buttonText}>Enviar código</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    logo: {
        width: 300,
        height: 300,
        alignSelf: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cancel: {
        color: "#555",
    },
    button: {
        backgroundColor: "#0A2E5C",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});