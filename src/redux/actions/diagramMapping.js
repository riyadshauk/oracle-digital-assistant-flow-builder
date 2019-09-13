// @flow
import { NodeModel, LinkModel, PortModel } from 'storm-react-diagrams';
import {
  MAP_NODE_TO_POSITION,
  MAP_NODE_NAME_TO_ID,
  MAP_PORT_NAME_TO_ID,
  UNMAP_NAME_TO_ID,
  SET_SELECTED_LINK,
  MAP_LINK_TO_NODE_PAIR,
  MARK_ID_INVISIBLE,
  MARK_ID_VISIBLE,
} from '../actionTypes/diagramMapping';

export const mapNodeToPosition = (node: NodeModel) => ({
  type: MAP_NODE_TO_POSITION,
  payload: { node },
});

export const mapNodeNameToID = (node: NodeModel) => ({
  type: MAP_NODE_NAME_TO_ID,
  payload: { node },
});

export const mapPortNameToID = (port: PortModel) => ({
  type: MAP_PORT_NAME_TO_ID,
  payload: { port },
});

export const mapLinkToNodePair = (link: LinkModel, node1: NodeModel, node2: NodeModel) => ({
  type: MAP_LINK_TO_NODE_PAIR,
  payload: { link, node1, node2 },
});

export const markIDInvisible = (id: string) => ({
  type: MARK_ID_INVISIBLE,
  payload: { id },
});

export const markIDVisible = (id: string) => ({
  type: MARK_ID_VISIBLE,
  payload: { id },
});

export const unmapNameToID = (node: NodeModel) => ({
  type: UNMAP_NAME_TO_ID,
  payload: { node },
});

export const setSelectedLink = (link: LinkModel) => ({
  type: SET_SELECTED_LINK,
  payload: { link },
});