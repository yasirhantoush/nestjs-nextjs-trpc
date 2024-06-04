"use client"
import React, { useContext } from 'react'
import { AuthContext } from '../auth-provider';
import { UnAuthenticatedPage } from './UnAuthenticatedPage';
import { UnAuthorizedPage } from './UnAuthorizedPage';

export const EnsureAuthorized = ({ roles, children }: { roles?: string[], children: any }) => {
    const auth = useContext(AuthContext);
    const isAuthorized = Array.isArray(roles) ? roles.some(r => auth.user?.roles.includes(r)) : true;

    return (
        <>
            {!auth.isAuthenticated && <UnAuthenticatedPage />}
            {auth.isAuthenticated && !isAuthorized && <UnAuthorizedPage />}
            {auth.isAuthenticated && isAuthorized && children}
        </>
    )
}
