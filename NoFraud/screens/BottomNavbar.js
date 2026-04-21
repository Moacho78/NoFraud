import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const BottomNavbar = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const tabs = [
        { name: "Inicio", icon: "home-outline", route: "Home" },
        { name: "Historial", icon: "time-outline", route: "Historial" },
        { name: "Perfil", icon: "person-outline", route: "Perfil" },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab, index) => {
                const isActive = route.name === tab.route;

                return (
                    <TouchableOpacity
                        key={index}
                        style={styles.tab}
                        onPress={() => navigation.navigate(tab.route)}
                    >
                        <Ionicons
                            name={isActive ? tab.icon.replace("-outline", "") : tab.icon}
                            size={24}
                            color={isActive ? "#2F80ED" : "#9E9E9E"}
                        />
                        <Text style={[styles.text, isActive && styles.activeText]}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default BottomNavbar;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 70,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    tab: {
        alignItems: "center",
    },
    text: {
        fontSize: 12,
        color: "#9E9E9E",
        marginTop: 4,
    },
    activeText: {
        color: "#2F80ED",
        fontWeight: "bold",
    },
});