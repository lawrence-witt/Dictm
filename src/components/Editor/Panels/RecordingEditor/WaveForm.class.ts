// Types

type WaveFormOptions = {
    textStyle: string;
    markStyle: string;
    waveStyle: string;
    font: string;
    offsetWidth: number;
    tapeHeight: number;
    waveHeight: number;
    markWidth: number;
    secondBuffer: number;
    secondWidth: number;
    secondMarkHeight: number;
    deciSecondMarkHeight: number;
}

interface WorkingDeciIndex {
    secs: number;
    decis: number;
    centFreqs: number[];
}

class WaveForm {
    private _canvas: HTMLCanvasElement;
    private _canvasCtx: CanvasRenderingContext2D;
    private _freqArray: Uint8Array | null = null

    // Settings
    public textStyle = '#000000';
    public markStyle = '#B1B1B1';
    public waveStyle = '#B1B1B1';
    public font = '11px sans-serif';

    public offsetWidth = 15;
    public tapeHeight = 25;
    public waveHeight = 225;

    public secondBuffer = 0;

    public secondWidth = 50;
    public get deciSecondWidth(): number { return this.secondWidth/10; }

    public secondMarkHeight = 6;
    public deciSecondMarkHeight = 3;
    public markWidth = 1.0;
    public get markGap(): number { return this.secondWidth/5; }

    // Draw Data
    private _drawLen = 0;
    private _workingDeciIndex: WorkingDeciIndex | null = null;

    // Freq Data
    private _freqData: number[][] = [];

    // Validate and Construct
    constructor(canvas: HTMLCanvasElement, options?: Partial<WaveFormOptions>) {
        this._canvas = canvas;
        const context = canvas.getContext("2d");
        if (!context) throw new Error('WaveForm supplied with Canvas already using a different context.');
        this._canvasCtx = context;

        if (options) {
            const invalid = Object.keys(options).find(opt => !(opt in this));
            if (invalid) throw new Error(`WaveForm supplied with invalid option: ${invalid}.`);
            Object.assign(this, options);
        }
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

    // TODO: Convert this to drawImage as the consensus seem to be it improves performance
    private _rescaleCanvas(stamps: number) {
        // Save the previous canvas
        const prevW = this._canvas.width;
        const prevH = this._canvas.height;
        const temp = this._canvasCtx.getImageData(0, 0, prevW, prevH);

        // Get new dimensions
        const scale = window.devicePixelRatio;
        const offsetWidth = (this.offsetWidth * 2) + (stamps * this.secondWidth);
        const { height } = this._canvas.getBoundingClientRect();

        // Apply dimensions and previous canvas
        this._canvas.width = Math.floor(offsetWidth * scale);
        this._canvas.height = Math.floor(height * scale);
        this._canvasCtx.scale(scale, scale);
        this._canvas.style.width = offsetWidth + 'px';
        this._canvas.style.height = height + 'px';
        this._canvasCtx.putImageData(temp, 0, 0);
    }

    private _getStamp(secIndex: number) {
        const addZero = (n: number) => n < 10 ? `0${n}`: `${n}`;
        const mins = addZero(Math.floor(secIndex / 60));
        const secs = addZero(secIndex % 60);

        return `${mins}:${secs}`;
    }

    // Draw methods

    private _drawStamp(stamp: string, x: number, y: number) {
        x += this.offsetWidth;
        this._canvasCtx.fillStyle = this.textStyle;
        this._canvasCtx.font = this.font;
        this._canvasCtx.textAlign = "center";
        this._canvasCtx.fillText(stamp, x, y);
    }

    private _drawMark(sec: boolean, x: number, y: number) {
        x += this.offsetWidth;
        this._canvasCtx.beginPath();
        this._canvasCtx.strokeStyle = this.markStyle;
        this._canvasCtx.lineWidth = this.markWidth;
        this._canvasCtx.moveTo(x, y);
        this._canvasCtx.lineTo(x, y + (sec ? this.secondMarkHeight : this.deciSecondMarkHeight));
        this._canvasCtx.stroke();
    }

    private _drawSecond(x: number, stamp: string) {
        this._drawStamp(stamp, x, this.tapeHeight - this.deciSecondMarkHeight);

        for (let i=0; i<5; i++) {
            this._drawMark(i === 0, x + (i * this.markGap), this.tapeHeight);
        }
    }

    private _drawDeciSecond(secs: number, decis: number, freq: number) {
        // Calculate dimensions
        const w = this.deciSecondWidth - 2;
        const x = (secs * this.secondWidth) + (decis * this.deciSecondWidth) + this.offsetWidth + 1;
        let h = Math.floor(((freq/255) * this.waveHeight));
        if (this.waveHeight % 2 !== 0 && h % 2 === 0) h += 1;
        if (this.waveHeight % 2 === 0 && h % 2 !== 0) h += 1;
        const y = this.tapeHeight + (this.waveHeight/2) - h/2;

        // Draw the segment
        this._canvasCtx.fillStyle = this.waveStyle;
        this._canvasCtx.rect(x, y, w, h);
        this._canvasCtx.fill();
    }

    // Manage temporary working data

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

        const decFreqAvg = Math.floor(centFreqs.reduce((prev, next) => prev + next, 0)/centFreqs.length);

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
        this._drawLen = this._freqData.length + this.secondBuffer;

        this._rescaleCanvas(this._drawLen);

        this._freqData.forEach((deciArray, i) => {
            this._drawSecond(this.secondWidth * i, this._getStamp(i));
        });

        for (let i=this._freqData.length; i<this._drawLen; i++) {
            this._drawSecond(this.secondWidth * i, this._getStamp(i));
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
            for (let i=0; i<secIndex-this._freqData.length; i++) {
                this._freqData.push(Array.from({length: 10}, () => 0));
                // TODO: Draw extra seconds layout
            }

            this._freqData.push(Array.from({length: decIndex}, () => 0));
            this._drawLen += 1;
            this._rescaleCanvas(this._drawLen);
            this._drawSecond(this.secondWidth * (this._drawLen - 1), this._getStamp(this._drawLen - 1));
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