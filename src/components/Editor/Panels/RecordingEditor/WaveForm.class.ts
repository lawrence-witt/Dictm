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

interface Buffer {
    secs: number;
    decis: number;
    buffer: number[];
}

type BufferMap = Map<string, Buffer>;

class WaveForm {
    private _canvas: HTMLCanvasElement;
    private _canvasCtx: CanvasRenderingContext2D;

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
    public get decisecondWidth(): number { return this.secondWidth/10; }

    public secondMarkHeight = 6;
    public decisecondMarkHeight = 3;
    public markWidth = 1.0;
    public get markGap(): number { return this.secondWidth/5; }

    // Draw Data
    private _nullFrequency = 200;
    private _drawLen = 0;
    private _bufferMap: BufferMap = new Map();

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

    /* * * * * * * * * * *\
    *   Utility Methods  *
    *\ * * * * * * * * * */ 

    private _getStamp(secs: number) {
        const addZero = (n: number) => n < 10 ? `0${n}`: `${n}`;
        const m = addZero(Math.floor(secs / 60));
        const s = addZero(secs % 60);

        return `${m}:${s}`;
    }

    private _getMean(array: number[] | Uint8Array) {
        if (Array.isArray(array)) {
            return array.reduce((p, c) => p + c, 0)/array.length;
        } else {
            return array.reduce((p, c) => p + c, 0)/array.length; // Thanks TypeScript...
        }
        
    }

    /* * * * * * * * * * *\
    *   Canvas Methods   *
    *\ * * * * * * * * * */ 

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

    private _clearCanvas() {
        this._canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    private _drawSecond(secs: number) {
        const drawStamp = (secs: number) => {
            const stamp = this._getStamp(secs);

            const x = (secs * this.secondWidth) + this.offsetWidth;
            const y = this.tapeHeight - this.decisecondWidth;

            this._canvasCtx.fillStyle = this.textStyle;
            this._canvasCtx.font = this.font;
            this._canvasCtx.textAlign = "center";
            this._canvasCtx.fillText(stamp, x, y);
        }

        const drawMark = (isSec: boolean, x: number, y: number) => {
            this._canvasCtx.moveTo(x, y);
            this._canvasCtx.lineTo(x, y + (isSec ? this.secondMarkHeight : this.decisecondMarkHeight));
        }

        const drawMarkRange = (secs: number) => {
            const x = (secs * this.secondWidth) + this.offsetWidth;
    
            this._canvasCtx.beginPath();
            this._canvasCtx.strokeStyle = this.markStyle;
            this._canvasCtx.lineWidth = this.markWidth;
            for (let i=0; i<5; i++) {
                drawMark(i === 0, x + (i * this.markGap), this.tapeHeight);
            }
            this._canvasCtx.stroke();
        }

        drawStamp(secs);
        drawMarkRange(secs);
    }

    private _drawDecisecond(secs: number, decis: number, freq: number) {
        const offsetHeight = Math.max(this.secondMarkHeight, this.decisecondMarkHeight);
        const useableHeight = this.waveHeight - (offsetHeight * 2);

        const w = this.decisecondWidth - 2;
        const x = (secs * this.secondWidth) + (decis * this.decisecondWidth) + this.offsetWidth + 1;

        let h = Math.floor(((freq/255) * useableHeight));
        if (useableHeight % 2 !== 0 && h % 2 === 0) h += 1;
        if (useableHeight % 2 === 0 && h % 2 !== 0) h += 1;
        const y = this.tapeHeight + (this.waveHeight/2) - (h/2);

        this._canvasCtx.fillStyle = this.waveStyle;
        this._canvasCtx.fillRect(x, y, w, h);
    }

    private _clearDecisecond(secs: number, decis: number) {
        const offsetHeight = Math.max(this.secondMarkHeight, this.decisecondMarkHeight);

        const w = this.decisecondWidth;
        const x = (secs * this.secondWidth) + (decis * this.decisecondWidth) + this.offsetWidth;
        const h = this.waveHeight - offsetHeight;
        const y = this.tapeHeight + offsetHeight;

        this._canvasCtx.clearRect(x, y, w, h);
    }

    /* * * * * * * * * * * * * * *\
    *   Data Management Methods  *
    *\ * * * * * * * * * * * * * */ 

    private _commitBuffer(predicate: (secs: number, decis: number) => boolean) {
        for (const [key, buffer] of this._bufferMap) {
            if (!predicate(buffer.secs, buffer.decis)) break;

            const secSlot = this._freqData[buffer.secs];
            if (!secSlot) break;
            const deciSlot = this._freqData[buffer.secs][buffer.decis];
            const value = this._getMean(buffer.buffer);

            if (deciSlot) {
                secSlot[buffer.decis] = value;
                this._clearDecisecond(buffer.secs, buffer.decis);
            } else {
                secSlot.push(value);
            }

            this._drawDecisecond(buffer.secs, buffer.decis, value);
            this._bufferMap.delete(key);
        }
    }

    private _fillSecond(second: number) {
        const secondData = this._freqData[second];

        if (!secondData) return;

        const fillStart = secondData.length;
        const fillRange = 10 - fillStart;
        const filled = [...secondData, ...Array.from({length: fillRange}, () => this._nullFrequency)];

        this._freqData[second] = filled;

        for (let i=0; i<fillRange; i++) {
            this._drawDecisecond(second, fillStart + i, this._nullFrequency);
        }
    }

    private _handleNewSecond(second: number) {
        const secondLen = this._freqData.length;
        const missingSeconds = second - secondLen;

        // Fill and draw any missing deciseconds in last second
        this._fillSecond(secondLen-1);

        // Fill and draw any missing seconds up to this second
        for (let i=0; i<missingSeconds; i++) {
            this._freqData.push([]);
            this._fillSecond(secondLen+i);
        }

        // Commit the new second
        this._drawLen += 1;
        this._freqData.push([]);
        this._rescaleCanvas(this._drawLen);
        this._drawSecond(this._drawLen - 1);
    }

    private _handleNewDecisecond(second: number, decisecond: number) {
        const decisecondLen = this._freqData[second].length;
        const missingDeciseconds = decisecond - decisecondLen;

        // Fill and draw any missing deciseconds in this second
        for (let i=0; i<missingDeciseconds; i++) {
            this._freqData[second].push(this._nullFrequency);
            this._drawDecisecond(second, decisecondLen + i, this._nullFrequency);
        }
    }

    /* * * * * * * * * * *\
    *   Public Methods   *
    *\ * * * * * * * * * */ 

    public draw(): void {
        this._clearCanvas();

        this._drawLen = this._freqData.length + this.secondBuffer;
        this._rescaleCanvas(this._drawLen);

        this._freqData.forEach((second, i) => {
            this._drawSecond(i);

            second.forEach((freq, j) => {
                this._drawDecisecond(i, j, freq);
            })
        });

        for (let i=this._freqData.length; i<this._drawLen; i++) {
            this._drawSecond(i);
        }
    }

    public buffer(secs: number, data: Uint8Array): void {
        // Get the insertion index for freqData
        const split = (secs + "").split(".");
        const second = +(split[0]);
        const decisecond = split[1] ? +(split[1].charAt(0)) : 0;
        const bufferKey = `${second}/${decisecond}`;

        // Average the data
        const freqMean = this._getMean(data);

        // Try to empty the buffer map up to this decisecond
        this._commitBuffer((secs, decis) => secs < second || secs === second && decis < decisecond);

        // Handle new second
        if (!this._freqData[second]) this._handleNewSecond(second);

        // Handle new decisecond
        if (!this._bufferMap.has(bufferKey)) {
            this._handleNewDecisecond(second, decisecond);

            this._bufferMap.set(bufferKey, {
                secs: second,
                decis: decisecond,
                buffer: []
            });
        } 

        // Add new data point to buffer
        const record = this._bufferMap.get(bufferKey);
        if (record) this._bufferMap.set(bufferKey, {
            ...record,
            buffer: record.buffer.concat(freqMean)
        });
    }

    public flush(hint?: number): void {
        const freqDecis = (() => {
            const secLen = (this._freqData.length - 1) * 10;
            const deciLen = secLen > 0 ? this._freqData[this._freqData.length-1].length : 0;
            return secLen + deciLen;
        })();

        const hintDecis = hint ? Math.floor(hint * 10) : 0;

        if (hint && (hintDecis > freqDecis)) {
            this.buffer(hint, new Uint8Array(1).fill(this._nullFrequency));
        }

        this._commitBuffer(() => true);
        this._bufferMap.clear();
    }

    /* * * * * * * * * * * * * * *\
    *   Public Getters/Setters   *
    *\ * * * * * * * * * * * * * */ 

    get frequencyData(): number[][] {
        return this._freqData;
    }

    set frequencyData(data: number[][]) {
        this._freqData = data;
    }
}

export default WaveForm;