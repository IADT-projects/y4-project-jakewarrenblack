import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import { createUseStyles } from 'react-jss';
import { v4 as uuid } from 'uuid';
import BBoxSelector from '../BBoxSelector';
import LabelBox from '../LabelBox';

const useStyles = createUseStyles({
    bBoxAnnotator: {
        cursor: 'crosshair',
    },
    imageFrame: {
        position: 'relative',
        backgroundSize: '100%',
    },
});

const BBoxAnnotator = React.forwardRef(({ url, borderWidth = 2, inputMethod, labels, onChange }, ref) => {
    const classes = useStyles();
    const [pointer, setPointer] = useState(null);
    const [offset, setOffset] = useState(null);
    const [entries, setEntries] = useState([]);
    const [multiplier, setMultiplier] = useState(1);


    useEffect(() => {

        if(typeof(onChange) == "function"){
            onChange(entries.map((entry) => ({
                width: Math.round(entry.width * multiplier),
                height: Math.round(entry.height * multiplier),
                top: Math.round(entry.top * multiplier),
                left: Math.round(entry.left * multiplier),
                label: entry.label,
            })));
        }

    }, [entries, multiplier]);


    const [status, setStatus] = useState('free');
    const [imageFrameStyle, setImageFrameStyle] = useState({});
    const bBoxAnnotatorRef = useRef(null);
    const labelInputRef = useRef(null);

    useEffect(() => {
        const maxWidth = bBoxAnnotatorRef.current?.offsetWidth || 1;
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
            throw 'Invalid image URL: ' + url;
        };

    }, [url, multiplier, bBoxAnnotatorRef]);


    const crop = (pageX, pageY) => {
        return {
            x: bBoxAnnotatorRef.current && imageFrameStyle.width
                ? Math.min(Math.max(Math.round(pageX - bBoxAnnotatorRef.current.offsetLeft), 0), Math.round(imageFrameStyle.width - 1))
                : 0,
            y: bBoxAnnotatorRef.current && imageFrameStyle.height
                ? Math.min(Math.max(Math.round(pageY - bBoxAnnotatorRef.current.offsetTop), 0), Math.round(imageFrameStyle.height - 1))
                : 0,
        };
    };


    const updateRectangle = (pageX, pageY) => {
        setPointer(crop(pageX, pageY));
    };


    useEffect(() => {
        const mouseMoveHandler = (e) => {
            switch (status) {
                case 'hold':
                    updateRectangle(e.pageX, e.pageY);
            }
        };
        window.addEventListener('mousemove', mouseMoveHandler);
        return () => window.removeEventListener('mousemove', mouseMoveHandler);
    }, [status]);


    useEffect(() => {
        const mouseUpHandler = (e) => {
            switch (status) {
                case 'hold':
                    updateRectangle(e.pageX, e.pageY);
                    setStatus('input');
                    labelInputRef.current?.focus();
            }
        };
        window.addEventListener('mouseup', mouseUpHandler);
        return () => window.removeEventListener('mouseup', mouseUpHandler);
    }, [status, labelInputRef]);


    const addEntry = (label) => {
        setEntries([...entries, { ...rect, label, id: uuid(), showCloseButton: false }]);
        setStatus('free');
        setPointer(null);
        setOffset(null);
    };


    const mouseDownHandler = (e) => {
        switch (status) {
            case 'free':
            case 'input':
                if (e.button !== 2) {
                    setOffset(crop(e.pageX, e.pageY));
                    setPointer(crop(e.pageX, e.pageY));
                    setStatus('hold');
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
        return (
            <div className={'absolute text-red-500 border-red-500 border-2 absolute'} style={{
                top: `${entry.top - borderWidth}px`,
                left: `${entry.left - borderWidth}px`,
                width: `${entry.width}px`,
                height: `${entry.height}px`}}
                key={i}
                //onMouseOver={() => setEntries((prevEntries) => prevEntries.map((e) => (e.id === entry.id ? { ...e, showCloseButton: true } : e)))}
                //onMouseLeave={() => setEntries((prevEntries) => prevEntries.map((e) => (e.id === entry.id ? { ...e, showCloseButton: false } : e)))}
                >
                 <div
                     className={'border-white border-2 select-none text-white text-center cursor-pointer overflow-hidden bg-[#030] absolute'}
                     style={{
                        top: '-8px',
                        right: '-8px',
                        width: '16px',
                        height: '0',
                        padding: '16px 0 0 0',
                        borderRadius: '18px',
                    }}
                     onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                     onClick={() => {
                        setEntries(entries.filter((e) => e.id !== entry.id));
                    }}>
                    <div className={'block text-center absolute'} style={{width: '16px', top: '-2px', left: '0', fontSize: '16px', lineHeight: '16px',}}>
                        &#215;
                    </div>
                </div>

                <div style={{ overflow: 'hidden' }}>
                    {entry.label}
                </div>
            </div>
        )
    }

    const rect = rectangle();

    return (
        <div className={classes.bBoxAnnotator} style={{width: `auto`, height: `100%`,}} ref={bBoxAnnotatorRef} onMouseDown={mouseDownHandler}>
            <div className={classes.imageFrame} style={{width: `auto`, height: `100%`, backgroundRepeat: 'no-repeat', backgroundImage: `url(${imageFrameStyle.backgroundImageSrc})`,}}>
                {status === 'hold' || status === 'input' ? <BBoxSelector rectangle={rect}/> : null}

                {status === 'input' ? (<LabelBox inputMethod={inputMethod} top={rect.top + rect.height + borderWidth} left={rect.left - borderWidth} labels={labels} onSubmit={addEntry} ref={labelInputRef}/>) : null}

                {entries.map((entry, i) => entryItem(entry, i))}
            </div>
        </div>
    )
});
export default BBoxAnnotator;