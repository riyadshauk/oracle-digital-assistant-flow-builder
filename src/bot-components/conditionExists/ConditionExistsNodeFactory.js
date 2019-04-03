// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import ConditionExistsNodeWidget from './ConditionExistsNodeWidget';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class extends AbstractNodeFactory {
  constructor() {
    super('condition-exists');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <ConditionExistsNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'condition-exists');
  }
}
