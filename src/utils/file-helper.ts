import { pipe } from './pipe';
import Path from 'path';
import { readFileSync } from 'fs';
import { toString } from './to-string';

export abstract class FileHelper {

  static parseToJSON(...path: string[]) {
    return pipe(
      Path.join(...path),
      readFileSync,
      toString,
      JSON.parse
    );
  }
}
