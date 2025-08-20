export interface SpriteIconProps {
  id?: string;
  name?: string; // symbol id inside the sprite
  sprite?: string; // path to sprite file in /public
  className?: string;
  width?: number | string;
  height?: number | string;
  [key: string]: unknown;
}
