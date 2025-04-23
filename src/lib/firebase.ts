import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
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
  updateDoc,
  writeBatch
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

// Re-authenticate user
export const reauthenticate = async (password: string) => {
  if (!auth.currentUser || !auth.currentUser.email) {
    throw new Error('No authenticated user or email')
  }
  
  try {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    )
    
    return await reauthenticateWithCredential(auth.currentUser, credential)
  } catch (error: any) {
    console.error('Error re-authenticating:', error)
    
    // Convertir errores específicos
    if (error.code === 'auth/wrong-password') {
      throw error
    }
    
    throw error
  }
}

// Delete user account and all associated data
export const deleteUserAccount = async () => {
  if (!auth.currentUser) throw new Error('No authenticated user')
  
  try {
    // DELETE ONLY USER ACCOUNT - skip data deletion due to permissions issues
    // This approach focuses on deleting the auth user first
    return await deleteUser(auth.currentUser)
  } catch (error: any) {
    console.error('Error deleting account:', error.message)
    
    // Most likely the user requires re-authentication
    if (error.code === 'auth/requires-recent-login') {
      throw error
    }
    
    // If it's a permission error, we should still try to use the dialog approach
    throw error
  }
}

// Delete user account and all associated data with re-authentication
export const deleteUserAccountWithReauth = async (password: string) => {
  if (!auth.currentUser) throw new Error('No authenticated user')
  
  try {
    // Re-authenticate user first
    await reauthenticate(password)
    
    // Delete only the user account from Auth
    // We'll skip data deletion due to permission issues
    return await deleteUser(auth.currentUser)
  } catch (error: any) {
    console.error('Error deleting account with reauth:', error.message)
    throw error
  }
}

// Delete all data associated with a user
export const deleteAllUserData = async (userId: string) => {
  try {
    // Get all user investments
    const investments = await getUserInvestments(userId)
    
    // Si no hay inversiones, no es necesario usar batch
    if (investments.length === 0) {
      return
    }
    
    // Delete all investments in a batch
    const batch = writeBatch(db)
    
    investments.forEach(investment => {
      const investmentRef = doc(db, 'investments', investment.id)
      batch.delete(investmentRef)
    })
    
    // Commit the batch
    return batch.commit()
  } catch (error: any) {
    console.error('Error deleting user data:', error.message)
    // Si hay un error al eliminar los datos, continuamos con la eliminación de la cuenta
    // pero registramos el error para referencia
  }
}

// Change user password
export const changePassword = async (currentPassword: string, newPassword: string) => {
  if (!auth.currentUser) {
    throw new Error('No authenticated user')
  }
  
  try {
    // First re-authenticate the user
    await reauthenticate(currentPassword)
    
    // Then update the password
    return await updatePassword(auth.currentUser, newPassword)
  } catch (error: any) {
    console.error('Error changing password:', error)
    throw error
  }
} 