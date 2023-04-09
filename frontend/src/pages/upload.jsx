import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from "react-dropzone-uploader";
import {useState} from "react";
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
import BBoxAnnotator from "../components/annotate";

export const Upload = () => {

    const [files, setFiles] = useState([])

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
    }

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
        const [entries, setEntries] = useState([])

        //console.log('meta: ', meta)
        // <img className={'h-full m-auto'} src={meta.previewUrl}/>

        console.log('files: ', files)

        console.log('meta: ', meta)

        console.log(entries)


        // here i have a ref to the id of the preview image we're looking at
        // when the user adds an annotation, add that annotation data to the image itself

        // there can be multiple annotations in an image
        return (
            <div className={'h-full m-auto'}>
                <BBoxAnnotator
                    url={meta.previewUrl}
                    inputMethod="select"
                    labels={labels}
                    onChange={(e) => {
                        if(e.length){
                            console.log('bbox annotator change: ', e)

                            // means user has selected a label, at least one

                            // it considers mouseOver to be onChange
                            if(e[0].label){
                                console.log(e[0].label)

                                // if i change the files, bbox annotation gets reset, since the preview changed...

                                // setFiles(files.map((file) => {
                                //     if(file.id === meta.id){
                                //         file.annotation = e
                                //     }
                                //
                                //     return file;
                                // }))
                            }

                        }
                    }}
                />
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