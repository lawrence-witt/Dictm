// Default Data

const defaultData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

// Default Styles

const strokeStyle = '#B1B1B1';
const textStyle = '#000000';

// Default Dimensions

const canvasOffset = 15;

const stampHeight = 25;
const waveHeight = 225;

const secWidth = 60;
const deciSecWidth = secWidth/10;

const markGap = secWidth/5;
const secMarkHeight = 6;
const deciMarkHeight = 3;
const markWidth = 1.0;

const font = '11px Roboto';

class WaveForm {
    // Canvas and Analyser
    private _canvas: HTMLCanvasElement;
    private _canvasCtx: CanvasRenderingContext2D;
    private _freqArray: Uint8Array;
    private _analyser: any;

    // Data
    private _stampMap: number[][] = defaultData;

    constructor(canvas: HTMLCanvasElement, analyser: any) {
        this._canvas = canvas;
        this._canvasCtx = canvas.getContext("2d");
        this._freqArray = new Uint8Array(analyser.frequencyBinCount);
        this._analyser = analyser;
    }

    /* 
    *   Private Methods
    */

    private _clearCanvas() {
        this._canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    private _resetCount() {
        //
    }

    private _rescaleCanvas(stamps: number) {
        const offsetWidth = (canvasOffset * 2) + (stamps * secWidth);

        const scale = devicePixelRatio;
        const { height } = this._canvas.getBoundingClientRect();

        this._canvas.width = Math.floor(offsetWidth * scale);
        this._canvas.height = Math.floor(height * scale);
        this._canvasCtx.scale(scale, scale);
        this._canvas.style.width = offsetWidth + 'px';
        this._canvas.style.height = height + 'px';
    }

    private _getStamp(secIndex: number) {
        const addZero = (n: number) => n < 10 ? `0${n}`: `${n}`;
        const mins = addZero(Math.floor(secIndex / 60));
        const secs = addZero(secIndex % 60);

        return `${mins}:${secs}`;
    }

    private _drawStamp(stamp: string, x: number, y: number) {
        x += canvasOffset;
        this._canvasCtx.fillStyle = textStyle;
        this._canvasCtx.font = font;
        this._canvasCtx.textAlign = "center";
        this._canvasCtx.fillText(stamp, x, y);
    }

    private _drawMark(sec: boolean, x: number, y: number) {
        x += canvasOffset;
        this._canvasCtx.beginPath();
        this._canvasCtx.strokeStyle = strokeStyle;
        this._canvasCtx.lineWidth = markWidth;
        this._canvasCtx.moveTo(x, y);
        this._canvasCtx.lineTo(x, y + (sec ? secMarkHeight : deciMarkHeight));
        this._canvasCtx.stroke();
    }

    private _drawSecond(x: number, stamp: string) {
        this._drawStamp(stamp, x, stampHeight - deciMarkHeight);

        for (let i=0; i<5; i++) {
            this._drawMark(i === 0, x + (i * markGap), stampHeight);
        }
    }

    /* 
    *   Public Methods
    */

    public drawStampMap(): void {
        this._rescaleCanvas(this._stampMap.length);

        this._stampMap.forEach((deciArray, i) => {
            this._drawSecond(secWidth * i, this._getStamp(i));
        });
    }

    /* 
    *   Public Setters
    */

    set stampMap(map: number[][]) {
        this._stampMap = map;
    }
}

export default WaveForm;