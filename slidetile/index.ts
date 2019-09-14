import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Tile, { ITileProps } from "./Tile";

export class SlideTile
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _tiles: string[];
  private _notifyOutputChanged: () => void;
  private _props: ITileProps = {
    tiles: "",
    backgroundColour: null
  };
  private onTileReordered(tiles: string[]) {
    this._tiles = tiles;
    this._notifyOutputChanged();
  }
  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    // Add control initialization code
    context.mode.trackContainerResize(true);

    this._container = container;
    this._context = context;
    this._props.onTileReordered = this.onTileReordered.bind(this);
    this._notifyOutputChanged = notifyOutputChanged;
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Add code to update control view
    if (this._context.parameters.tiles.raw! == "val") {
      this._props.tiles = "a,b,c,d,e,f";
    } else {
      this._props.tiles = this._context.parameters.tiles.raw!;
    }
    this._props.backgroundColour = this._context.parameters.backgroundColour.raw;
    ReactDOM.render(React.createElement(Tile, this._props), this._container);
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return { tilesOutput: this._tiles.join(",") };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
    ReactDOM.unmountComponentAtNode(this._container);
  }
}
