// @flow
/* eslint-disable no-param-reassign */
import * as _ from 'lodash';
import {
  BaseListener,
  BaseEntity,
  BaseEvent,
  BaseEntityType,
  DiagramEngine,
  NodeModel,
  PortModel,
  BaseModel,
  BaseModelListener,
  PointModel,
  LinkModel,
} from 'storm-react-diagrams';
// import LinkModel, { ExtendedLinkModelListener } from './LinkModel';

/**
 * The only reason I've adapted { DiagramModel } from 'storm-react-diagrams' here is essentially
 * to replace each occurrence of { LinkLabel } from 'storm-react-diagrams' with ModifiedLinkLabel.
 *
 * This allows my custom linking functionality, defined in ModifiedLinkLabel, to work
 * without breaking.
 */

/**
 * @author Dylan Vorster
 * @author Riyad Shauk
 */
export interface DiagramListener extends BaseListener {
  nodesUpdated?: (event: BaseEvent & { node: NodeModel; isCreated: boolean }) => void;

  linksUpdated?: (event: BaseEvent
    & { link: LinkModel<ExtendedLinkModelListener>; isCreated: boolean }) => void;

  // eslint-disable-next-line no-use-before-define
  offsetUpdated?: (event: BaseEvent<ModifiedDiagramModel>
    & { offsetX: number; offsetY: number }) => void;

  // eslint-disable-next-line no-use-before-define
  zoomUpdated?: (event: BaseEvent<ModifiedDiagramModel> & { zoom: number }) => void;

  // eslint-disable-next-line no-use-before-define
  gridUpdated?: (event: BaseEvent<ModifiedDiagramModel> & { size: number }) => void;
}

/**
 *
 */
export default class ModifiedDiagramModel extends BaseEntity<DiagramListener> {
  // models
  links: { [s: string]: LinkModel<ExtendedLinkModelListener> };

  nodes: { [s: string]: NodeModel };

  // control variables
  offsetX: number;

  offsetY: number;

  zoom: number;

  rendered: boolean;

  gridSize: number;

  constructor() {
    super();

    this.links = {};
    this.nodes = {};

    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 100;
    this.rendered = false;
    this.gridSize = 0;
  }

  setGridSize(size: number = 0) {
    this.gridSize = size;
    this.iterateListeners((listener, event) => {
      if (listener.gridUpdated) {
        listener.gridUpdated({ ...event, size });
      }
    });
  }

  getGridPosition(pos: number) {
    if (this.gridSize === 0) {
      return pos;
    }
    return this.gridSize * Math.floor((pos + this.gridSize / 2) / this.gridSize);
  }

  deSerializeDiagram(object: any, diagramEngine: DiagramEngine) {
    this.deSerialize(object, diagramEngine);

    this.offsetX = object.offsetX;
    this.offsetY = object.offsetY;
    this.zoom = object.zoom;
    this.gridSize = object.gridSize;

    // deserialize nodes
    _.forEach(object.nodes, (node: any) => {
      const nodeOb = diagramEngine.getNodeFactory(node.type).getNewInstance(node);
      nodeOb.setParent(this);
      nodeOb.deSerialize(node, diagramEngine);
      this.addNode(nodeOb);
    });

    // deserialze links
    _.forEach(object.links, (link: any) => {
      const linkOb = diagramEngine.getLinkFactory(link.type).getNewInstance();
      linkOb.setParent(this);
      linkOb.deSerialize(link, diagramEngine);
      this.addLink(linkOb);
    });
  }

  serializeDiagram() {
    return _.merge(this.serialize(), {
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      zoom: this.zoom,
      gridSize: this.gridSize,
      links: _.map(this.links, link => link.serialize()),
      nodes: _.map(this.nodes, node => node.serialize()),
    });
  }

  clearSelection(ignore: BaseModel<BaseEntity, BaseModelListener> | null = null) {
    _.forEach(this.getSelectedItems(), (element) => {
      if (ignore && ignore.getID() === element.getID()) {
        return;
      }
      element.setSelected(false); // TODO dont fire the listener
    });
  }

  getSelectedItems(...filters: BaseEntityType[]): BaseModel<BaseEntity, BaseModelListener>[] {
    if (!Array.isArray(filters)) {
      // eslint-disable-next-line no-param-reassign
      filters = [filters];
    }
    let items = [];

    // run through nodes
    items = items.concat(
      _.flatMap(this.nodes, node => node.getSelectedEntities()),
    );

    // find all the links
    items = items.concat(
      _.flatMap(this.links, link => link.getSelectedEntities()),
    );

    // find all points
    items = items.concat(
      _.flatMap(this.links, link => (
        _.flatMap(link.points, point => point.getSelectedEntities())
      )),
    );

    items = _.uniq(items);

    if (filters.length > 0) {
      items = _.filter(_.uniq(items), (item: BaseModel<any>) => {
        if (_.includes(filters, 'node') && item instanceof NodeModel) {
          return true;
        }
        if (_.includes(filters, 'link') && item instanceof LinkModel) {
          return true;
        }
        if (_.includes(filters, 'port') && item instanceof PortModel) {
          return true;
        }
        if (_.includes(filters, 'point') && item instanceof PointModel) {
          return true;
        }
        return false;
      });
    }

    return items;
  }

  setZoomLevel(zoom: number) {
    this.zoom = zoom;

    this.iterateListeners((listener, event) => {
      if (listener.zoomUpdated) {
        listener.zoomUpdated({ ...event, zoom });
      }
    });
  }

  setOffset(offsetX: number, offsetY: number) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.iterateListeners((listener, event) => {
      if (listener.offsetUpdated) {
        listener.offsetUpdated({ ...event, offsetX, offsetY });
      }
    });
  }

  setOffsetX(offsetX: number) {
    this.offsetX = offsetX;
    this.iterateListeners((listener, event) => {
      if (listener.offsetUpdated) {
        listener.offsetUpdated({ ...event, offsetX, offsetY: this.offsetY });
      }
    });
  }

  setOffsetY(offsetY: number) {
    this.offsetY = offsetY;

    this.iterateListeners((listener, event) => {
      if (listener.offsetUpdated) {
        listener.offsetUpdated({ ...event, offsetX: this.offsetX, offsetY: this.offsetY });
      }
    });
  }

  getOffsetY() {
    return this.offsetY;
  }

  getOffsetX() {
    return this.offsetX;
  }

  getZoomLevel() {
    return this.zoom;
  }

  getNode(node: string | NodeModel): NodeModel | null {
    if (node instanceof NodeModel) {
      return node;
    }
    if (!this.nodes[node]) {
      return null;
    }
    return this.nodes[node];
  }

  getLink(link: string
    | LinkModel<ExtendedLinkModelListener>): LinkModel<ExtendedLinkModelListener>
    | null {
    if (link instanceof LinkModel) {
      return link;
    }
    if (!this.links[link]) {
      return null;
    }
    return this.links[link];
  }

  addAll(...models: BaseModel[]): BaseModel[] {
    _.forEach(models, (model) => {
      if (model instanceof LinkModel) {
        this.addLink(model);
      } else if (model instanceof NodeModel) {
        this.addNode(model);
      }
    });
    return models;
  }

  // eslint-disable-next-line max-len
  addLink(link: LinkModel<ExtendedLinkModelListener>): LinkModel<ExtendedLinkModelListener> {
    link.addListener({
      entityRemoved: () => {
        this.removeLink(link);
      },
    });
    this.links[link.getID()] = link;
    this.iterateListeners((listener, event) => {
      if (listener.linksUpdated) {
        listener.linksUpdated({ ...event, link, isCreated: true });
      }
    });
    return link;
  }

  addNode(node: NodeModel): NodeModel {
    node.addListener({
      entityRemoved: () => {
        this.removeNode(node);
      },
    });
    this.nodes[node.getID()] = node;
    this.iterateListeners((listener, event) => {
      if (listener.nodesUpdated) {
        listener.nodesUpdated({ ...event, node, isCreated: true });
      }
    });
    return node;
  }

  removeLink(link: LinkModel<ExtendedLinkModelListener> | string) {
    link = this.getLink(link);
    delete this.links[link.getID()];
    this.iterateListeners((listener, event) => {
      if (listener.linksUpdated) {
        listener.linksUpdated({ ...event, link, isCreated: false });
      }
    });
  }

  removeNode(node: NodeModel | string) {
    // eslint-disable-next-line no-param-reassign
    node = this.getNode(node);
    // $FlowFixMe
    delete this.nodes[node.getID()];
    this.iterateListeners((listener, event) => {
      if (listener.nodesUpdated) {
        listener.nodesUpdated({ ...event, node, isCreated: false });
      }
    });
  }

  getLinks(): { [s: string]: LinkModel<ExtendedLinkModelListener> } {
    return this.links;
  }

  getNodes(): { [s: string]: NodeModel } {
    return this.nodes;
  }
}
