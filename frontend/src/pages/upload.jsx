import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import {useContext, useEffect, useState} from "react";
import {getDroppedOrSelectedFiles} from "html5-file-selector";
import BBoxAnnotator from "../components/annotate";
import axios from "axios";
import {AuthContext} from "../utils/AuthContext";


export const Upload = () => {
  const [numChosenFiles, setNumChosenFiles] = useState(0)
  const [selected, setSelected] = useState(0);
  const [files, setFiles] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  const { token } = useContext(AuthContext);

  // file status will change every time we add a file, since we've omitted the get upload params step
  const handleChangeStatus = async (
    fileWithMetadata,
    status,
    allFilesWithMetadata
  ) => {
    if (status === "done") {
      console.log('all files with meta: ', allFilesWithMetadata)

      setFiles([...files, fileWithMetadata]);

      // 1. get these files
      // 2. send them to the middleman server
      // 3. on the middleman server, we also have our pet detection model
      // 4. middleman passes every image through the model, gets the coordinates, and sends them back here
      // 5. we send the images into the bbox annotator which displays the annotations on screen
      // 6. user can review and change them, or just submit if they're happy with the annotations

    }
  };

  const [autoAnnotatedFiles, setAutoAnnotatedFiles] = useState([])

  const b64toBlob = (b64Data, contentType= '', sliceSize= 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
  }

  useEffect(async () => {
    if(files.length === numChosenFiles){
      const formData = new FormData();

      console.log('all files with metadata: ', files)

      files.forEach((file) => {
        formData.append("files[]", file.file);
        formData.append('dimensions[]', JSON.stringify({width: file.meta.width, height: file.meta.height}));
      })

      // on the server-side, images are resized to 640x640, which is a more suitable size for the model
      // at the end of the day all the images are converted to 640x640 once they're on roboflow anyway, so won't affect that side of things
      //
      // i receive a buffer of the resized image from this endpoint
      // finally pass the resized image file and the auto annotations to the bbox annotator for display

      console.log('auto annotate req')
      await axios
          .post(`http://localhost:5000/api/auto-annotate/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-auth-token": token,
            },
          })
          .then((res) => {
            console.log('Auto annotations received: ', res)

            setAnnotations(res.data.annotations.map((annotatedFile) => {

              const imageBlob = b64toBlob(annotatedFile.base64, annotatedFile.type);
              const imageFile = new File([imageBlob], annotatedFile.name);


              return {
                previewUrl: annotatedFile.base64,
                width: (annotatedFile.width - annotatedFile.x),
                height: (annotatedFile.height - annotatedFile.y),
                top: annotatedFile.y,
                left: annotatedFile.x,
                label: 'test',
                fileName: annotatedFile.name,
                imgWidth: 416,
                imgHeight: 416,
                auto: true,
                file: imageFile
              }
            }))
          })
          .catch((e) => console.log(e));
    }
  }, [files])

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
            className={"flex w-full justify-between px-4 text-5xl text-white"}
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
        setNumChosenFiles(chosenFiles.length)
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
          url={annotations[selected]?.previewUrl ? {src: `data:image/png;base64,${annotations[selected].previewUrl}`, auto: true} : files[selected].meta.previewUrl}
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
      <label className={"cursor-pointer rounded-sm bg-blue-600 p-3 text-white"}>
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
