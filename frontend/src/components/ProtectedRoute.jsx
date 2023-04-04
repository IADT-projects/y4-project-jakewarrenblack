import React, {useContext, useEffect} from "react";
import {Navigate, Outlet, useLocation, redirect} from "react-router-dom";
import {AuthContext} from "../utils/AuthContext";
import Cookies from 'js-cookie'

function ProtectedRoute () {
    const {user, loginUserWithOauth} = useContext(AuthContext)
    const location = useLocation()

    useEffect(() => {
        // if the user logged in with google, there'll be an x-auth-cookie in the session

        const cookieJwt = Cookies.get('x-auth-cookie');
        console.log('cookie:', cookieJwt)
        if (cookieJwt) {
            //Cookies.remove('x-auth-cookie');
            loginUserWithOauth(cookieJwt);
        }
    }, []);

    // If no user received from context, redirect to the login page
    console.log('printing user from context:', user)
    //
    if (!user) {
        return <Navigate
            to={'/'}
            state={{msg: 'Please sign in to access that page.'}}
        />
    }

    // Otherwise, go to the protected route
    return (
        <Outlet/>
    );

}

export default ProtectedRoute