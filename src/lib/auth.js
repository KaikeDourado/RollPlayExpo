import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const authApi = {
    signUpEmail: (email, password) =>
        createUserWithEmailAndPassword(auth, email, password),

    signInEmail: (email, password) =>
        signInWithEmailAndPassword(auth, email, password),

    resetPassword: (email) => sendPasswordResetEmail(auth, email),

    signOut: () => signOut(auth),

    onChange: (cb) => onAuthStateChanged(auth, cb),

    getIdToken: async () => {
        const user = auth.currentUser;
        return user ? await user.getIdToken() : null;
    },
};