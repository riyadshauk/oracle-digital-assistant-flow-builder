// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import OutputNodeWidget from '../../redux/containers/output';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class extends AbstractNodeFactory {
  constructor() {
    super('system-output');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <OutputNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'system-output');
  }
}