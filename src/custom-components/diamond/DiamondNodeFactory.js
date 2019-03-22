// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import * as SRD from 'storm-react-diagrams';
import DiamondNodeWidget from './DiamondNodeWidget';
import DiamondNodeModel from './DiamondNodeModel';

export default class DiamondNodeFactory extends SRD.AbstractNodeFactory {
  constructor() {
    super('diamond');
  }

  generateReactWidget(diagramEngine: SRD.DiagramEngine,
    node: SRD.NodeModel): any {
    return <DiamondNodeWidget node={node} />;
  }

  getNewInstance() {
    return new DiamondNodeModel();
  }
}
