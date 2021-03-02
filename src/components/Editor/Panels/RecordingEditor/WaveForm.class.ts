// Default Data

const defaultData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

// Default Styles

const fillStyle = '#B1B1B1';
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

// Types

interface WorkingDeciIndex {
    secs: number;
    decis: number;
    centFreqs: number[];
}

class WaveForm {
    // Canvas and FreqArray
    private _canvas: HTMLCanvasElement;
    private _canvasCtx: CanvasRenderingContext2D;
    private _freqArray: Uint8Array | null = null

    // Settings
    private _freqBuffer = 5;

    // Draw Data
    private _drawLen = 0;
    private _workingDeciIndex: WorkingDeciIndex | null = null;

    // Freq Data
    private _freqData: number[][] = [];

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        const context = canvas.getContext("2d");
        if (!context) throw new Error('Canvas has already been given a different context.');
        this._canvasCtx = context;
    }

    /* 
    *   Private Methods
    */

    // Utility Methods

    private _clearCanvas() {
        this._canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    private _resetCount() {
        //
    }

    private _rescaleCanvas(stamps: number) {
        const offsetWidth = (canvasOffset * 2) + (stamps * secWidth);

        const scale = window.devicePixelRatio;
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

    // Draw methods

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
        this._canvasCtx.strokeStyle = fillStyle;
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

    private _drawDeciSecond(secs: number, decis: number, freq: number) {
        const x = (secs * secWidth) + (decis * deciSecWidth) + canvasOffset;
        const y = stampHeight + 25;
        // TODO: draw the deciSecond wave segement
        this._canvasCtx.fillStyle = fillStyle;
        this._canvasCtx.rect(x, y, deciSecWidth, 25);
        this._canvasCtx.fill();
    }

    // Manager temporary working data

    private _createWorkingDeciIndex(secs: number, decis: number) {
        this._workingDeciIndex = {
            secs,
            decis,
            centFreqs: Array.from({length: 10}, () => 0)
        }
    }

    private _isInWorkingDeciIndex(secs: number, decis: number) {
        return Boolean(
            this._workingDeciIndex && 
            this._workingDeciIndex.secs === secs && 
            this._workingDeciIndex.decis === decis
        );
    }

    private _commitWorkingDeciIndex() {
        if (!this._workingDeciIndex) throw new Error('commitWorkingDeciIndex was called without data.');

        const { secs, decis, centFreqs } = this._workingDeciIndex;

        const decFreqAvg = centFreqs.reduce((prev, next) => prev + next, 0)/centFreqs.length;

        if (!this._freqData[secs]) throw new Error('secIndex missing for this workingDeciIndex');
        if (this._freqData[secs][decis]) {
            this._freqData[secs][decis] = decFreqAvg;
        } else {
            if (this._freqData[secs].length < decis - 1) throw new Error('workingDeciIndex is out of sync with freqData');
            this._freqData[secs].push(decFreqAvg);
        }

        this._drawDeciSecond(secs, decis, decFreqAvg);
        this._workingDeciIndex = null;
    }

    /* 
    *   Public Methods
    */

    public drawFrequencyData(): void {
        this._drawLen = this._freqData.length + this._freqBuffer;

        this._rescaleCanvas(this._drawLen);

        this._freqData.forEach((deciArray, i) => {
            this._drawSecond(secWidth * i, this._getStamp(i));
        });

        for (let i=this._freqData.length; i<this._drawLen; i++) {
            this._drawSecond(secWidth * i, this._getStamp(i));
        }
    }

    public addFrequencyPoint(secs: number, analyser: AnalyserNode): void {
        // Get the insertion index for freqData
        const split = (secs + "").split(".");
        const secIndex = +(split[0]);
        const decIndex = split[1] ? +(split[1].charAt(0)) : 0;
        const centIndex = split[1] && split[1].charAt(1) ? +(split[1].charAt(1)) : 0;

        // Get the frequency point
        if (!this._freqArray || this._freqArray.length !== analyser.frequencyBinCount) {
            this._freqArray = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(this._freqArray);
        const freqAvg = this._freqArray.reduce((prev, curr) => prev + curr, 0)/this._freqArray.length;

        // Fill missing indexes if required and create data point for this second
        if (!this._freqData[secIndex]) {
            for (let i=0; i<=secIndex-this._freqData.length; i++) {
                this._freqData.push(Array.from({length: 10}, () => 0));
                // TODO: Draw extra seconds layout
            }

            this._freqData.push(Array.from({length: decIndex}, () => 0));
            this._drawLen += 1;
            this._rescaleCanvas(this._drawLen);
            this._drawSecond(this._drawLen * this._drawLen - 1, this._getStamp(this._drawLen - 1));
        }

        // Commit working record if exists and create a new one if needed
        if (!this._isInWorkingDeciIndex(secIndex, decIndex)) {
            if (this._workingDeciIndex) this._commitWorkingDeciIndex();
            this._createWorkingDeciIndex(secIndex, decIndex);
        }

        // Add the freqPoint to the working record
        if (!this._workingDeciIndex) throw new Error('workingDeciIndex missing at add time.');
        this._workingDeciIndex.centFreqs[centIndex] = freqAvg;
    }

    /* 
    *   Public Getters / Setters
    */

    get frequencyData(): number[][] {
        return this._freqData;
    }

    set frequencyData(data: number[][]) {
        this._freqData = data;
    }
}

export default WaveForm;