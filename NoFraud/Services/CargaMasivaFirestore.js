// CargaMasivaFirestore.js

import {
    collection,
    doc,
    writeBatch,
    getDocs
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig"; // auth importado
import { createUserWithEmailAndPassword } from "firebase/auth";

export default class CargaMasivaFirestore {

    sucursalesPorCiudad = {
        Bogotá: ["Chapinero", "Usaquén", "Suba", "Kennedy", "Centro", "Zona Rosa"],
        Medellín: ["El Poblado", "Laureles", "Bello", "Envigado", "Centro"],
        Cali: ["Ciudad Jardín", "San Fernando", "Norte", "Centro"],
        Barranquilla: ["Centro", "Alto Prado", "Riomar"],
        Cartagena: ["Bocagrande", "Centro", "Manga"],
        Bucaramanga: ["Cabecera", "Centro", "Cañaveral"],
        Pereira: ["Centro", "Cuba"],
        Manizales: ["Centro", "Cable Plaza"],
        "Santa Marta": ["Centro", "Rodadero"],
        Cúcuta: ["Centro", "La Libertad"],
        Ibagué: ["Centro", "El Salado"],
        Villavicencio: ["Centro", "La Grama"]
    };

    nombres = [
        "Sofía", "Valentina", "Isabella", "Camila", "María José",
        "Mateo", "Santiago", "Sebastián", "Alejandro", "Daniel",
        "Lucas", "Martín", "David", "Juan Pablo", "Miguel"
    ];

    dominiosConfiables = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

    constructor() {
        this.correosUsados = new Set();
        this.documentosUsados = new Set();
    }

    // 🔹 Generar usuario único
    generarUsuario(index) {
        let correo, documento;

        do {
            const dominio = this.dominiosConfiables[Math.floor(Math.random() * this.dominiosConfiables.length)];
            correo = `usuario${index}_${Math.floor(Math.random() * 10000)}@${dominio}`;
        } while (this.correosUsados.has(correo));

        this.correosUsados.add(correo);

        do {
            documento = `${100000000 + Math.floor(Math.random() * 900000000)}`;
        } while (this.documentosUsados.has(documento));

        this.documentosUsados.add(documento);

        // Elegir nombre aleatorio
        const nombre = this.nombres[Math.floor(Math.random() * this.nombres.length)];

        return {
            userId: documento,
            nombre,
            correo,
            tipo_documento: "CC",
            fecha_expedicion: new Date(2010, 1, 1),
            numero_documento: documento,
            password: "NoFraud746*"
        };
    }

    obtenerSucursal(ciudad) {
        const sucursales = this.sucursalesPorCiudad[ciudad];
        if (!sucursales || sucursales.length === 0) {
            return "Principal";
        }
        return sucursales[Math.floor(Math.random() * sucursales.length)];
    }

    generarCreditos() {
        const estados = ["Solicitado", "En tramite", "activo", "pagado", "mora"];

        const entidades = [
            "Bancolombia", "Davivienda", "BBVA", "Banco de Bogotá", "Banco de Occidente",
            "Banco AV Villas", "Banco Popular", "Banco Agrario de Colombia",
            "Banco Caja Social", "Banco Pichincha", "Itaú", "Scotiabank Colpatria"
        ];

        const tiposCredito = [
            "Libre inversión",
            "Vivienda",
            "Vehículo",
            "Educativo",
            "Consumo",
            "Microcrédito",
            "Turismo",
            "Hipotecario"
        ];

        const ciudades = Object.keys(this.sucursalesPorCiudad);
        const ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
        const sucursal = this.obtenerSucursal(ciudad);

        return Array.from({ length: 2 + Math.floor(Math.random() * 2) }).map(() => ({
            tipo_credito: tiposCredito[Math.floor(Math.random() * tiposCredito.length)],
            entidad: entidades[Math.floor(Math.random() * entidades.length)],
            ciudad,
            sucursal,
            estado: estados[Math.floor(Math.random() * estados.length)],
            fecha_apertura: new Date(2020, 1, 1),
            monto: Math.floor(Math.random() * 10000000),
            cuota: Math.floor(Math.random() * 500000),
            tasa_interes: (Math.random() * 20).toFixed(2)
        }));
    }

    async cargarExistentes() {
        const snapshot = await getDocs(collection(db, "usuarios"));
        snapshot.forEach((doc) => {
            const data = doc.data();
            this.correosUsados.add(data.correo);
            this.documentosUsados.add(data.numero_documento);
        });
        console.log("Datos existentes cargados");
    }

    // 🔥 Método principal
    async cargarDatosMasivos(totalUsuarios = 500) {
        try {
            await this.cargarExistentes();

            const chunkSize = 100; // Mejor usar chunks más pequeños para auth

            for (let i = 0; i < totalUsuarios; i += chunkSize) {
                const batch = writeBatch(db);
                const limite = Math.min(i + chunkSize, totalUsuarios);

                for (let j = i; j < limite; j++) {
                    const usuario = this.generarUsuario(j);

                    // 📌 Registrar en Firebase Authentication
                    let uid;
                    try {
                        const userCredential = await createUserWithEmailAndPassword(
                            auth,
                            usuario.correo,
                            usuario.password
                        );
                        uid = userCredential.user.uid;
                    } catch (error) {
                        console.warn(`No se pudo crear el usuario ${usuario.correo}:`, error.message);
                        continue; // Saltar si el correo ya existe
                    }

                    // 📌 Documento usuario Firestore
                    const userRef = doc(db, "usuarios", uid);
                    batch.set(userRef, {
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        tipo_documento: usuario.tipo_documento,
                        fecha_expedicion: usuario.fecha_expedicion,
                        numero_documento: usuario.numero_documento
                    });

                    // 📌 Subcolección créditos
                    const creditos = this.generarCreditos();
                    creditos.forEach((credito) => {
                        const creditoRef = doc(collection(userRef, "creditos"));
                        batch.set(creditoRef, credito);
                    });
                }

                await batch.commit();
                console.log(`Bloque ${i / chunkSize + 1} cargado`);
            }

            console.log("🔥 Carga masiva completada");
        } catch (error) {
            console.error("Error en carga masiva:", error);
        }
    }
}