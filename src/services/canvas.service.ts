import Path from 'path';
import imageSize from 'image-size';
import { Canvas, CanvasRenderingContext2D, createCanvas, Image, loadImage } from 'canvas';
import { Buffer } from 'buffer';
import { ClippyInterface, LocalTemplateName } from '../api/clippy.interface';
import { readFileSync } from 'fs';

export class CanvasService {
  private readonly imgPath: string;

  private readonly canvasWidth: number;

  private readonly canvasHeight: number;

  private canvas: Canvas;

  private context: CanvasRenderingContext2D;

  private image: Image | undefined;

  private text: string;

  private readonly config: ClippyInterface;

  constructor(imgName: LocalTemplateName, text: string) {
    this.imgPath = Path.join(__dirname, '..', 'assets', 'img', `${imgName}.png`);
    this.text = text;
    this.config = JSON.parse(readFileSync(Path.join(__dirname, '..', 'assets', 'clippy.json')).toString()).find(
      (item: ClippyInterface) => item.name === imgName
    );

    const dimensions = imageSize(this.imgPath);
    this.canvasWidth = dimensions.width!;
    this.canvasHeight = dimensions.height!;
    this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
    this.context = this.canvas.getContext('2d');
  }

  async loadImage(): Promise<void> {
    if (this.config.whiteBackground) {
      this.context.fillStyle = '#fff';
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    this.image = await loadImage(this.imgPath);
    this.context.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
  }

  addText(): void {
    this.context.fillStyle = this.config.color;
    this.context.font = this.config.style;
    this.context.rotate(this.config.rotate);
    this.wrapText();
  }

  private wrapText(
    maxHeight: number = Infinity // implement logic
  ): void {
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

  exportAsBuffer(): Buffer {
    return this.canvas.toBuffer();
  }
}
