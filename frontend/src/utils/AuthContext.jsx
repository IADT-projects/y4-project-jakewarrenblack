import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const attachTokenToHeaders = (token) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };

        if (token) {
            config.headers['x-auth-token'] = token;
        }

        return config;
    };

    const loadMe = async (token) => {
        try {
            const options = attachTokenToHeaders(token)
            const response = await axios.get('http://localhost:3001/api/auth/me', options);
            
            

            console.log('getMe success:', {
                user: response.data.me,
            })

            setUser(response.data.me)

        } catch (err) {
            setError(err.response.data.message)

            console.log('getMe error:', {
                user: response.data.me,
                token: response.data.token
            })
        }
    }



    const loginUserWithEmail = (formData, history) => async () => {
        setLoading(true);
        setError(null);


        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', formData);


            setUser(response.data.me);
            setToken(response.data.token);
            setLoading(false);

            console.log('Email/PW auth info:', {
                user: response.data.me,
                token: response.data.token
            })

        } catch (err) {
            setError(err.response.data.message);
            setLoading(false);

            console.log('Email/PW auth error:', {
                error: err.response.data.message
            })
        }
    };

    const loginUserWithOauth = async (token) => {
        setLoading(true);
        setError(null);

        try {
            const options = attachTokenToHeaders(token)
            const response = await axios.get('http://localhost:3001/api/auth/me', options);

            setUser(response.data.me);
            setToken(token);
            setLoading(false);

            console.log('OAuth info:', {
                user: response.data.me,
                token: token
            })

        } catch (err) {
            setError(err.response.data.message);
            setLoading(false);

            console.log('OAuth error:', {
                error: err.response.data.message
            })
        }
    };

    const authContextValues = {
        user,
        token,
        loading,
        error,
        loginUserWithOauth,
        loginUserWithEmail,
        loadMe
    };

    return (
        <AuthContext.Provider value={authContextValues}>
            {props.children}
        </AuthContext.Provider>
    );
};
