import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from "react-dropzone-uploader";
import {useState} from "react";
import { getDroppedOrSelectedFiles } from 'html5-file-selector'

export const Upload = () => {
    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }

    const [files, setFiles] = useState([])

    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (file, allFiles) => {
        // console.log(files.map(f => f.meta))
        // allFiles.forEach(f => f.remove())

        setFiles([
            ...files,
            file
        ])
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
        console.log('meta: ', meta)
        return (
            <img className={'h-full m-auto'} src={meta.previewUrl}/>
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
            InputComponent={myInput}
            LayoutComponent={myLayout}
            PreviewComponent={myPreview}
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept="image/*"
        />
    )
}