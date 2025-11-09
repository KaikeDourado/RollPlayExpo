import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../lib/auth';

const AuthCtx = createContext({ user: null, loading: true });

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsub = authApi.onChange((u) => {
            setUser(u); setLoading(false);
        });
        return unsub;
    }, []);
    return (
        <AuthCtx.Provider value={{ user, loading }}>
            {children}
        </AuthCtx.Provider>
    );
}