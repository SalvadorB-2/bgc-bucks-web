import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const studentsRef = collection(db, "students");

export async function addStudent(fullName, grade) {
  return await addDoc(studentsRef, {
    fullName,
    grade,
    balance: 0,
    school: "Washington Manor Middle School",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToStudents(callback) {
  const q = query(studentsRef, orderBy("fullName"));

  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(students);
  });
}
