import { Input } from "../components/Input";
import { Button } from "../components/Button";
import axios from "axios";
import React from "react";
import { CaptureCard } from "../components/CaptureCard";

import bear from "../Assets/animals/bear.jpg";
import cat from "../Assets/animals/cat.jpg";
import crow from "../Assets/animals/crow.jpg";
import deer from "../Assets/animals/deer.jpg";
import dog from "../Assets/animals/dog.jpg";
import hedgehog from "../Assets/animals/hedgehog.jpg";
import raccoon from "../Assets/animals/raccoon.jpg";
import squirrel from "../Assets/animals/squirrel.jpg";
import rabbit from "../Assets/animals/rabbit.jpg";
import { Link } from "react-router-dom";

export const Captures = () => {
  const labels = [
    { src: bear, name: "Bear" },
    { src: crow, name: "Crow" },
    { src: deer, name: "Deer" },
    { src: hedgehog, name: "Hedgehog" },
    { src: rabbit, name: "Rabbit" },
    { src: raccoon, name: "Raccoon" },
    { src: squirrel, name: "Squirrel" },
    { src: cat, name: "Cat" },
    // {src: dog, name:'Dog'},
  ];

  const AnimalCaptures = () => {
    return <div></div>;
  };

  return (
    <div
      className={
        "m-auto flex w-full w-[800px] flex-col items-center justify-center bg-navy p-2 [&>*]:w-full"
      }
    >
      <div className={"flex flex-col [&>*]:w-full"}>
        <h1 className={"text-center text-3xl font-medium text-white"}>
          Captures
        </h1>
        <h1 className={"mb-5 text-center text-base font-light text-white"}>
          This week's captures
        </h1>
        <div className={"mt-2 mb-2"}>
          <Button onClick={() => {}} btnText={"Animal Spotted"} />
        </div>

        <div className={"grid w-full grid-cols-2 gap-1"}>
          {labels.map(({ src, name }) => (
            <Link to={"/captures/:animal"} element={<AnimalCaptures />}>
              <CaptureCard src={src} caption={name} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
