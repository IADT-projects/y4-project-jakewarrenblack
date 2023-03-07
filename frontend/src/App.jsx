import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from "axios";
import BottomNav from "./components/BottomNav";
import {Home} from "./pages/home";
import {Login} from "./pages/login";
import {Register} from "./pages/register";
import {Pairing} from "./pages/pairing";

function App() {

  return (
    <Router>
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy min-h-screen'}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pair" element={<Pairing />} />
            </Routes>
        </div>
        <BottomNav/>
    </Router>
  );
}

export default App;
