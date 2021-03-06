// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import ConditionEqualsNodeWidget from '../../redux/containers/equals';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class EqualsNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('equals');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <ConditionEqualsNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'equals');
  }
}
