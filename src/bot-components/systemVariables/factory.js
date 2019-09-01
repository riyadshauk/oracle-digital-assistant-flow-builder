// @flow
/* eslint-disable class-methods-use-this */
/**
 * Note: this should be a singleton
 */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import SystemVariablesNodeWidget from '../../redux/containers/systemVariables';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class SystemVariablesNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('systemVariables');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <SystemVariablesNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'systemVariables');
  }
}
