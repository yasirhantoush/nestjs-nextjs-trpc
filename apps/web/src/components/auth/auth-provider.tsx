// context/todoContext.tsx
import React, { useEffect, useState } from 'react';
import Loading from '../common/Loading';
import { clearTokens, refreshToken } from '../../lib/services/cq.service';

export interface JWTPayload {
    userId: number;
    firstName: string;
    lastName: string;
    isAdmin: boolean,
    canAddFamily: boolean,
    canTransfer: boolean,
    roles: string[];
}

export interface AuthContextInterface {
    user: JWTPayload | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    syncSession: () => Promise<void>;
    clearSession: () => void;
}

export const AuthContext = React.createContext<AuthContextInterface>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    syncSession: async () => { },
    clearSession: () => { },
});

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<JWTPayload | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const clearSession = () => {
        clearTokens()
        setUser(null);
        setIsAuthenticated(false);
    };

    const syncSession = async () => {
        setIsLoading(true)
        try {
            const r = await refreshToken()
            setUser(r.data.user);
            setIsAuthenticated(true)
        } catch (err) {
            clearSession()
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        syncSession();
    }, [])

    if(isLoading) {
        return <Loading />
    }

    return <AuthContext.Provider value={{ user, isAuthenticated, isLoading, clearSession, syncSession }}>
        {children}
    </AuthContext.Provider>;
};
