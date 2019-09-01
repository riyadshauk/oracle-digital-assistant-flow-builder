// @flow
import { type DiagramMappingStore } from '../reducerTypes/diagramMapping';
import {
  MAP_NODE_TO_POSITION,
  MAP_NODE_NAME_TO_ID,
  MAP_PORT_NAME_TO_ID,
  UNMAP_NAME_TO_ID,
} from '../actionTypes/diagramMapping';

const initialStore: DiagramMappingStore = {
  nameToID: {},
  idToPosition: {},
  lastNodeYPosition: 300,
};

export default (store: DiagramMappingStore = initialStore,
  action: { type: string, payload: { [key: string]: any } }) => {
  const { type, payload } = action;
  switch (type) {
    case MAP_NODE_TO_POSITION: {
      const { node } = payload;
      node.x = 25;
      node.y = store.lastNodeYPosition;
      return {
        ...store,
        idToPosition: {
          ...store.idToPosition,
          [node.id]: { x: node.x, y: store.lastNodeYPosition ? store.lastNodeYPosition : 0 },
        },
        lastNodeYPosition: store.lastNodeYPosition + 250,
      };
    }
    case MAP_NODE_NAME_TO_ID: {
      const { node } = payload;
      return {
        ...store,
        nameToID: { ...store.nameToID, [node.name]: node.id },
      };
    }
    case MAP_PORT_NAME_TO_ID: {
      const { port } = payload;
      return {
        ...store,
        nameToID: { ...store.nameToID, [port.name]: port.id },
      };
    }
    case UNMAP_NAME_TO_ID: {
      const { node } = payload;
      delete store.nameToID[node.name];
      return { ...store };
    }
    default:
      return store;
  }
};