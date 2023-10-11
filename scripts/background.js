async function createShader(graphics, type, sourceUri) {
    const sourceCode = await fetch(sourceUri).then(response => response.text());
    const shader = graphics.createShader(type);
    graphics.shaderSource(shader, sourceCode);
    graphics.compileShader(shader);
    if (!graphics.getShaderParameter(shader, graphics.COMPILE_STATUS)) {
        graphics.deleteShader(shader);
        throw new Error(`Failed to compile shader! ${graphics.getShaderInfoLog(shader)}`);
    }
    return shader;
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

    const start = performance.now();
    const update = (time) => {
        graphics.clear(graphics.COLOR_BUFFER_BIT);
        graphics.useProgram(shaderProgram);
        graphics.uniform1f(timeUniformLocation, (time - start) / 1000);
        graphics.uniform2f(cursorPositionUniformLocation, cursorPosition.x, cursorPosition.y);
        graphics.drawArrays(graphics.TRIANGLES, 0, 6);
        window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
}

window.addEventListener("DOMContentLoaded", () => {
    const cursorPosition = { x: 0, y: 0 };
    const canvas = document.getElementById("background");
    const canvasBounds = canvas.getBoundingClientRect();
    window.addEventListener("mousemove", (event) => {
        const targetX = (event.clientX - canvasBounds.left) / canvasBounds.width;
        const targetY = 1.0 - (event.clientY - canvasBounds.top) / canvasBounds.height;
        cursorPosition.x = cursorPosition.x + (targetX - cursorPosition.x) / 16;
        cursorPosition.y = cursorPosition.y + (targetY - cursorPosition.y) / 16;
    });
    const graphics = canvas.getContext("webgl");
    if (graphics === null) {
        console.warn("Your browser does not appear to support WebGL!");
    } else {
        startRenderer(graphics, cursorPosition, "/shaders/background.vertex", "/shaders/background.fragment");
    }
});