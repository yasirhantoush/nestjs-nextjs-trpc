"use client"
import { useContext } from 'react'
import { AuthContext } from '../auth-provider';

export const IsNotAuthenticated = ({ children }: { children: any }) => {
    const auth = useContext(AuthContext);
    if (auth.isAuthenticated) return
    return children
}
