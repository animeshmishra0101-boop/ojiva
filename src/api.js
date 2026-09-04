import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

/* ───────────── AUTH ───────────── */

export async function signup(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // create the profile doc immediately so Dashboard has something to read
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email,
    dob: "",
    gender: "",
    blood: "",
    phone: "",
    ecName: "",
    ecRel: "",
    ecPhone: "",
    height: "",
    weight: "",
    abha: "",
    allergies: [],
    conditions: [],
  });
  return cred.user;
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  // create a profile doc on first Google login if one doesn't exist yet
  const ref = doc(db, "users", cred.user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: cred.user.displayName || "",
      email: cred.user.email || "",
      dob: "",
      gender: "",
      blood: "",
      phone: "",
      ecName: "",
      ecRel: "",
      ecPhone: "",
      height: "",
      weight: "",
      abha: "",
      allergies: [],
      conditions: [],
    });
  }
  return cred.user;
}

export function logout() {
  return signOut(auth);
}

/* ───────────── PROFILE ───────────── */

export async function getProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export function saveProfile(uid, data) {
  return updateDoc(doc(db, "users", uid), data);
}

/* ───────────── MEDICATIONS ─────────────
   stored at users/{uid}/medications/{docId} */

export function watchMedications(uid, callback) {
  const q = query(collection(db, "users", uid, "medications"), orderBy("time"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function addMedication(uid, med) {
  return addDoc(collection(db, "users", uid, "medications"), med);
}

export function deleteMedication(uid, medId) {
  return deleteDoc(doc(db, "users", uid, "medications", medId));
}

/* ───────────── HISTORY ─────────────
   stored at users/{uid}/history/{docId} */

export function watchHistory(uid, callback) {
  const q = query(collection(db, "users", uid, "history"), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function addHistory(uid, record) {
  return addDoc(collection(db, "users", uid, "history"), record);
}

export function deleteHistory(uid, recordId) {
  return deleteDoc(doc(db, "users", uid, "history", recordId));
}
