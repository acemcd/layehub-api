```js
  import { TimeRange } from "./common";
  import { ILayer } from "./layers";
  export interface IFrame {
      width: number;
      height: number;
  }
  export interface IScene {
      id: string;
      frame: IFrame;
      name?: string;
      description?: string;
      layers: Partial<ILayer>[];
      metadata: Record<string, any>;
      preview?: string;
      duration?: number;
      display?: TimeRange;
  }

  export interface IDesign {
    id: string
    name: string
    frame: IFrame
    type: string
    scenes: any[]
    previews: { id: string; src: string }[]
    metadata: {}
    published: boolean
  }

  frame: {width,height},
  scene: {id, frame, layers, preview, ...rest}
  // designs are templates in scene format
  // scene is a page in a design

```

[] Design CRUD
[] Dark theme for frontend UI
[] Generating previews for all media types at upload time
