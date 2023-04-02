import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from "axios";
import BottomNav from "./components/BottomNav";
import {Home} from "./pages/home";
import {Login} from "./pages/login";
import {Register} from "./pages/register";
import {Pairing} from "./pages/pairing";
import {Captures} from "./pages/captures";
import {Pets} from "./pages/pets";
import {Settings} from "./pages/settings";
import {UserContext} from "./utils/user_context";

function App() {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const getUser = () => {
            fetch("https://raid-middleman.herokuapp.com/api/auth/login/success", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            })
                .then((response) => {
                    if (response.status === 200) return response.json();
                    throw new Error("authentication has been failed!");
                })
                .then((resObject) => {
                    console.log(resObject.user)
                    setUser(resObject.user);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getUser();
    }, []);

  return (
    <UserContext.Provider value={
        {
            user,
            setUser
        }
    }>
    <Router>
        {/* Height of container fills screen but excludes bottom navigation in its height */}
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy'}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pair" element={<Pairing />} />
                <Route path="/captures" element={<Captures />} />
                <Route path="/pets" element={<Pets />} />
                <Route path="/settings" element={<Settings/>} />
            </Routes>
        </div>
        <BottomNav/>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
