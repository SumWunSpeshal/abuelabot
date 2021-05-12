import Path from 'path';
import imageSize from 'image-size';
import { Canvas, CanvasRenderingContext2D, createCanvas, Image, loadImage } from 'canvas';
import { Buffer } from 'buffer';
import { ClippyInterface, LocalTemplateName } from '../api/clippy.interface';
import { readFileSync } from 'fs';

const CONFIG = JSON.parse(readFileSync(Path.join(__dirname, '..', 'assets', 'clippy.json')).toString());

export abstract class CanvasService {
  private static imgPath: string;

  private static canvasWidth: number;

  private static canvasHeight: number;

  private static canvas: Canvas;

  private static context: CanvasRenderingContext2D;

  private static image: Image;

  private static text: string;

  private static config: ClippyInterface;

  static async init(imgName: LocalTemplateName, text: string): Promise<Buffer> {
    this.imgPath = Path.join(__dirname, '..', 'assets', 'img', `${imgName}.png`);
    this.text = text;
    this.config = CONFIG.find((item: ClippyInterface) => item.name === imgName);

    this.setupCanvas();
    await this.loadImage();
    this.addText();

    return this.canvas.toBuffer();
  }

  private static setupCanvas() {
    const dimensions = imageSize(this.imgPath);
    this.canvasWidth = dimensions.width!;
    this.canvasHeight = dimensions.height!;
    this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
    this.context = CanvasService.canvas.getContext('2d');
  }

  private static async loadImage(): Promise<void> {
    if (this.config.whiteBackground) {
      this.context.fillStyle = '#fff';
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    this.image = await loadImage(this.imgPath);
    this.context.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
  }

  private static addText(): void {
    this.context.fillStyle = this.config.color;
    this.context.font = this.config.style;
    this.context.rotate(this.config.rotate);
    this.wrapText();
  }

  private static wrapText(): void {
    const words = this.text.split(' ');
    let line = '';
    let y = this.config.y;
    let x = this.config.x;

    words.forEach((word, index) => {
      const testLine = line + word + ' ';
      const metrics = this.context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > this.config.maxWidth && index > 0) {
        this.context.fillText(line, x, y);
        line = word + ' ';
        y += this.config.lineHeight;
      } else {
        line = testLine;
      }
    });

    this.context.fillText(line, x, y);
  }
}
