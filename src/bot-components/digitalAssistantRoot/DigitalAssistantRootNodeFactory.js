// @flow
/* eslint-disable class-methods-use-this */
import * as React from 'react';
import {
  AbstractNodeFactory, NodeModel, DiagramEngine,
} from 'storm-react-diagrams';
import DigitalAssistantRootNodeWidget from './DigitalAssistantRootNodeWidget';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class extends AbstractNodeFactory {
  constructor() {
    super('digital-assistant-root');
  }

  generateReactWidget(diagramEngine: DiagramEngine,
    node: NodeModel): any {
    return <DigitalAssistantRootNodeWidget node={node} />;
  }

  getNewInstance() {
    return new AdvancedNodeModel(undefined, undefined, 'digital-assistant-root');
  }
}
