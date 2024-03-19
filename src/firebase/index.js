// --- Firebase ---
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import firebaseConfig from './config'

// Initialize Firebase.
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service.
const db = getFirestore(app)

const auth = getAuth()

export { db, auth }
