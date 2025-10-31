import { authApi } from '../lib/auth';

export async function fetchSecure(url, init = {}) {
    const token = await authApi.getIdToken();
    return fetch(url, {
        ...init,
        headers: {
            ...(init.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/json',
        },
    });
}
