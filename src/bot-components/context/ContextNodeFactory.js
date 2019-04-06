// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import ContextNodeWidget from '../../redux/containers/context';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class ContextNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('context');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <ContextNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'context');
  }
}
