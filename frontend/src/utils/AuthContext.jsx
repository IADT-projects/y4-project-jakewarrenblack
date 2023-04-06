import React, { createContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'

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

    const clearAllValues = () => {
        setUser(null);
        setToken(null);
        setLoading(false);
        setError(null);
        Cookies.remove('x-auth-cookie');
    }

    const loadMe = async (token) => {
        setLoading(true)
        try {
            const options = attachTokenToHeaders(token)
            const response = await axios.get('http://localhost:5000/api/auth/me', options);
            
            

            console.log('getMe success:', {
                user: response
            })

            setUser(response.data.me)
            setLoading(false)

        } catch (err) {
            setError(err.response.data.message)

            console.log('getMe error:', err)

            setLoading(false)
        }
    }


    // I promisified this one so I can use .then on it, and redirect once finished.
    // Don't need to do that for the oauth login since the server will redirect you.
    const loginUserWithEmail = async (formData, location) => {
        setLoading(true);
        setError(null);
        console.log('piss')

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);

            console.log('response: ', response)

            setUser(response.data.me);
            setToken(response.data.token);

            Cookies.set('x-auth-cookie', response.data.token)
            //await loadMe(response.data.token)



            console.log('Email/PW auth info:', response)



            setLoading(false);

            location.replace('/home')



            // when you login with oauth, the server sets a cookie and then redirects the user.
            // when you login with email/username and password, the server just responds with some json

        } catch (err) {

            if(err){
                setError(err.response.data.message);


                console.log('Email/PW auth error:', {
                    error: err
                })

                setLoading(false);
            }

        }
    };

    const loginUserWithOauth = (token) => {
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            setError(null);

            try {
                const options = attachTokenToHeaders(token);
                const response = await axios.get('http://localhost:5000/api/auth/me', options);

                setUser(response.data.me);
                setToken(token);

                console.log('OAuth info:', {
                    user: response.data.me,
                    token: token
                });

                setLoading(false);

                resolve(response.data.me);

            } catch (err) {
                setError(err.response.data.message);

                console.log('OAuth error:', {
                    error: err.response.data.message
                });

                setLoading(false);
                reject(err.response.data.message);
            }
        });
    };

    const authContextValues = {
        user,
        setUser,
        token,
        loading,
        error,
        loginUserWithOauth,
        loginUserWithEmail,
        loadMe,
        clearAllValues
    };

    return (
        <AuthContext.Provider value={authContextValues}>
            {props.children}
        </AuthContext.Provider>
    );
};
