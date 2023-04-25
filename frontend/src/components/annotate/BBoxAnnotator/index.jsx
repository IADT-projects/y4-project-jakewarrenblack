import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useContext,
} from "react";
import { createUseStyles } from "react-jss";
import { v4 as uuid } from "uuid";
import BBoxSelector from "../BBoxSelector";
import LabelBox from "../LabelBox";
import axios from "axios";
import { AuthContext } from "../../../utils/AuthContext";

const useStyles = createUseStyles({
  bBoxAnnotator: {
    cursor: "crosshair",
  },
  imageFrame: {
    position: "relative",
    backgroundSize: "100%",
  },
});

const BBoxAnnotator = React.forwardRef(
  (
    {
      selected,
      files,
      entries,
      setEntries,
      url,
      borderWidth = 2,
      inputMethod,
      labels,
      onChange,
    },
    ref
  ) => {
    const classes = useStyles();
    const [pointer, setPointer] = useState(null);
    const [offset, setOffset] = useState(null);
    const [multiplier, setMultiplier] = useState(1);
    const [submissionEntries, setSubmissionEntries] = useState([]);
    const [maxWidth, setMaxWidth] = useState(1);
    const [annotatedFiles, setAnnotatedFiles] = useState([]);
    const [finalEntries, setFinalEntries] = useState([]);

    const { token } = useContext(AuthContext);

    useEffect(() => {
      // check if there are any entries present which are not undefined
      if (entries.some((entry) => entry !== undefined)) {
        setSubmissionEntries(
          entries.map((entry) => {
            const multiplier = entry.imgWidth / maxWidth;
            return {
              width: Math.round(entry.width * multiplier),
              height: Math.round(entry.height * multiplier),
              top: Math.round(entry.top * multiplier),
              left: Math.round(entry.left * multiplier),
              label: entry.label,
              fileName: entry.fileName,
              imgWidth: entry.imgWidth,
              imgHeight: entry.imgHeight,
            };
          })
        );
      }
    }, [entries, multiplier]);

    const [status, setStatus] = useState("free");
    const [imageFrameStyle, setImageFrameStyle] = useState({});
    const bBoxAnnotatorRef = useRef(null);
    const labelInputRef = useRef(null);

    useEffect(() => {
      setMaxWidth(bBoxAnnotatorRef.current?.offsetWidth || 1);
      const maxHeight = bBoxAnnotatorRef.current?.offsetHeight || 1;
      const imageElement = new Image();
      imageElement.src = url;

      imageElement.onload = function () {
        const width = imageElement.width;
        const height = imageElement.height;

        setMultiplier(width / maxWidth);

        setImageFrameStyle({
          backgroundImageSrc: imageElement.src,
          width: width / multiplier,
          height: height / multiplier,
        });
      };

      imageElement.onerror = function () {
        throw "Invalid image URL: " + url;
      };
    }, [url, multiplier, bBoxAnnotatorRef]);

    const crop = (pageX, pageY) => {
      return {
        x:
          bBoxAnnotatorRef.current && imageFrameStyle.width
            ? Math.min(
                Math.max(
                  Math.round(pageX - bBoxAnnotatorRef.current.offsetLeft),
                  0
                ),
                Math.round(imageFrameStyle.width - 1)
              )
            : 0,
        y:
          bBoxAnnotatorRef.current && imageFrameStyle.height
            ? Math.min(
                Math.max(
                  Math.round(pageY - bBoxAnnotatorRef.current.offsetTop),
                  0
                ),
                Math.round(imageFrameStyle.height - 1)
              )
            : 0,
      };
    };

    const updateRectangle = (pageX, pageY) => {
      setPointer(crop(pageX, pageY));
    };

    useEffect(() => {
      const mouseMoveHandler = (e) => {
        switch (status) {
          case "hold":
            updateRectangle(e.pageX, e.pageY);
        }
      };
      window.addEventListener("mousemove", mouseMoveHandler);
      return () => window.removeEventListener("mousemove", mouseMoveHandler);
    }, [status]);

    useEffect(() => {
      const mouseUpHandler = (e) => {
        switch (status) {
          case "hold":
            updateRectangle(e.pageX, e.pageY);
            setStatus("input");
            labelInputRef.current?.focus();
        }
      };
      window.addEventListener("mouseup", mouseUpHandler);
      return () => window.removeEventListener("mouseup", mouseUpHandler);
    }, [status, labelInputRef]);

    const addEntry = (label) => {
      const newEntry = {
        ...rect,
        label,
        id: uuid(),
        showCloseButton: false,
      };

      setEntries((prevAnnotations) => [
        ...prevAnnotations,
        {
          ...newEntry,
          fileName: files[selected].file.name,
          imgWidth: files[selected].meta.width,
          imgHeight: files[selected].meta.height,
        },
      ]);

      setStatus("free");
      setPointer(null);
      setOffset(null);
    };

    const mouseDownHandler = (e) => {
      switch (status) {
        case "free":
        case "input":
          if (e.button !== 2) {
            setOffset(crop(e.pageX, e.pageY));
            setPointer(crop(e.pageX, e.pageY));
            setStatus("hold");
          }
      }
    };

    const rectangle = () => {
      const x1 = offset && pointer ? Math.min(offset.x, pointer.x) : 0;
      const x2 = offset && pointer ? Math.max(offset.x, pointer.x) : 0;
      const y1 = offset && pointer ? Math.min(offset.y, pointer.y) : 0;
      const y2 = offset && pointer ? Math.max(offset.y, pointer.y) : 0;
      return {
        left: x1,
        top: y1,
        width: x2 - x1 + 1,
        height: y2 - y1 + 1,
      };
    };

    useImperativeHandle(ref, () => ({
      reset() {
        setEntries([]);
      },
    }));

    const entryItem = (entry, i) => {
      return entry ? (
        <div
          className={"absolute absolute border-2 border-red-500 text-white"}
          style={{
            top: `${entry.top - borderWidth}px`,
            left: `${entry.left - borderWidth}px`,
            width: `${entry.width}px`,
            height: `${entry.height}px`,
          }}
          key={i}
        >
          <div
            className={
              "absolute cursor-pointer select-none overflow-hidden border-2 border-white bg-[#030] text-center text-white"
            }
            style={{
              top: "-8px",
              right: "-8px",
              width: "16px",
              height: "0",
              padding: "16px 0 0 0",
              borderRadius: "18px",
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={() => {
              setEntries(entries.filter((e) => e.id !== entry.id));
            }}
          >
            <div
              className={"absolute block text-center"}
              style={{
                width: "16px",
                top: "-2px",
                left: "0",
                fontSize: "16px",
                lineHeight: "16px",
              }}
            >
              &#215;
            </div>
          </div>

          <div
            style={{ outline: "2px solid red" }}
            className={
              "-mt-8 w-max w-min overflow-hidden bg-red-500 px-4 text-2xl"
            }
          >
            {entry.label}
          </div>
        </div>
      ) : (
        ""
      );
    };

    const rect = rectangle();

    useEffect(async () => {
      if (files.length && finalEntries.length) {
        // return array of promises, wait for it to finish before running submitEntries()
        const promises = finalEntries.map(async (entry) => {
          // entry being the value returned from BBoxAnnotator with the appropriately transformed values...
          // need to pair them where file.name matches annotation.fileName
          // if the annotation's fileName attribute matches the name of one of our unnannotated files
          // when looking at an entry, i have access to the filename

          const relevantFile = files.find(
            (file) => file.file.name === entry.fileName
          );

          console.log("Relevant file: ", relevantFile);

          if (relevantFile) {
            const fileToBeAdded = {
              file: relevantFile.file, // exclude all the metadata
              annotation: entry,
            };

            setAnnotatedFiles((prevAnnotatedFiles) => [
              ...prevAnnotatedFiles,
              fileToBeAdded,
            ]);
          }
        });

        await Promise.all(promises);
      }
    }, [finalEntries]);

    useEffect(async () => {
      if (annotatedFiles.length) {
        await submitEntries()
          .then((res) => {
            console.log("Submit success: ", res);
            alert("Success");
          })
          .catch((e) => {
            console.log("Submit error: ", e);
            alert("Something went wrong");
          });
      }
    }, [annotatedFiles]);

    const submitEntries = async () => {
      return new Promise(async (resolve, reject) => {
        console.log("Submitting");

        if (annotatedFiles.length) {
          const formData = new FormData();

          annotatedFiles.forEach((annotatedFile) => {
            formData.append("files[]", annotatedFile.file);
            formData.append(
              "annotations[]",
              JSON.stringify(annotatedFile.annotation)
            );
          });

          console.log(
            "The entries that would be submitted are: ",
            annotatedFiles
          );

          await axios
            .post(
              `https://raid-middleman.herokuapp.com/api/roboflow/uploadWithAnnotation`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "x-auth-token": token,
                },
              }
            )
            .then((res) => resolve(res))
            .catch((e) => reject(e));
        } else {
          reject("Annotate files first");
        }
      });
    };

    return (
      <div
        className={classes.bBoxAnnotator}
        style={{ width: `auto`, height: `100%` }}
        ref={bBoxAnnotatorRef}
        onMouseDown={mouseDownHandler}
      >
        <div
          className={classes.imageFrame}
          style={{
            width: `auto`,
            height: `100%`,
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${imageFrameStyle.backgroundImageSrc})`,
          }}
        >
          {status === "hold" || status === "input" ? (
            <BBoxSelector rectangle={rect} />
          ) : null}

          {status === "input" ? (
            <LabelBox
              inputMethod={inputMethod}
              top={rect.top + rect.height + borderWidth}
              left={rect.left - borderWidth}
              labels={labels}
              onSubmit={addEntry}
              ref={labelInputRef}
            />
          ) : null}

          {entries.length &&
            entries[selected] &&
            entryItem(entries[selected], entries[selected].id)}
        </div>
        <div className={"align-center flex w-full justify-center"}>
          <button
            onClick={(e) => {
              setFinalEntries(submissionEntries);
            }}
            className={
              "absolute mt-2 w-1/3 cursor-pointer rounded-sm bg-blue-600 p-3 text-white"
            }
          >
            Finished
          </button>
        </div>
      </div>
    );
  }
);
export default BBoxAnnotator;
