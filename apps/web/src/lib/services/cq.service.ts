import axios from 'axios';
import { CommandResponse } from './command-response';
import * as jwt from "jwt-decode";

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function handleError(err: any) {
    if (err && err.isAxiosError && err.response?.data) {
        return err?.response?.data
    } else {
        return { message: '' + err }
    }
}

export function getAccessToken(): string {
    return window?.localStorage.getItem('accessToken') || ''
}

export function getRefreshToken(): string {
    return window?.localStorage.getItem('refreshToken') || ''
}

export function isTokenExpired(): boolean {
    let accessToken = getAccessToken();
    if (!accessToken) {
        return true
    } else {
        const decoded = jwt.jwtDecode(accessToken) as { exp: number }
        return Date.now() >= decoded.exp * 1000
    }
}

export async function setRefreshToken(refreshToken: string) {
    window.localStorage.setItem('refreshToken', refreshToken)
}

export async function clearTokens() {
    window.localStorage.removeItem('accessToken')
    window.localStorage.removeItem('refreshToken')
}

export async function refreshToken(): Promise<CommandResponse<any>> {
    let refreshToken = window?.localStorage.getItem('refreshToken') || '';
    const commandResponse = await publicCommand('user', 'user.refreshToken', { refreshToken })
    window.localStorage.setItem('accessToken', commandResponse.data.accessToken)
    window.localStorage.setItem('expiresAt', commandResponse.data.expiresAt)
    return commandResponse;
}

export async function publicCommand<T = any>(module: string, command: string, payload: any): Promise<CommandResponse<T>> {
    try {
        const { data } = await axios.post<CommandResponse<T>>(`${BASE_URL}/${module}/commands/${command}`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return data as CommandResponse<T>;
    } catch (err) {
        throw handleError(err);
    }
}

export async function command<T = any>(module: string, command: string, payload: any): Promise<CommandResponse<T>> {
    try {
        if (isTokenExpired()) {
            await refreshToken();
        }
        let accessToken = getAccessToken();
        const { data } = await axios.post<CommandResponse<T>>(`${BASE_URL}/${module}/commands/${command}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        return data as CommandResponse<T>;
    } catch (err) {
        throw handleError(err);
    }
}

export async function publicQuery<T = any>(module: string, query: string, payload: any): Promise<CommandResponse<T>> {
    try {
        const { data } = await axios.post<T>(`${BASE_URL}/${module}/queries/${query}`, payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return data as CommandResponse<T>;
    } catch (err) {
        throw handleError(err);
    }
}

export async function query<T = any>(module: string, query: string, payload: any): Promise<CommandResponse<T>> {
    try {
        if (isTokenExpired()) {
            await refreshToken();
        }
        const accessToken = getAccessToken();
        const { data } = await axios.post<T>(`${BASE_URL}/${module}/queries/${query}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        return data as CommandResponse<T>;
    } catch (err) {
        throw handleError(err);
    }
}

export async function ppost<T = any>(url: string, payload: any): Promise<T> {
    const response = await axios.post<T>(`${BASE_URL}/${url}`, payload, {})
    return response.data
}

export async function post<T = any>(url: string, payload: any): Promise<T> {
    if (isTokenExpired()) {
        await refreshToken();
    }
    const accessToken = getAccessToken();
    const response = await axios.post<T>(`${BASE_URL}/${url}`, payload, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    return response.data
}
