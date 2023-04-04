import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from "axios";
import BottomNav from "./components/BottomNav";
import {Home} from "./pages/home";
import {LoginRegister} from "./pages/login_register";
import {Pairing} from "./pages/pairing";
import {Captures} from "./pages/captures";
import {Pets} from "./pages/pets";
import {Settings} from "./pages/settings";
import {AuthContext} from "./utils/AuthContext";
import {AuthProvider} from './utils/AuthContext'
import ProtectedRoute from "./components/ProtectedRoute";
import Cookies from 'js-cookie';

function App() {
    // const { loading, error, logInUserWithOauth } = useContext(AuthContext);
    //
    // useEffect(() => {
    //     const cookieJwt = Cookies.get('x-auth-cookie');
    //     if (cookieJwt) {
    //         Cookies.remove('x-auth-cookie');
    //         logInUserWithOauth(cookieJwt);
    //     }
    //     else{
    //         console.log('No cookie in session')
    //     }
    // }, []);

    // useEffect(() => {
    //     if (!auth.appLoaded && !auth.isLoading && auth.token && !auth.isAuthenticated) {
    //         loadMe();
    //     }
    // }, [auth.isAuthenticated, auth.token, loadMe, auth.isLoading, auth.appLoaded]);

  return (
    <AuthProvider>
    <Router>
        {/* Height of container fills screen but excludes bottom navigation in its height */}
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy'}>
            <Routes>
                <Route path="/" element={<LoginRegister />} />
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/pair" element={<Pairing />} />
                    <Route path="/captures" element={<Captures />} />
                    <Route path="/pets" element={<Pets />} />
                    <Route path="/settings" element={<Settings/>} />
                </Route>
            </Routes>
        </div>
        <BottomNav/>
    </Router>
    </AuthProvider>
  );
}

export default App;
