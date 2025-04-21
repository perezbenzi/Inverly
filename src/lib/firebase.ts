import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore'
import type { Investment } from '@/types/investment'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: 'G-QHNN9NQ2RD'
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Auth functions
export const registerUser = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const logoutUser = async () => {
  return signOut(auth)
}

export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Firestore functions
export const saveInvestmentToFirestore = async (investment: Investment, userId: string) => {
  const investmentsRef = collection(db, 'investments')
  const investmentData = {
    ...investment,
    userId,
    createdAt: new Date().toISOString(),
    ethAmount: Number(investment.ethAmount),
    amount: Number(investment.amount)
  }
  return addDoc(investmentsRef, investmentData)
}

export const updateInvestmentInFirestore = async (investment: Investment) => {
  const investmentRef = doc(db, 'investments', investment.id)
  const { id, ...investmentData } = investment
  return updateDoc(investmentRef, {
    ...investmentData,
    updatedAt: new Date().toISOString(),
    ethAmount: Number(investment.ethAmount),
    amount: Number(investment.amount)
  })
}

export const deleteInvestmentFromFirestore = async (investmentId: string) => {
  const investmentRef = doc(db, 'investments', investmentId)
  return deleteDoc(investmentRef)
}

export const getUserInvestments = async (userId: string) => {
  const investmentsRef = collection(db, 'investments')
  const q = query(investmentsRef, where('userId', '==', userId))
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Investment[]
} 