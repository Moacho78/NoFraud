import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PerfilScreen = () => {
    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Perfil</Text>
            </View>

            {/* Card usuario */}
            <View style={styles.card}>
                <Text style={styles.nombre}>Carlos Mendoza</Text>
                <Text style={styles.info}>andreavcp@hotmail.com</Text>
                <Text style={styles.info}>C.C 1097781744</Text>
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
            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>

            {/* Navbar (puedes reemplazarlo por tu componente) */}
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home-outline" size={22} color="#555" />
                    <Text style={styles.navText}>Inicio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="time-outline" size={22} color="#555" />
                    <Text style={styles.navText}>Historial</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person" size={22} color="#0A84FF" />
                    <Text style={[styles.navText, { color: "#0A84FF" }]}>Perfil</Text>
                </TouchableOpacity>
            </View>

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