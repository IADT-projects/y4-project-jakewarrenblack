import { Link, useParams } from "react-router-dom";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthContext";

export const SingleAnimal = (props) => {
  const { animal } = useParams();
  const { token } = useContext(AuthContext);
  const [images, setImages] = useState([]);

  // make request to userFolder/animal

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getimages?folderName=${animal}`, {
        headers: { "x-auth-token": token },
      })
      .then((res) => {
        console.log("Res: ", res);
        setImages(
          res.data.map((result) => ({
            url: result.url,
            id: result.public_id,
          }))
        );
      });
  }, []);

  const removeImage = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  return (
    <div
      className={
        "m-auto flex w-full w-[800px] flex-col items-center justify-center bg-navy p-2 [&>*]:w-full"
      }
    >
      <div className={"flex flex-col [&>*]:w-full"}>
        <h1 className={"text-center text-3xl font-medium text-white"}>
          {animal}
        </h1>

        <div className={"mb-20 grid w-full grid-cols-2 gap-1"}>
          {/* will iterate over animal images */}

          {/*{images.map((image) => <Link to={'/captures/:animal'} element={<SingleAnimal/>}><CaptureCard src={src} caption={name}/></Link>)}*/}
          {images.map(({ url, id }) => {
            return (
              <div>
                <span
                  onClick={() => {
                    axios
                      .get(
                        `http://localhost:5000/api/delete-screenshot?id=${id}`,
                        {
                          headers: { "x-auth-token": token },
                        }
                      )
                      .then((res) => {
                        console.log("Success: ", res);

                        removeImage(id);
                      })
                      .catch((e) => {
                        console.log("Error: ", e);
                      });
                  }}
                  className="relative top-0 cursor-pointer"
                >
                  ❌
                </span>
                <img src={url} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
