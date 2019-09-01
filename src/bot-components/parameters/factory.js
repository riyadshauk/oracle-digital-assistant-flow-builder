// @flow
/* eslint-disable class-methods-use-this */
/**
 * Note: this should be a singleton
 */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import ParametersNodeWidget from '../../redux/containers/parameters';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class ParametersNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('parameters');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <ParametersNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'parameters');
  }
}
