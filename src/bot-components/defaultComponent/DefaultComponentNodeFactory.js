// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import DefaultComponentNodeNodeModel from './DefaultComponentNodeModel';
import DefaultComponentNodeWidget from './DefaultComponentNodeWidget';

export default class DefaultComponentNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('default-component');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    // eslint-disable-next-line no-param-reassign
    node.color = 'lightblue';
    return <DefaultComponentNodeWidget node={node} />;
  }

  getNewInstance() {
    return new DefaultComponentNodeNodeModel();
  }
}
