// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import ContextNodeWidget from './ContextNodeWidget';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class ContextNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('context');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    // eslint-disable-next-line no-param-reassign
    node.color = 'green';
    return <ContextNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'context');
  }
}
