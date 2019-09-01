// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import GeneralNodeWidget from '../../redux/containers/general';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class GeneralNodeFactory extends AbstractNodeFactory {
  constructor() {
    super('general');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <GeneralNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'general');
  }
}
