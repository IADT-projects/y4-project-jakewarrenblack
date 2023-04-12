import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from "react-dropzone-uploader";
import {useEffect, useState} from "react";
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
import BBoxAnnotator from "../components/annotate";
import axios from "axios";

export const Upload = () => {
    const [selected, setSelected] = useState(0)
    const [annotatedFiles, setAnnotatedFiles] = useState([])
    const [files, setFiles] = useState([])
    const [annotations, setAnnotations] = useState([])

    const [existingAnnotation, setExistingAnnotation] = useState(null)

    // useEffect(() => {
    //     const relevantAnnotation = annotations.find(annotation => annotation.fileName === files[selected].file.name)
    //
    //     console.log('Found existing annotation: ', relevantAnnotation)
    //
    //     setExistingAnnotation(relevantAnnotation ?? null)
    // }, [selected])

    useEffect(() => {
        if(files.length){
            // if the annotation's fileName attribute matches the name of one of our unnannotated files
            const relevantAnnotation = annotations.find(annotation => annotation.fileName === files[selected].file.name)

            if(relevantAnnotation) {
                const relevantFile = files.find(file => file.file.name === relevantAnnotation.fileName)

                const fileToBeAdded = {
                    file: relevantFile.file, // exclude all the metadata
                    annotation: relevantAnnotation
                }

                setAnnotatedFiles([
                    ...annotatedFiles,
                    fileToBeAdded
                ])
            }
        }
    }, [annotations])



    // file status will change every time we add a file, since we've omitted the get upload params step
    const handleChangeStatus = (fileWithMetadata, status, allFilesWithMetadata) => {
        if(status === 'done'){
            setFiles([
                ...files,
                fileWithMetadata
            ])
        }
    }

    const myLayout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
        return (
            <div className={'h-full'}>
                <div className={'h-5/6'}>
                    {files[selected] && <MyPreview preview={files[selected].meta}/>}

                    {files.length > 0 && submitButton}
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

    const MyPreview = ({preview,}) => {
        const labels = ['Cow', 'Sheep']

        // We've changed bbox annotator to allow entries to be passed in
        // So we should try to find a relevant annotation entry for the image we're looking at right now

        // {"left":120,"top":94,"width":234,"height":133,"label":"Cow","id":"a8b6212e-eb41-4a1f-879d-827707b560e9","showCloseButton":false}

        return ( files[selected] ?
            <div className={'h-full m-auto'}>
                <BBoxAnnotator
                    //existingAnnotations={annotatedFiles.map((entry => entry.annotation))}
                    //existingAnnotations={[{"left":120,"top":94,"width":234,"height":133,"label":"Cow","id":"a8b6212e-eb41-4a1f-879d-827707b560e9","showCloseButton":false}]}
                    url={files[selected].meta.previewUrl}
                    inputMethod="text"
                    labels={labels}
                    onChange={(annotationData) => {
                        if(annotationData.length){
                            if(annotationData[0].label){
                                setAnnotations([
                                    ...annotations,
                                    {
                                        ...annotationData,
                                        fileName: files[selected].file.name
                                    }
                                ])
                            }
                        }
                    }}
                />
                <button className={'text-white hover:cursor-pointer absolute'} onClick={async (e) => {
                        if(annotatedFiles.length){
                            const formData = new FormData()

                            annotatedFiles.forEach((annotatedFile) => {
                                formData.append("files[]", annotatedFile.file);
                                formData.append("annotations[]", JSON.stringify(annotatedFile.annotation));
                            });

                            axios.post(`http://localhost:5000/api/roboflow/uploadWithAnnotation`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            .then((res) => console.log('API Response: ', res))
                            .catch((e) => console.error('Error: ', e))
                        }
                        else{
                            alert('Annotate some images before submitting')
                        }
                }}>Finished</button>
            </div> : ''
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

    const handleSubmit = (files, allFiles) => {
        console.log('allfiles: ', allFiles)
    }

    return (
        <Dropzone
            onChangeStatus={handleChangeStatus}
            InputComponent={myInput}
            LayoutComponent={myLayout}
            PreviewComponent={MyPreview}
            onSubmit={handleSubmit}
            accept="image/*"
        />
    )
}