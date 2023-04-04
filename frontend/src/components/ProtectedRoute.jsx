import React, {useContext} from "react";
import {Navigate, Outlet, useLocation, redirect} from "react-router-dom";
import {UserContext} from "../utils/UserContext";

function ProtectedRoute () {
    const {user} = useContext(UserContext)
    const location = useLocation()

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