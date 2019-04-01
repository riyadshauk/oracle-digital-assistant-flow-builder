// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import SystemListNodeWidget from './SystemListNodeWidget';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class extends AbstractNodeFactory {
  constructor() {
    super('system-list');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    // eslint-disable-next-line no-param-reassign
    node.color = 'green';
    return <SystemListNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'system-list');
  }
}
