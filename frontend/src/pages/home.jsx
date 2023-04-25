import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Button } from "../components/Button";
import axios from "axios";
import { io } from "socket.io-client";
import { AuthContext } from "../utils/AuthContext";
import { useLocation } from "react-router-dom";

export const Home = () => {
  const serverURL = `https://raid-middleman.herokuapp.com`;
  //const serverURL = "http://localhost:5000";
  const publicVapidKey =
    "BM6G-d8QYWAUCE5C7CKxmSVmEnOgUJzOs-Dml88APJqKoC3Jv9DF2sn9_mTTsz0KHyYArGYkaw4Z7X0fbdKWAKk";

  // you need to be authenticated to see this page, so we have a user
  // just use their id as their screenshot folder name
  const { user, token } = useContext(AuthContext);

  const location = useLocation();

  //connect to the socket server.
  const socket = io.connect(
    serverURL,
    {
      auth: {
        token: token,
      },
    },
    console.log("connecting")
  );

  useEffect(() => {
    // array buffer to base64 encoded string

    const imgElement = document.getElementById("img");
    if (imgElement) {
      socket.on("sendImage", function (base64string) {
        imgElement.src = `data:image/jpeg;base64,${base64string}`;
      });
    }

    socket.on("notifyDetection", function (detectionLabel) {
      console.log(detectionLabel);

      // Register service worker, register push, send push
      // async function send(){
      //     // Register service worker
      //     console.log('Registering service worker...')
      //     const register = await navigator.serviceWorker.register('../serviceworker.js')
      //     console.log('Service worker registered')
      //
      //     // Register push
      //     console.log('Registering push...')
      //     const subscription = await register.pushManager.subscribe({
      //         userVisibleOnly: true,
      //         applicationServerKey: publicVapidKey
      //     })
      //     console.log('Push registered...')
      //
      //     // Send a push notification
      //     // we send our subscription object to our node backend, via the subscribe route
      //     await fetch(`${serverURL}/subscribe`, {
      //         method: 'POST',
      //         body: JSON.stringify(subscription),
      //         headers: {
      //             'content-type': 'application/json'
      //         }
      //     })
      //
      //     console.log('Push sent')
      // }
      //
      // send().catch(err => console.error(err))
    });

    // Cleanup function
    return () => {
      socket.off("sendImage");
      socket.off("detection");
    };
  }, [socket]);

  return (
    <div
      className={
        "m-auto flex min-h-screen w-full w-[800px] flex-col items-center justify-center bg-navy p-2 [&>*]:w-full"
      }
    >
      <div className={"flex flex-col [&>*]:w-full"}>
        <h1 className={"text-center text-3xl font-medium text-white"}>
          Live View
        </h1>
        <h1 className={"mb-5 text-center text-base font-light text-white"}>
          {0} Detections Today
        </h1>
        <img
          id={"img"}
          src={
            "https://placeholder.pics/svg/600/DEDEDE/555555/Attempting%20to%20load%20video%20feed..."
          }
        />
        <div className={"mt-2 mb-8"}>
          <Button
            onClick={async () => {
              // I will also add the type of detection. So eg the directory structure could be: userID/dogs, or userID/cats
              return await axios
                .get(`${serverURL}/api/screenshot`, {
                  headers: { "x-auth-token": token },
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((e) => console.error(e));
            }}
            btnText={"Screenshot"}
          />
          <Button
            onClick={() => {
              axios
                .get(`${serverURL}/api/publish-mqtt`)
                .then((res) => {
                  console.log(res);
                })
                .catch((e) => console.error(e));
            }}
            btnText={"Activate Buzzer"}
          />
        </div>
      </div>
    </div>
  );
};
