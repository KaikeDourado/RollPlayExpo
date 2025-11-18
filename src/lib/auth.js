import { app, auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  getIdTokenResult
} from 'firebase/auth';

export const authApi = {
  async signInEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login bem-sucedido:', result.user.email);
      return result;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut(auth);
      console.log('Logout bem-sucedido');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },

  async getIdToken(forceRefresh = false) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Nenhum usuário autenticado');
      }
      
      const token = await user.getIdToken(forceRefresh);
      const tokenResult = await getIdTokenResult(user, forceRefresh);
      
      const now = new Date();
      const expirationTime = new Date(tokenResult.expirationTime);
      
      console.log('Token válido até:', expirationTime);
      
      // Se o token está expirado
      if (now >= expirationTime) {
        console.warn('Token expirado, realizando logout automático');
        await signOut(auth);
        throw new Error('Token expirado');
      }
      
      return token;
    } catch (error) {
      console.error('Erro ao obter token:', error);
      if (error.message.includes('expirado')) {
        await signOut(auth);
      }
      throw error;
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  getAuth() {
    return auth;
  }
};

export default authApi;