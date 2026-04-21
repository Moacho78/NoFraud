import { collection, getDocs, doc, getDoc ,query, where} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const obtenerCreditos = async (uid) => {
  try {
    const creditosRef = collection(db, "usuarios", uid, "creditos");
    const querySnapshot = await getDocs(creditosRef);

    const creditos = [];

    querySnapshot.forEach((doc) => {
      creditos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return creditos;
  } catch (error) {
    console.log("Error obteniendo créditos:", error);
    return [];
  }
};


export const obtenerCreditoPorId = async (uid, creditId) => {
  try {
    const creditRef = doc(db, "usuarios", uid, "creditos", creditId);
    const creditSnap = await getDoc(creditRef);

    if (creditSnap.exists()) {
      return {
        id: creditSnap.id,
        ...creditSnap.data(),
      };
    } else {
      console.log("El crédito no existe");
      return null;
    }
  } catch (error) {
    console.log("Error obteniendo crédito:", error);
    return null;
  }
};

export const obtenerCreditosCanceladosOFinalizados = async (uid) => {
  try {
    const creditosRef = collection(db, "usuarios", uid, "creditos");

    const q = query(
      creditosRef,
      where("estado", "in", ["cancelado", "finalizado"])
    );

    const querySnapshot = await getDocs(q);

    const resultados = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return resultados;
  } catch (error) {
    console.log("Error obteniendo créditos:", error);
    return [];
  }
};