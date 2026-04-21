import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Services/firebaseConfig";
import { obtenerCreditosCanceladosOFinalizados } from "../Services/creditosService";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBankLogo } from "../Services/getBankLogo";
import BottomNavbar from "./BottomNavbar";



export default function HistorialScreen({ navigation }) {
    const [nombre, setNombre] = useState("");
    const [creditos, setCreditos] = useState([]);
    const [search, setSearch] = useState("");
    const [creditosFiltrados, setCreditosFiltrados] = useState([]);
    const [uid, SetUid] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const uid = await AsyncStorage.getItem("userUID");
            SetUid(uid);
            if (!uid) return;

            // Usuario
            const docRef = doc(db, "usuarios", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setNombre(docSnap.data().nombre);
            }

            // Créditos (SIN filtros extra)
            const listaCreditos = await obtenerCreditosCanceladosOFinalizados(uid);

            setCreditos(listaCreditos);
            setCreditosFiltrados(listaCreditos);

        } catch (error) {
            console.log(error);
        }
    };

    const filtrarCreditos = (texto) => {
        setSearch(texto);

        const filtrados = creditos.filter((item) =>
            item.entidad.toLowerCase().includes(texto.toLowerCase()) ||
            item.ciudad.toLowerCase().includes(texto.toLowerCase()) ||
            item.tipo_credito.toLowerCase().includes(texto.toLowerCase())
        );

        setCreditosFiltrados(filtrados);
    };

    const renderCredito = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate("CreditDetail", {
                    creditId: item.id,
                    uid: uid,
                })
            }
        >
            {/* Header */}
            <View style={styles.cardHeader}>
                <Image
                    source={{ uri: getBankLogo(item.entidad) }}
                    style={styles.logo}
                />
                <Text style={styles.bankName}>{item.entidad}</Text>
            </View>

            <View style={styles.divider} />

            {/* Body */}
            <View style={styles.cardBody}>
                <Text style={styles.cardText}>Ciudad: {item.ciudad}</Text>
                <Text style={styles.cardText}>Sede: {item.sucursal}</Text>
                <Text style={styles.cardText}>
                    Tipo de crédito: {item.tipo_credito}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    Historial de {nombre || "Usuario"} 📊
                </Text>
                <Text style={styles.subtitle}>
                    Consulta tus créditos registrados
                </Text>
            </View>

            {/* Buscador */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#888" />
                <TextInput
                    placeholder="Buscar en historial"
                    style={styles.input}
                    value={search}
                    onChangeText={filtrarCreditos}
                />
            </View>

            {/* Lista */}
            <FlatList
                data={creditosFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={renderCredito}
            />

            <BottomNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },

    header: {
        padding: 20,
        //marginTop: 30,
        marginBottom: 30,
        backgroundColor: "#09406A"
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#f5f5f5"
    },

    subtitle: {
        marginTop: 5,
        color: "#f5f5f5",
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 15,
        paddingHorizontal: 10,
        borderRadius: 20,
        elevation: 2,
    },

    input: {
        flex: 1,
        marginLeft: 8,
    },

    card: {
        backgroundColor: "#fff",
        margin: 15,
        borderRadius: 10,
        padding: 15,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    logo: {
        width: 50,
        height: 50,
        resizeMode: "contain",
        marginRight: 10,
    },

    bankName: {
        fontSize: 18,
        fontWeight: "bold",
    },

    cardBody: {
        marginTop: 10,
        gap: 6,
    },

    cardText: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
    bottomNav: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderColor: "#ccc",
    },

    navItem: {
        alignItems: "center",
    },

    navText: {
        fontSize: 12,
        color: "#666",
    },

    navTextActive: {
        fontSize: 12,
        color: "#000",
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#000",
        marginVertical: 10,
    },

});