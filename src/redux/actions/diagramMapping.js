// @flow
import { NodeModel } from 'storm-react-diagrams';
import {
  MAP_NODE_TO_POSITION,
  MAP_NODE_NAME_TO_ID,
  MAP_PORT_NAME_TO_ID,
  UNMAP_NAME_TO_ID,
} from '../actionTypes/diagramMapping';
import { AdvancedPortModel } from '../../AdvancedDiagramFactories';

export const mapNodeToPosition = (node: NodeModel) => ({
  type: MAP_NODE_TO_POSITION,
  payload: { node },
});

export const mapNodeNameToID = (node: NodeModel) => ({
  type: MAP_NODE_NAME_TO_ID,
  payload: { node },
});

export const mapPortNameToID = (port: AdvancedPortModel) => ({
  type: MAP_PORT_NAME_TO_ID,
  payload: { port },
});

export const unmapNameToID = (node: NodeModel) => ({
  type: UNMAP_NAME_TO_ID,
  payload: { node },
});