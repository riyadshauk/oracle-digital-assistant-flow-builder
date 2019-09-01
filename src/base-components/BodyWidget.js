// @flow
import React, { Component } from 'react';
import TrayWidget from './TrayWidget';
import App from '../App';
import TrayItemWidget from './TrayItemWidget';
import { AdvancedNodeModel } from '../AdvancedDiagramFactories';
import ModifiedDiagramWidget from './ModifiedDiagramWidget';
import Legend from '../text-components/Legend';
import Representation from '../text-components/Representation';
import SourceCodeReference from '../text-components/SourceCodeReference';

export type BodyWidgetProps = {
  app: App;
}

export type BodyWidgetState = {};

/**
 * @author Dylan Vorster
 * @author Riyad Shauk
 */
export default class BodyWidget extends Component<BodyWidgetProps, BodyWidgetState> {
  constructor(props: BodyWidgetProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { app } = this.props;
    return (
      <div className="body">
        <div className="header">
          <div className="title">Digital Assistant Visual Builder</div>
          <SourceCodeReference />
        </div>
        <div className="content">
          <TrayWidget>
            <TrayItemWidget model={{ type: 'output' }} name="Output" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'text' }} name="Text" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'equals' }} name="Equals" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'exists' }} name="Exists" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'list' }} name="List" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'intent' }} name="Intent" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'set-variable' }} name="Set Variable" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'copy-variables' }} name="Copy Variables" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'general' }} name="General Component" color="rgb(0,192,255)" />
          </TrayWidget>
          <div
            className="diagram-layer"
            onDrop={(event) => {
              const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));

              let node = null;
              switch (data.type) {
                case 'context':
                  node = new AdvancedNodeModel('Context', 'rgb(0,192,255)', 'context');
                  break;
                case 'list':
                  node = new AdvancedNodeModel('List', 'rgb(0,192,255)', 'list');
                  break;
                case 'equals':
                  node = new AdvancedNodeModel('Equals', 'rgb(0,192,255)', 'equals');
                  break;
                case 'exists':
                  node = new AdvancedNodeModel('Exists', 'rgb(0,192,255)', 'exists');
                  break;
                case 'set-variable':
                  node = new AdvancedNodeModel('Set Variable', 'rgb(0,192,255)', 'set-variable');
                  break;
                case 'output':
                  node = new AdvancedNodeModel('Output', 'rgb(0,192,255)', 'output');
                  break;
                case 'copy-variables':
                  node = new AdvancedNodeModel('Copy Variables', 'rgb(0,192,255)', 'copy-variables');
                  break;
                case 'intent':
                  node = new AdvancedNodeModel('Intent', 'rgb(0,192,255)', 'intent');
                  break;
                case 'text':
                  node = new AdvancedNodeModel('Text', 'rgb(0,192,255)', 'text');
                  break;
                case 'general':
                  node = new AdvancedNodeModel('General Component', 'rgb(0,192,255)', 'general');
                  break;
                default:
                  node = new AdvancedNodeModel();
                  break;
              }

              const points = app.getDiagramEngine()
                .getRelativeMousePoint(event);
              node.x = points.x;
              node.y = points.y;
              app.getDiagramEngine()
                .getDiagramModel()
                .addNode(node);
              this.forceUpdate();
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
          >
            <ModifiedDiagramWidget className="srd-demo-canvas" diagramEngine={app.getDiagramEngine()} />
          </div>
          <div>
            <Legend />
            <Representation />
          </div>
        </div>
      </div>
    );
  }
}
