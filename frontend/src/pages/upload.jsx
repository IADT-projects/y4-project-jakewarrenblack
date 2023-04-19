import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import { useCallback, useContext, useEffect, useState } from "react";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import BBoxAnnotator from "../components/annotate";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";

export const Upload = () => {
  const [selected, setSelected] = useState(0);;
  const [files, setFiles] = useState([]);
  const [annotations, setAnnotations] = useState([]);


  // file status will change every time we add a file, since we've omitted the get upload params step
  const handleChangeStatus = (
    fileWithMetadata,
    status,
    allFilesWithMetadata
  ) => {
    if (status === "done") {
      setFiles([...files, fileWithMetadata]);
    }
  };

  const myLayout = ({
    input,
    previews,
    submitButton,
    dropzoneProps,
    files,
    extra: { maxFiles },
  }) => {
    return (
      <div className={"h-full"}>
        <div className={"h-5/6"}>
          {files[selected] && <MyPreview preview={files[selected].meta} />}

          {files.length > 0 && submitButton}
        </div>
        <div className={"flex flex-col"}>
          <div
            className={
              "flex w-full justify-between px-4 text-5xl text-white"
            }
          >
            {/* If on 0, don't let the user go back, if on the end, go back to the start */}
            <button
              onClick={() => setSelected(selected !== 0 ? selected - 1 : 0)}
            >
              ⏮
            </button>
            <button
              onClick={() =>
                setSelected(selected === previews.length - 1 ? 0 : selected + 1)
              }
            >
              ⏭
            </button>
          </div>
          <div className={"m-auto mt-7"}>
            {files.length < maxFiles && input}
          </div>
        </div>
      </div>
    );
  };

  const getFilesFromEvent = (e) => {
    return new Promise((resolve) => {
      getDroppedOrSelectedFiles(e).then((chosenFiles) => {
        resolve(chosenFiles.map((f) => f.fileObject));
      });
    });
  };

  const MyPreview = ({ preview }) => {

    // We've changed bbox annotator to allow entries to be passed in
    // So we should try to find a relevant annotation entry for the image we're looking at right now

    return files[selected] ? (
      <div className={"m-auto h-full"}>
        <BBoxAnnotator
          url={files[selected].meta.previewUrl}
          entries={annotations}
          selected={selected}
          files={files}
          setEntries={setAnnotations}
          inputMethod="text"
        />
      </div>
    ) : (
      ""
    );
  };

  const myInput = ({ accept, onFiles, files }) => {
    const text = files.length > 0 ? "Add more files" : "Choose files";

    return (
        <label className={'bg-blue-600 text-white cursor-pointer rounded-sm p-3'}>
          {text}
          <input
            style={{ display: "none" }}
            type="file"
            accept={accept}
            multiple
            onChange={(e) => {
              getFilesFromEvent(e).then((chosenFiles) => {
                onFiles(chosenFiles);
              });
            }}
          />
        </label>
    );
  };

  return (
  <div style={{ height: "calc(100vh - 85px)" }}>
    <Dropzone
      onChangeStatus={handleChangeStatus}
      InputComponent={myInput}
      LayoutComponent={myLayout}
      PreviewComponent={MyPreview}
      accept="image/*"
    />
  </div>
  );
};
