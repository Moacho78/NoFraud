import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 👈 agregado
import { obtenerCreditoPorId } from "../Services/creditosService";
import { Ionicons } from "@expo/vector-icons";
import { getBankLogo } from "../Services/getBankLogo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNavbar from "./BottomNavbar";


export default function CreditDetailScreen({ route }) {
    const { creditId, uid } = route.params;

    const [credit, setCredit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarCredito = async () => {
            const data = await obtenerCreditoPorId(uid, creditId);
            setCredit(data);
            setLoading(false);
        };

        cargarCredito();
    }, []);

    const getStatusColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case "aprobado":
            case "al día":
                return "green";
            case "pendiente":
                return "orange";
            case "mora":
                return "red";
            default:
                return "#555";
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "";

        // Firestore Timestamp
        if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleDateString();
        }

        // Si ya es string o Date
        return new Date(timestamp).toLocaleDateString();
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0A3D62" />
            </View>
        );
    }

    if (!credit) {
        return (
            <View style={styles.loader}>
                <Text>No se encontró el crédito</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}> {/* 👈 envuelve todo */}
            <ScrollView style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Detalle del crédito</Text>
                </View>

                {/* CARD SUPERIOR */}
                <View style={styles.card}>
                    <Image
                        source={{ uri: getBankLogo(credit.entidad) }}
                        style={styles.logo}
                    />

                    <Text style={styles.bank}>{credit.entidad}</Text>

                    <Text style={styles.subtitle}>Estado del crédito</Text>

                    <View style={styles.statusRow}>
                        <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={getStatusColor(credit.estado)}
                        />
                        <Text
                            style={[
                                styles.statusText,
                                { color: getStatusColor(credit.estado) },
                            ]}
                        >
                            {credit.estado}
                        </Text>
                    </View>
                </View>

                {/* CARD DETALLE */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Monto del préstamo</Text>
                    <Text style={styles.amount}>
                        ${credit.monto?.toLocaleString()}
                    </Text>

                    <View style={styles.rowBetween}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="calendar-outline" size={18} color="#555" />
                            <View>
                                <Text style={styles.label}>Fecha de aprobación</Text>
                                <Text style={styles.value}>
                                    {formatDate(credit.fecha_apertura)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.rowBetween}>
                        <View style={styles.rowIcon}>
                            <MaterialCommunityIcons
                                name="cash"
                                size={18}
                                color="#555"
                            />
                            <View>
                                <Text style={styles.label}>Cuota Mensual</Text>
                                <Text style={styles.value}>
                                    ${credit.cuota?.toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.rowIcon}>
                            <Ionicons name="calendar" size={18} color="#555" />
                            <View>
                                <Text style={styles.label}>Próximo pago</Text>
                                <Text style={styles.value}>
                                    Sin fecha
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* CARD TASA */}
                <View style={styles.cardSmall}>
                    <View style={styles.rowIcon}>
                        <MaterialCommunityIcons name="percent" size={18} />
                        <Text style={styles.label}>Tasa de Interés</Text>
                    </View>
                    <Text style={styles.value}>{credit.tasa_interes}</Text>
                </View>
            </ScrollView>
              <BottomNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F4F7",
    },

    header: {
        backgroundColor: "#0A3D62",
        padding: 15,
        alignItems: "center",
    },

    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    card: {
        backgroundColor: "#fff",
        margin: 12,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },

    cardSmall: {
        backgroundColor: "#fff",
        marginHorizontal: 12,
        marginBottom: 20,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        width: 150,
        height: 150,
        resizeMode: "contain",
        marginBottom: 1,
    },

    bank: {
        fontSize: 18,
        fontWeight: "bold",
    },

    subtitle: {
        fontSize: 14,
        color: "#555",
        marginTop: 10,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",   // alinea verticalmente
        marginTop: 5,
    },

    statusText: {
        marginLeft: 5,
        fontWeight: "600",
    },

    sectionTitle: {
        fontSize: 13,
        color: "#666",
        alignSelf: "flex-start",
    },

    amount: {
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 5,
        alignSelf: "flex-start",
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },

    rowIcon: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    label: {
        fontSize: 12,
        color: "#777",
    },

    value: {
        fontSize: 14,
        fontWeight: "500",
    },

    divider: {
        height: 1,
        backgroundColor: "#ddd",
        width: "100%",
        marginVertical: 10,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    safe: {
        flex: 1,
        backgroundColor: "#F5F6FA", // opcional, pero recomendado
    },
});