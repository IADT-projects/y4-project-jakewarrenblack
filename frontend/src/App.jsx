import React, {useContext, useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";

import {Home} from "./pages/home";
import {LoginRegister} from "./pages/login_register";
import {Pairing} from "./pages/pairing";
import {Captures} from "./pages/captures";
import {Pets} from "./pages/pets";
import {Settings} from "./pages/settings";
import {AuthContext} from "./utils/AuthContext";



function App() {

    // So when user refreshes page, check for a token, and just log them in again
    const {loginUserWithOauth} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(async () => {
        const cookieJwt = Cookies.get('x-auth-cookie');
        if (cookieJwt) {
            await loginUserWithOauth(cookieJwt)
                .then((res) => {
                    navigate('/home')
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        else{
            console.log('No cookie in session')
        }
    }, []);

  return (
    <>
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
    </>
  );
}

export default App;
