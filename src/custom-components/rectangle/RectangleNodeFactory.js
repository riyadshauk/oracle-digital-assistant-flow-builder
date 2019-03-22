// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import * as SRD from 'storm-react-diagrams';
import RectangleNodeWidget from './RectangleNodeWidget';
import RectangleNodeModel from './RectangleNodeModel';

export default class RectangleNodeFactory extends SRD.AbstractNodeFactory {
  constructor() {
    super('rectangle');
  }

  generateReactWidget(diagramEngine: SRD.DiagramEngine,
    node: SRD.NodeModel): any {
    return <RectangleNodeWidget node={node} />;
  }

  getNewInstance() {
    return new RectangleNodeModel();
  }
}
