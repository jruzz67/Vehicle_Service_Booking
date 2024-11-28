// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check if user is logged in on component mount
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.get(`http://localhost:5000/users?email=${email}`);
            const existingUser = response.data[0];
            if (!existingUser) {
                toast.error('Invalid email and password');
                return { success: false };
            }
            if (existingUser.password !== password) {
                toast.error('Invalid password');
                return { success: false };
            }
            setUser(existingUser);
            localStorage.setItem('user', JSON.stringify(existingUser));
            toast.success('Login successful!');
            return { success: true };
        } catch (error) {
            console.error(error);
            toast.error('An error occurred during login');
            return { success: false };
        }
    };

    const signup = async (userData) => {
        try {
            // Check if email already exists
            const response = await axios.get(`http://localhost:5000/users?email=${userData.email}`);
            if (response.data.length > 0) {
                toast.error('Email already exists');
                return { success: false };
            }

            const res = await axios.post('http://localhost:5000/users', userData);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            toast.success('Signup successful!');
            return { success: true };
        } catch (error) {
            console.error(error);
            toast.error('An error occurred during signup');
            return { success: false };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        toast.info('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
