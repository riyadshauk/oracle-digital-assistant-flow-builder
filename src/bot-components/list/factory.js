// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import ListNodeWidget from '../../redux/containers/list';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class ListNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('system-list');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <ListNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'system-list');
  }
}
