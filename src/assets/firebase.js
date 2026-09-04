// src/firebase.js
import { initializeApp }  from 'firebase/app'
import { getAuth }        from 'firebase/auth'
import { getFirestore }   from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "paste here",
  authDomain:        "paste here",
  projectId:         "paste here",
  storageBucket:     "paste here",
  messagingSenderId: "paste here",
  appId:             "paste here"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)