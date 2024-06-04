"use client"
import React, { useContext } from 'react'
import { AuthContext } from '../auth-provider';

export const IsAuthorized = ({ roles, children }: { roles?: string[], children: any }) => {
    const auth = useContext(AuthContext);
    const isAuthorized = Array.isArray(roles) ? roles.some(r => (auth.user?.roles||[]).includes(r)) : true;
    
    if(!auth.isAuthenticated) return
    if(!isAuthorized) return

    return children
}
