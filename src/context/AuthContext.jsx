import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authApi } from '../lib/auth';

const AuthCtx = createContext({ user: null, loading: true });

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenCheckIntervalRef = useRef(null);

  // Função para verificar se o token está expirado
  const checkTokenValidity = useCallback(async () => {
    try {
      if (authApi.getCurrentUser()) {
        await authApi.getIdToken(false);
      }
    } catch (error) {
      console.warn('Token expirado ou inválido:', error.message);
      try {
        await authApi.signOut();
        setUser(null);
      } catch (signOutError) {
        console.error('Erro ao fazer logout:', signOutError);
        setUser(null);
      }
    }
  }, []);

  // Verificar token a cada 5 minutos
  useEffect(() => {
    if (user) {
      // Verifica imediatamente
      checkTokenValidity();

      // E depois a cada 5 minutos
      tokenCheckIntervalRef.current = setInterval(() => {
        checkTokenValidity();
      }, 5 * 60 * 1000); // 5 minutos
    }

    return () => {
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
      }
    };
  }, [user, checkTokenValidity]);

  useEffect(() => {
    const unsubscribe = authApi.onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          // Verifica se o token ainda é válido
          try {
            await authApi.getIdToken(false);
            setUser(currentUser);
          } catch (error) {
            // Token expirado, fazer logout
            console.warn('Token expirado na inicialização, fazendo logout');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar estado de autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
      }
    };
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const result = await authApi.signInEmail(credentials.email, credentials.password);
      setUser(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
      }
      await authApi.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setUser(null);
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}