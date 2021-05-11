export type LocalTemplateName = 'clippy' | 'hagrid' | 'jotaro' | 'keem' | 'plankton';

export interface ClippyInterface {
  name: LocalTemplateName;
  style: string;
  color: string;
  lineHeight: number;
  x: number;
  y: number;
  maxWidth: number;
  whiteBackground: boolean;
  rotate: number;
}
