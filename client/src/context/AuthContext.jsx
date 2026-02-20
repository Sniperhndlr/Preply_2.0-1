import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return null;
        }
        const { data } = await api.get('/auth/me');
        setUser(data);
        return data;
    };

    useEffect(() => {
        const checkUser = async () => {
            try {
                await refreshUser();
            } catch (error) {
                console.error("Failed to fetch user", error);
                localStorage.removeItem('token');
                setUser(null);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
