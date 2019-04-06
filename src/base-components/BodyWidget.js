// @flow
import React, { Component } from 'react';
import TrayWidget from './TrayWidget';
import App from '../App';
import TrayItemWidget from './TrayItemWidget';
import { AdvancedNodeModel } from '../AdvancedDiagramFactories';
import ModifiedDiagramWidget from './ModifiedDiagramWidget';

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
        </div>
        <div className="content">
          <TrayWidget>
            <TrayItemWidget model={{ type: 'context' }} name="Context" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'system-output' }} name="Output" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'condition-equals' }} name="Equals" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'condition-exists' }} name="Exists" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'system-list' }} name="List" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'intent' }} name="Intent" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'set-variable' }} name="Set Variable" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'copy-variables' }} name="Copy Variables" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'default-component' }} name="Default Component" color="rgb(0,192,255)" />
          </TrayWidget>
          <div
            className="diagram-layer"
            onDrop={(event) => {
              const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));

              let node = null;
              switch (data.type) {
                case 'context':
                  node = new AdvancedNodeModel('Context Node', 'rgb(0,192,255)', 'context');
                  break;
                case 'system-list':
                  node = new AdvancedNodeModel('List', 'rgb(0,192,255)', 'system-list');
                  break;
                case 'condition-equals':
                  node = new AdvancedNodeModel('Equals', 'rgb(0,192,255)', 'condition-equals');
                  break;
                case 'condition-exists':
                  node = new AdvancedNodeModel('Exists', 'rgb(0,192,255)', 'condition-exists');
                  break;
                case 'set-variable':
                  node = new AdvancedNodeModel('Set Variable', 'rgb(0,192,255)', 'set-variable');
                  break;
                case 'system-output':
                  node = new AdvancedNodeModel('Output', 'rgb(0,192,255)', 'system-output');
                  break;
                case 'copy-variables':
                  node = new AdvancedNodeModel('Copy Variables', 'rgb(0,192,255)', 'copy-variables');
                  break;
                case 'intent':
                  node = new AdvancedNodeModel('Copy Variables', 'rgb(0,192,255)', 'intent');
                  break;
                case 'default-component':
                  node = new AdvancedNodeModel('Default Component Node', 'rgb(0,192,255)', 'default-component');
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
        </div>
      </div>
    );
  }
}
