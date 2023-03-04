import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from "axios";
import BottomNav from "./components/BottomNav";
import Live_view from "./pages/live_view";

function App() {

  return (
    <Router>
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy min-h-screen'}>
            <Routes>
                <Route path="/" element={<Live_view />} />
            </Routes>
        </div>
        <BottomNav/>
    </Router>
  );
}

export default App;
