import { useState, useContext } from "react";
import { Button } from "../components/Button";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";
import { Loader } from "../components/Loader";

export const Training = () => {
  const [trainingStarted, setTrainingStarted] = useState(false);

  const { token } = useContext(AuthContext);

  if (trainingStarted) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 85px)" }}
      >
        <div className={"h-min px-1"}>
          <div className={"mt-5 flex flex-col items-center justify-center"}>
            <Loader />
            <p className={"mt-2 text-center text-2xl text-white"}>
              Training in progress, this will take several hours...
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 85px)" }}
      >
        <div className={"h-min px-1"}>
          <div className={"mt-5 flex flex-col items-center justify-center"}>
            <p className={"mt-2 text-center text-2xl text-white"}>
              Upload Successful
            </p>
            <Button
              btnText={"Start Training"}
              onClick={() => {
                console.log("beginning training");
                axios
                  .post(
                    `${import.meta.env.VITE_SERVER_URL}/api/roboflow/train`,
                    {},
                    {
                      headers: {
                        "x-auth-token": token,
                      },
                    }
                  )
                  .then((res) => {
                    console.log("Training has started", res.data.msg);
                    setTrainingStarted(true);
                  })
                  .catch((e) => {
                    console.log("Error when beginning training: ", e);
                    setTrainingStarted(false);
                  });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
};
