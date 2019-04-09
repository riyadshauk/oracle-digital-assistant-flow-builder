// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import IntentNodeWidget from '../../redux/containers/intent';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class IntentNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('intent');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <IntentNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'intent');
  }
}
