import React, { useRef, useEffect } from "react";

export function Background() {
    const canvasReference = useRef(null);

    console.log("But this does");
    useEffect(() => {
        console.log("This never happens");
        if (canvasReference.current !== null) {
            const canvas = canvasReference.current;
            console.log(canvas);
        }
    }, [canvasReference.current]);

    return <canvas ref={canvasReference} />
}