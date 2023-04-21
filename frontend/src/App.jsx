import React, { useContext, useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useOutlet,
} from "react-router-dom";
import Cookies from "js-cookie";

import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";

import { Home } from "./pages/home";
import { LoginRegister } from "./pages/login_register";
import { Pairing } from "./pages/pairing";
import { Captures } from "./pages/captures";
import { Pet } from "./pages/pets";
import { Settings } from "./pages/settings";
import { AuthContext } from "./utils/AuthContext";
import { Loader } from "./components/Loader";
import { Upload } from "./pages/upload";
import { SingleAnimal } from "./pages/singleAnimal";

function App() {
  // So when user refreshes page, check for a token, and just log them in again
  const { loginUserWithOauth, loading, hasGeneratedVersion } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const outlet = useOutlet();

  useEffect(async () => {
    const cookieJwt = Cookies.get("x-auth-cookie");
    if (cookieJwt) {
      await loginUserWithOauth(cookieJwt)
        .then((res) => {
          // navigate(outlet.location.pathname);
          if (!hasGeneratedVersion()) {
            navigate("/home");
          } else {
            navigate("/upload");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log("No cookie in session");
    }
  }, []);

  return (
    <>
      {/* Height of container fills screen but excludes bottom navigation in its height */}
      <div
        className={
          "m-auto flex w-full w-[800px] flex-col items-center justify-center bg-navy p-2 [&>*]:w-full"
        }
      >
        {loading ? (
          <Loader />
        ) : (
          <Routes>
            <Route path="/" element={<LoginRegister />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/upload" element={<Upload />} />
              <Route path="/home" element={<Home />} />
              <Route path="/pair" element={<Pairing />} />

              <Route path="/captures" element={<Captures />} />
              <Route path="/captures/:animal" element={<SingleAnimal />} />

              <Route path="/pet" element={<Pet />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        )}
      </div>
      <BottomNav />
    </>
  );
}

export default App;
