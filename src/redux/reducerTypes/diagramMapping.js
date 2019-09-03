import { LinkModel } from 'storm-react-diagrams';

// @flow
export type DiagramMappingStore = {
  nameToID: {},
  idToPosition: {},
  lastNodeYPosition: number,
  selectedLink: LinkModel,
};