import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from "react-dropzone-uploader";
import {useEffect, useState} from "react";
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
import BBoxAnnotator from "../components/annotate";

export const Upload = () => {

    const [files, setFiles] = useState([])
    const [annotations, setAnnotations] = useState([])

    // file status will change every time we add a file, since we've omitted the get upload params step
    const handleChangeStatus = ({ meta, file }, status) => {
        console.log(status, meta, file)

        // when status is 'done' the file has been prepared and validated

        if(status === 'done'){
            setFiles([
                ...files,
                file
            ])
        }

        let annotationMeta;

        console.log('Annotations: ', annotations)
        console.log('FileName: ', meta.name)

        let annotationForThisFile = annotations.findIndex(annotation => annotation.fileName === meta.name) !== -1

        console.log('Annotation for this file: ', annotationForThisFile)

        // now check if there's an annotation available for this file
        if(annotationForThisFile){
            annotationMeta = annotations[annotationForThisFile]
        }

        // you can return something from here to safely mutate the file meta
        //e.g.
        return {meta: {annotationData: annotationMeta}}
    }


    useEffect(() => {
        console.log('Files updated: ', files)
    }, [files])

    const myLayout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
        const [selected, setSelected] = useState(0)
        return (
            <div className={'h-full'}>
                <div className={'h-5/6'}>
                    {/* previews = an array of myPreview components */}
                    {previews[selected]}


                    {/*{files.length > 0 && submitButton}*/}
                </div>
                <div className={'flex flex-col'}>
                    <div className={'text-white flex w-full space-x-10 text-5xl justify-center'}>
                        {/* If on 0, don't let the user go back, if on the end, go back to the start */}
                        <button onClick={() => setSelected((selected !== 0 ? selected-1 : 0))}>prev</button>
                        <button onClick={() => setSelected((selected === previews.length -1 ? 0 : selected+1))}>next</button>
                    </div>
                    <div className={'mt-10 m-auto'}>
                        {files.length < maxFiles && input}
                    </div>
                </div>
            </div>
        )
    }


    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => f.fileObject))
            })
        })
    }



    const myPreview = ({meta}) => {
        const labels = ['Cow', 'Sheep']
        const [annotations, setAnnotations] = useState([])

        // every time a new image is added this will be reset, obviously don't want that since we're storing annotations in here
        // TODO: problem now is persisting this state across all the images
        const [annotatedFiles, setAnnotatedFiles] = useState([...files])

        useEffect(() => {
            setAnnotatedFiles(
                annotatedFiles.map((file) => {
                    // means annotation with fileName matching file.name exists, apply the annotation to that file
                    if(annotations.findIndex(annotation => annotation.fileName === file.name) !== -1){
                        return {
                            // this works
                            file: file,
                            annotation: annotations[annotations.findIndex(annotation => annotation.fileName === file.name)]
                        }
                    }
                    else{
                        return file;
                    }
                })
            )
        }, [annotations])

        return (
            <div className={'h-full m-auto'}>
                <BBoxAnnotator
                    url={meta.previewUrl}
                    inputMethod="select"
                    labels={labels}
                    onChange={(annotationData) => {
                        if(annotationData.length){
                            //
                            if(annotationData[0].label){


                                setAnnotations([
                                    ...annotations,
                                    {
                                        ...annotationData,
                                        fileName: meta.name
                                    }
                                ])
                            }

                        }
                    }}
                />
                <button className={'text-white hover:cursor-pointer absolute'} onClick={(e) => {

                }}>submit</button>
            </div>
        )
    }




    const myInput = ({ accept, onFiles, files }) => {
        const text = files.length > 0 ? 'Add more files' : 'Choose files'

        return (
            <label style={{ backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', padding: 15, borderRadius: 3, marginTop:100 }}>
                {text}
                <input
                    style={{ display: 'none' }}
                    type="file"
                    accept={accept}
                    multiple
                    onChange={e => {
                        getFilesFromEvent(e).then(chosenFiles => {
                            onFiles(chosenFiles)
                        })
                    }}
                />
            </label>
        )
    }

    return (
        <Dropzone

            onChangeStatus={handleChangeStatus}
            InputComponent={myInput}
            LayoutComponent={myLayout}
            PreviewComponent={myPreview}
            accept="image/*"
        />
    )
}