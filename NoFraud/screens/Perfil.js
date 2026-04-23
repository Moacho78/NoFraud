import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserData } from "../Services/Register";
import BottomNavbar from "./BottomNavbar";
import { cerrarSesion } from "../Services/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const PerfilScreen = () => {

    const [usuario, setUsuario] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const cargarUsuario = async () => {
            const response = await getUserData();

            if (response.success) {
                setUsuario(response.data);
            } else {
                console.log(response.error);
            }
        };

        cargarUsuario();
    }, []);

    const handleLogout = async () => {
        try {
            // 1️⃣ Cerrar sesión en Firebase
            const response = await cerrarSesion();

            if (!response.success) {
                console.log(response.error);
                return;
            }

            // 2️⃣ Limpiar AsyncStorage
            await AsyncStorage.clear();

            // 3️⃣ Navegar al login (reinicia el stack)
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });

        } catch (error) {
            console.log("Error al cerrar sesión:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Perfil</Text>
            </View>

            {/* Card usuario */}
            <View style={styles.card}>
                <Text style={styles.nombre}> {usuario?.nombre || "Cargando..."}</Text>
                <Text style={styles.info}> {usuario?.correo || "Cargando..."}</Text>
                <Text style={styles.info}>{usuario?.tipo_documento} {usuario?.numero_documento}</Text>
            </View>

            {/* Seguridad */}
            <Text style={styles.sectionTitle}>Seguridad</Text>

            <View style={styles.card}>

                <TouchableOpacity style={styles.option}>
                    <Text style={styles.optionText}>Cambiar contraseña</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option}>
                    <Text style={styles.optionText}>Política de privacidad</Text>
                    <Ionicons name="person-outline" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.option}>
                    <Text style={styles.optionText}>Términos y condiciones</Text>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>

            </View>

            {/* Botón cerrar sesión */}
            <TouchableOpacity style={styles.logoutButton}  onPress={handleLogout}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
            <BottomNavbar />
        </SafeAreaView>
    );
};

export default PerfilScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        justifyContent: "space-between",
    },
    header: {
        backgroundColor: "#0B3C5D",
        padding: 15,
        alignItems: "center",
    },
    headerText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    card: {
        backgroundColor: "#EDEDED",
        margin: 15,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    nombre: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    info: {
        textAlign: "center",
        color: "#555",
        marginTop: 2,
    },
    sectionTitle: {
        marginLeft: 15,
        marginTop: 5,
        fontSize: 16,
        fontWeight: "bold",
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    optionText: {
        fontSize: 14,
    },
    logoutButton: {
        backgroundColor: "#E53935",
        padding: 10,
        borderRadius: 8,
        alignSelf: "center",
        marginBottom: 10,
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
    },
    navbar: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    navItem: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        color: "#555",
    },
});