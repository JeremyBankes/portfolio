interface Line {
    width: number;
    height: number;
    deltaWidth: number;
    deltaHeight: number;
    target: number;
    color: string;
}

export class Wallpaper {

    private _context: CanvasRenderingContext2D;
    private _lineHeight: number;
    private _spacing: number;
    private _lines: Line[];

    public constructor(canvas: HTMLCanvasElement) {
        this._context = canvas.getContext("2d");
        this._lineHeight = this._getLineHeight();
        this._spacing = this._lineHeight * 0.5;
        this._lines = [];

        this._onCanvasResize = this._onCanvasResize.bind(this);
        this._update = this._update.bind(this);

        window.addEventListener("resize", this._onCanvasResize);
        this._onCanvasResize();

        for (let i = 0; i < 30; i++) {
            this._spawnLine();
        }
    }

    public start() {
        let lastTime = performance.now();
        const receiveFrame: FrameRequestCallback = (time) => {
            this._update((time - lastTime) / 1000);
            lastTime = time;
            window.requestAnimationFrame(receiveFrame);
        };
        window.requestAnimationFrame(receiveFrame);
    }

    private _update(deltaTime: number) {
        this._context.save();
        this._context.clearRect(0, 0, this.width, this.height);
        this._context.globalAlpha = 0.25;
        const linesToRemove = [];
        let y = this._spacing;
        for (let i = 0; i < this._lines.length; i++) {
            const line = this._lines[i];
            const maximumLineWidth = this.width - this._spacing * 2;
            const lineWidth = Math.round(maximumLineWidth * line.width);
            const x = Math.round(this._spacing);
            line.width = Math.max(0, Math.min(1, line.width + line.deltaWidth * deltaTime));
            line.height = Math.max(0, Math.min(this._lineHeight, line.height + line.deltaHeight * deltaTime));
            if ((line.deltaWidth > 0 && line.width > line.target) || (line.deltaWidth < 0 && line.width < line.target)) {
                line.deltaWidth = 0;
            }
            if (line.height <= 0) {
                linesToRemove.push(i);
            }
            this._context.fillStyle = line.color;
            this._context.beginPath();
            this._context.roundRect(x, y, lineWidth, line.height - this._spacing * (line.height / this._lineHeight), this._lineHeight / 4);
            this._context.fill();
            y += line.height;
        }
        for (let i = 0; i < 3; i++) {
            if (Math.random() < 1 * deltaTime) {
                this._lines[i].deltaHeight = -50;
            }
        }

        for (let i = 0; i < linesToRemove.length; i++) {
            this._lines.splice(linesToRemove[i], 1);
        }
        for (let i = 0; i < linesToRemove.length; i++) {
            this._spawnLine();
        }
        this._context.restore();
    }

    private _onCanvasResize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    private _spawnLine() {
        const color = this._getRandomColor();
        const height = this._lineHeight;
        if (Math.random() < 0.25) {
            this._lines.push({ width: 0, height, deltaWidth: 0, deltaHeight: 0, target: 0, color });
        } else {
            const width = Math.random() / 4;
            const delta = Math.random() / 4;
            const target = delta > 0 ? Math.min(0.9, (1 - width) * Math.random()) : Math.max(0.1, width * Math.random());
            this._lines.push({ width, height, deltaWidth: delta, deltaHeight: 0, target, color });
        }
    }

    private _getRandomColor() {
        const colors = [
            "#6c99bb",
            "#b05279",
            "#9e86c8",
            "#e87d3e",
            "#b4d273",
            "#e5b567",
            "#d6d6d6",
            "#797979"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    public get canvas() {
        return this._context.canvas;
    }

    public get width() {
        return this.canvas.width;
    }

    public get height() {
        return this.canvas.height;
    }

    private _getLineHeight() {
        return parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
    }

}