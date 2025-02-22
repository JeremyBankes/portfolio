async function createShader(graphics, type, sourceUri) {
    const sourceCode = await fetch(sourceUri).then(response => response.text());
    const shader = graphics.createShader(type);
    graphics.shaderSource(shader, sourceCode);
    graphics.compileShader(shader);
    if (!graphics.getShaderParameter(shader, graphics.COMPILE_STATUS)) {
        const message = graphics.getShaderInfoLog(shader);
        graphics.deleteShader(shader);
        throw new Error(`Failed to compile shader! ${message}`);
    }
    return shader;
}

function parseColor(input) {
    if (input.startsWith("#")) {
        const colorSubstring = input.substring(1);
        const length = colorSubstring.length / 3;
        const factor = [17, 1, 0.062272][length - 1];
        const red = Math.round(parseInt(colorSubstring.substring(0, length), 16) * factor);
        const green = Math.round(parseInt(colorSubstring.substring(length, 2 * length), 16) * factor);
        const blue = Math.round(parseInt(colorSubstring.substring(2 * length, 3 * length), 16) * factor);
        return [red, green, blue];
    } else {
        return input.split("(")[1].split(")")[0].split(",").map(parseFloat);
    }
}

async function startRenderer(graphics, cursorPosition, vertexShaderUri, fragmentShaderUri) {
    const shaderProgram = graphics.createProgram();

    graphics.attachShader(shaderProgram, await createShader(graphics, graphics.VERTEX_SHADER, vertexShaderUri));
    graphics.attachShader(shaderProgram, await createShader(graphics, graphics.FRAGMENT_SHADER, fragmentShaderUri));
    graphics.linkProgram(shaderProgram);

    if (!graphics.getProgramParameter(shaderProgram, graphics.LINK_STATUS)) {
        throw new Error(`Failed to link Shader program! ${graphics.getProgramInfoLog(shaderProgram)}`);
    }

    graphics.clearColor(0, 0, 0, 0);

    const vertices = [-1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0];

    const vertexBuffer = graphics.createBuffer();
    graphics.bindBuffer(graphics.ARRAY_BUFFER, vertexBuffer);
    graphics.vertexAttribPointer(0, 2, graphics.FLOAT, false, 0, 0);
    graphics.enableVertexAttribArray(0);
    graphics.bufferData(graphics.ARRAY_BUFFER, new Float32Array(vertices), graphics.STATIC_DRAW);
    const timeUniformLocation = graphics.getUniformLocation(shaderProgram, "time");
    const cursorPositionUniformLocation = graphics.getUniformLocation(shaderProgram, "cursorPosition");
    const accentColorUniformLocation = graphics.getUniformLocation(shaderProgram, "accentColor");

    const cssAccentColor = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-special");
    const accentColor = parseColor(cssAccentColor);
    const accentColorUniform = accentColor.map((component) => component / 255);

    const start = performance.now();
    const update = (time) => {
        graphics.clear(graphics.COLOR_BUFFER_BIT);
        graphics.useProgram(shaderProgram);
        graphics.uniform1f(timeUniformLocation, (time - start) / 1000);
        graphics.uniform2f(cursorPositionUniformLocation, cursorPosition.x, cursorPosition.y);
        graphics.uniform3f(accentColorUniformLocation, ...accentColorUniform);
        graphics.drawArrays(graphics.TRIANGLES, 0, 6);
        window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
}

function isMobileUserAgent() {
    const mobileUserAgentExpressions = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    return mobileUserAgentExpressions.some((expression) => navigator.userAgent.match(expression));
}


window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("background");
    if (isMobileUserAgent()) {
        console.warn("Skipping rendering background on mobile.");
        canvas.classList.add("backgroundAnimation");
    } else {
        let canvasBounds = canvas.getBoundingClientRect();
        const cursorPosition = { x: 0.5, y: 0.5 };

        const context = canvas.getContext("webgl");
        if (context === null) {
            console.warn("Your browser does not appear to support WebGL!");
        } else {
            startRenderer(context, cursorPosition, "/shaders/background.vertex", "/shaders/background.fragment");
        }

        const resizeObserver = new ResizeObserver(([entry]) => {
            let width, height;
            if (entry.devicePixelContentBoxSize === undefined) {
                [{ inlineSize: width, blockSize: height }] = entry.contentBoxSize;
                width *= window.devicePixelRatio;
                height *= window.devicePixelRatio;
            } else {
                [{ inlineSize: width, blockSize: height }] = entry.devicePixelContentBoxSize;
            }
            canvas.width = width;
            canvas.height = height;
            context.viewport(0, 0, width, height);
        });

        window.addEventListener("mousemove", (event) => {
            cursorPosition.x = (event.clientX - canvasBounds.left) / canvasBounds.width;
            cursorPosition.y = 1.0 - (event.clientY - canvasBounds.top) / canvasBounds.height;
        });

        resizeObserver.observe(canvas);
    }
});