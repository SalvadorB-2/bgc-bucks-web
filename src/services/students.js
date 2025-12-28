// import { db } from "./firebase";
// import {
//   collection,
//   doc,
//   addDoc,
//   deleteDoc,
//   serverTimestamp,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";

// const studentsRef = collection(db, "students");

// export async function addStudent(fullName, grade) {
//   return await addDoc(studentsRef, {
//     fullName,
//     grade,
//     balance: 0,
//     school: "Washington Manor Middle School",
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp(),
//   });
// }

// export function subscribeToStudents(callback) {
//   const q = query(studentsRef, orderBy("fullName"));

//   return onSnapshot(q, (snapshot) => {
//     const students = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     callback(students);
//   });
// }

import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

/* =========================
   STUDENTS COLLECTION
========================= */

/**
 * Live subscription to all students for Washington Manor MS
 */
export function subscribeToStudents(setStudents) {
  const studentsRef = collection(db, "students");

  const q = query(
    studentsRef,
    where("school", "==", "Washington Manor Middle School")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(students);
  });

  return unsubscribe;
}

/**
 * Add a new student
 */
export async function addStudent(fullName, grade) {
  return await addDoc(collection(db, "students"), {
    fullName,
    grade,
    balance: 0,
    school: "Washington Manor Middle School",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Subscribe to a single student (Student Details page)
 */
export function subscribeToStudent(studentId, setStudent) {
  const studentRef = doc(db, "students", studentId);

  const unsubscribe = onSnapshot(studentRef, (docSnap) => {
    if (docSnap.exists()) {
      setStudent({ id: docSnap.id, ...docSnap.data() });
    } else {
      setStudent(null);
    }
  });

  return unsubscribe;
}

/**
 * Delete student (and implicitly their transactions subtree)
 */
export async function deleteStudent(studentId) {
  const studentRef = doc(db, "students", studentId);
  await deleteDoc(studentRef);
}
