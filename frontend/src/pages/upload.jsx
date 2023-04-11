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

    useEffect(() => {
        if(files.length){
            console.log('Annotations and files: ', {
                annotations,
                files
            })
            // if the annotation's fileName attribute matches the name of one of our unnannotated files
            const relevantAnnotation = annotations.find(annotation => annotation.fileName === files[selected].file.name)
            const relevantFile = files.find(file => file.file.name === relevantAnnotation.fileName)

            // console.log('Files & annotations: ', {
            //     files,
            //     annotations,
            //     'Relevant file: ': relevantFile,
            //     selectedFile: files[selected].name
            // })

            // setAnnotatedFiles(prevAnnotatedFiles =>
            //     // I have no clause here to say 'if you're already annotated, you're fine'
            //     files.map((file) => {
            //         // means annotation with fileName matching file.name exists, apply the annotation to that file
            //         if(relevantFile && file.name === relevantFile.fileName){
            //             return {
            //                 file: files[selected],
            //                 annotation: annotations[annotations.findIndex(annotation => annotation.fileName === files[selected].name)]
            //             }
            //         }
            //         else{
            //             // check if this file already has an annotation
            //             return file;
            //         }
            //     })
            // )

            // setAnnotatedFiles([
            //     // we have an annotation with a fileName (presumably) matching that of the one on the screen right now, in other words files[selected].name
            //     // I need to find that file and create an annotatedFile entry which will be in the format {annotation, file} where annotation is the coords, file is the actual file we will upload
            //     // However, the file might already exist in annotatedFiles
            //     // I need to add a newly annotated file but keep the old annotations
            //     // relevantFile is okay, that's getting the file in question
            //     annotatedFiles.map((annotatedFile) => {
            //         if(annotatedFile.annotation.fileName === relevantFile.fileName){
            //             // means we've got a new annotation for this specific annotatedFile record
            //             return {
            //                 file: files[selected],
            //                 annotation: annotations[annotations.findIndex(annotation => annotation.fileName === files[selected].name)]
            //             }
            //         }
            //         else{
            //             if(annotatedFile.annotation){
            //                 return annotatedFile;
            //             }
            //             else{
            //                 // not annotated, just set it to a plain old file
            //                 return files[selected]
            //             }
            //
            //         }
            //     })
            // ])

            const fileToBeAdded = {
                file: relevantFile.file, // exclude all the metadata
                annotation: relevantAnnotation
            }

            console.log('File to be added: ', fileToBeAdded)
            // we know that annotations changed already
            setAnnotatedFiles([
                ...annotatedFiles,
                fileToBeAdded
            ])
        }
    }, [annotations])


    useEffect(() => {
        console.log('Annotated Files: ', annotatedFiles)
    }, [annotatedFiles])



    useEffect(() => {
        console.log('Files changed: ', files)
    }, [files])

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
                    {files[selected] && <MyPreview annotations={annotations} setAnnotations={setAnnotations} preview={files[selected].meta}/>}

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

    const MyPreview = ({preview, annotations, setAnnotations}) => {
        const labels = ['Cow', 'Sheep']

        return ( files[selected] ?
            <div className={'h-full m-auto'}>
                <BBoxAnnotator
                    url={files[selected].meta.previewUrl}
                    inputMethod="select"
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
                <button className={'text-white hover:cursor-pointer absolute'} onClick={(e) => {}}>submit</button>
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

    return (
        <Dropzone
            onChangeStatus={handleChangeStatus}
            InputComponent={myInput}
            LayoutComponent={myLayout}
            PreviewComponent={MyPreview}
            accept="image/*"
        />
    )
}