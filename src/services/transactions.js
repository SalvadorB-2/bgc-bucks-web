import { db } from "./firebase";
import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

export function subscribeToTransactions(studentId, callback) {
  const transactionsRef = collection(db, "students", studentId, "transactions");

  const unsubscribe = onSnapshot(transactionsRef, (snapshot) => {
    const txs = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    callback(txs);
  });

  return unsubscribe;
}

export async function addDeposit(studentId, amount) {
  if (amount <= 0) throw new Error("Deposit amount must be positive");

  const studentRef = doc(db, "students", studentId);
  const transactionsRef = collection(studentRef, "transactions");

  await runTransaction(db, async (transaction) => {
    const studentDoc = await transaction.get(studentRef);
    if (!studentDoc.exists()) throw "Student does not exist";

    const newBalance = (studentDoc.data().balance || 0) + amount;

    // Update student balance
    transaction.update(studentRef, {
      balance: newBalance,
      updatedAt: serverTimestamp(),
    });

    // Add transaction record
    transaction.set(doc(transactionsRef), {
      type: "deposit",
      amount,
      createdAt: serverTimestamp(),
    });
  });
}

export async function addWithdrawal(studentId, amount, category) {
  if (amount <= 0) throw new Error("Withdraw amount must be positive");

  const studentRef = doc(db, "students", studentId);
  const transactionsRef = collection(studentRef, "transactions");

  await runTransaction(db, async (transaction) => {
    const studentDoc = await transaction.get(studentRef);
    if (!studentDoc.exists()) throw "Student does not exist";

    const currentBalance = studentDoc.data().balance || 0;
    if (amount > currentBalance) throw "Insufficient balance";

    const newBalance = currentBalance - amount;

    // Update student balance
    transaction.update(studentRef, {
      balance: newBalance,
      updatedAt: serverTimestamp(),
    });

    // Add transaction record
    transaction.set(doc(transactionsRef), {
      type: "withdraw",
      amount,
      category,
      createdAt: serverTimestamp(),
    });
  });
}
