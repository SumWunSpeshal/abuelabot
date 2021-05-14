import Path from 'path';
import imageSize from 'image-size';
import { Canvas, CanvasRenderingContext2D, createCanvas, Image, loadImage } from 'canvas';
import { Buffer } from 'buffer';
import { ClippyInterface, LocalTemplateName } from '../api/clippy.interface';
import { readFileSync } from 'fs';

const IMG_CONFIG = JSON.parse(readFileSync(Path.join(__dirname, '..', 'assets', 'clippy.json')).toString());

export abstract class CanvasService {
  private static imgPath: string;

  private static canvasWidth: number;

  private static canvasHeight: number;

  private static _canvas: Canvas;

  private static _context: CanvasRenderingContext2D;

  private static image: Image;

  private static text: string;

  private static _config: ClippyInterface;

  static async init(imgName: LocalTemplateName, text: string): Promise<Buffer> {
    this.imgPath = Path.join(__dirname, '..', 'assets', 'img', `${imgName}.png`);
    this.text = text;
    this._config = IMG_CONFIG.find((item: ClippyInterface) => item.name === imgName);

    this.setupCanvas();
    await this.loadImage();
    this.addText();

    return this._canvas.toBuffer();
  }

  private static setupCanvas() {
    const dimensions = imageSize(this.imgPath);
    this.canvasWidth = dimensions.width!;
    this.canvasHeight = dimensions.height!;
    this._canvas = createCanvas(this.canvasWidth, this.canvasHeight);
    this._context = CanvasService._canvas.getContext('2d');
  }

  private static async loadImage(): Promise<void> {
    if (this._config.whiteBackground) {
      this._context.fillStyle = '#fff';
      this._context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    this.image = await loadImage(this.imgPath);
    this._context.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
  }

  private static addText(): void {
    this._context.fillStyle = this._config.color;
    this._context.font = this._config.style;
    this._context.rotate(this._config.rotate);
    this.wrapText();
  }

  private static wrapText(): void {
    const words = this.text.split(' ');
    let line = '';
    let y = this._config.y;
    let x = this._config.x;

    words.forEach((word, index) => {
      const testLine = line + word + ' ';
      const metrics = this._context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > this._config.maxWidth && index > 0) {
        this._context.fillText(line, x, y);
        line = word + ' ';
        y += this._config.lineHeight;
      } else {
        line = testLine;
      }
    });

    this._context.fillText(line, x, y);
  }

  static get config(): ClippyInterface {
    return this._config;
  }

  static set config(value: ClippyInterface) {
    this._config = value;
  }
  static get context(): CanvasRenderingContext2D {
    return this._context;
  }

  static set context(value: CanvasRenderingContext2D) {
    this._context = value;
  }
  static get canvas(): Canvas {
    return this._canvas;
  }

  static set canvas(value: Canvas) {
    this._canvas = value;
  }
}
