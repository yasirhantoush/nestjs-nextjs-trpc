"use client"
import React, { useContext } from 'react'
import { AuthContext } from '../auth-provider';

export const IsAuthenticated = ({ children }: { children: any }) => {
    const auth = useContext(AuthContext);
    if (!auth.isAuthenticated) return;
    return children
}
