import React, {useEffect, useLayoutEffect, useState} from "react";
import ReactImageAnnotate from "@searpent/react-image-annotate";
import BBoxAnnotator from "../components/annotate/BBoxAnnotator";

export const Labelling = () => {
    const labels = ['Cow', 'Sheep']
    const [entries, setEntries] = useState([])


    return (
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy min-h-screen'}>
            <div className={'max-w-full'}>
                <BBoxAnnotator
                    url="https://pixabay.com/get/g396ac33c362e493be8c255d338478988316994ed871f854dd1f61778dd47d563e9857337f8129c30044dc72136094b7e599e70f0a62432d6e0e232794d2e5f3f_640.jpg"
                    inputMethod="select"
                    labels={labels}
                    onChange={(e) => setEntries(e)}
                />
            </div>
            <pre>{JSON.stringify(entries)}</pre>
        </div>
    );
}