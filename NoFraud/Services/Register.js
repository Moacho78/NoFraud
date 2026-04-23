import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import {
    doc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    getDoc
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const registerUser = async (form) => {
    try {
        // 🔍 1. Verificar si el correo ya existe en Firestore
        const correoQuery = query(
            collection(db, "usuarios"),
            where("correo", "==", form.correo)
        );

        const correoSnapshot = await getDocs(correoQuery);

        if (!correoSnapshot.empty) {
            return { success: false, error: "El correo ya está registrado" };
        }

        // 🔍 2. Verificar si el documento ya existe
        const docQuery = query(
            collection(db, "usuarios"),
            where("numeroDocumento", "==", form.numeroDocumento)
        );

        const docSnapshot = await getDocs(docQuery);

        if (!docSnapshot.empty) {
            return { success: false, error: "El número de documento ya está registrado" };
        }

        // 🔐 3. Crear usuario en Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            form.correo,
            form.password
        );

        const user = userCredential.user;

        // 💾 4. Guardar en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
            nombre: form.nombre,
            correo: form.correo,
            tipoDocumento: form.tipoDocumento,
            numeroDocumento: form.numeroDocumento,
            fechaExpedicion: form.fechaExpedicion,
            createdAt: new Date()
        });

        return { success: true };

    } catch (error) {
        console.log(error.message);

        // 🔥 Manejo específico de Firebase Auth
        if (error.code === "auth/email-already-in-use") {
            return { success: false, error: "El correo ya está registrado" };
        }

        return { success: false, error: error.message };
    }
};

// 📌 Obtener usuario por UID logueado
export const getUserData = async () => {
    try {
        const user = auth.currentUser;

        if (!user) {
            return { success: false, error: "No hay usuario autenticado" };
        }

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: false, error: "Usuario no encontrado" };
        }

    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
};

export const cerrarSesion = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
};