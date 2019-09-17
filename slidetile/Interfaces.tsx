export interface ITileProps {
  tiles: string;
  backgroundColour: string | null;
  tileSize: number | null;
  onTileReordered?: (tiles: string[]) => void;
}
