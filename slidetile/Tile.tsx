import * as React from "react";
import { useState, useEffect } from "react";
import {
  SortableContainer,
  SortableElement,
  SortEndHandler,
  SortEvent
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { SortEnd } from "react-sortable-hoc";
import { ITileProps } from "./Interfaces";

export default function Tile(props: ITileProps): React.ReactElement {
  const tileArray = props.tiles.split(",");

  const textStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#fff",
    boxShadow: "0 0 5px rgba(0, 0, 0, .2)",
    backgroundColor: `${props.backgroundColour}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "150px"
  };

  const container: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gridGap: 20
  };

  const SortableItem = SortableElement(({ value }: { value: string }) => (
    <div style={textStyle}>{value}</div>
  ));

  const SortableList = SortableContainer(({ items }: { items: string[] }) => {
    return (
      <div style={container}>
        {items.map((value, index) => (
          <SortableItem key={`tile-${index}`} index={index} value={value} />
        ))}
      </div>
    );
  });

  if (props.tileSize) {
    textStyle.height = `${props.tileSize}px`;
    container.gridTemplateColumns = `repeat(auto-fill, minmax(${props.tileSize}px, 1fr))`;
  }
  const [tiles, setTiles] = useState<string[]>(tileArray);
  useEffect(() => setTiles(tileArray), [props.tiles]);

  const onSortEnd: SortEndHandler = (sort: SortEnd, event: SortEvent) => {
    const newTiles = arrayMove(tiles, sort.oldIndex, sort.newIndex);
    setTiles(newTiles);
    if (props.onTileReordered) {
      props.onTileReordered(newTiles);
    }
  };

  return (
    <SortableList items={tiles} onSortEnd={onSortEnd} lockAxis="x" axis="x" />
  );
}
