import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Loader } from "../components/Loader";

export const Pet = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState();

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    await axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/roboflow/getVersionInfo`, {
        headers: {
          "x-auth-token": token,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
        setError(null);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        setError(e.response.data.msg);
      });
  }, []);

  const splitValue = (value) =>
    `${((value / data.imageCount) * 100).toFixed(2)}%`;

  const Table = ({ values }) => {
    return (
      <div className="mt-2 flex w-full flex-row justify-around">
        {values.map(({ key, value }) => {
          return (
            <div className="flex flex-col items-center [&>*]:text-white">
              <h2>{key}</h2>
              <h3>{value}</h3>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className={"px-1"}>
      <h1 className={"text-center text-3xl font-medium capitalize text-white"}>
        {data && data.petName}
      </h1>

      {data && !error ? (
        <div>
          <img
            className="max-h-64 w-full object-cover object-center"
            src={data.icon}
          />
          <h1 className="text-center text-2xl font-medium capitalize text-white">
            {data.imageCount} total images
          </h1>
          <div className="mt-10 space-y-12">
            <div>
              <h1 className="text-center text-2xl font-bold capitalize text-white">
                Split Values
              </h1>
              <Table
                values={[
                  {
                    key: "Train",
                    value: `${splitValue(data.splits.train)}`,
                  },
                  {
                    key: "Valid",
                    value: `${splitValue(data.splits.valid)}`,
                  },
                  {
                    key: "Test",
                    value: `${splitValue(data.splits.test)}`,
                  },
                ]}
              />
            </div>
            <div>
              <h1 className="text-center text-2xl font-bold capitalize text-white">
                Accuracy Stats
              </h1>
              <Table
                values={[
                  {
                    key: "mAP",
                    value: `${(data.stats.map * 100).toFixed(2)}%`,
                  },
                  {
                    key: "Precision",
                    value: `${(data.stats.precision * 100).toFixed(2)}%`,
                  },
                  {
                    key: "Recall",
                    value: `${(data.stats.recall * 100).toFixed(2)}%`,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/train" replace />
      )}
    </div>
  );
};
