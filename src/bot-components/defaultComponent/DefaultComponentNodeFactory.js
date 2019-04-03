// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import DefaultComponentNodeWidget from './DefaultComponentNodeWidget';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class DefaultComponentNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('default-component');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <DefaultComponentNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'default-component');
  }
}
