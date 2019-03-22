// @flow
import React, { Component } from 'react';
import * as _ from 'lodash';
import { DiagramWidget } from 'storm-react-diagrams';
import TrayWidget from './TrayWidget';
import App from '../App';
import TrayItemWidget from './TrayItemWidget';
import { AdvancedNodeModel } from '../AdvancedDiagramFactories';
import DiamondNodeModel from '../custom-components/diamond/DiamondNodeModel';
import RectangleNodeModel from '../custom-components/rectangle/RectangleNodeModel';
import ContextNodeModel from '../bot-components/context/ContextNodeModel';

export type BodyWidgetProps = {
  app: App;
}

export type BodyWidgetState = {};

/**
 * @author Dylan Vorster
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
            <TrayItemWidget model={{ type: 'in' }} name="In Node" color="rgb(192,255,0)" />
            <TrayItemWidget model={{ type: 'out' }} name="Out Node" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'bot' }} name="Digital Assistant Root" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'diamond' }} name="Custom Diamond Node" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'rectangle' }} name="Custom Rectangle Node" color="rgb(0,192,255)" />
            <TrayItemWidget model={{ type: 'context' }} name="DA Context Node" color="rgb(0,192,255)" />
          </TrayWidget>
          <div
            className="diagram-layer"
            onDrop={(event) => {
              const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
              const nodesCount = _.keys(
                app.getDiagramEngine()
                  .getDiagramModel()
                  .getNodes(),
              ).length;

              let node = null;
              if (data.type === 'in') {
                node = new AdvancedNodeModel(`Node ${nodesCount + 1}`, 'rgb(192,255,0)');
                node.addInPort('In');
              } else if (data.type === 'out') {
                node = new AdvancedNodeModel(`Node ${nodesCount + 1}`, 'rgb(0,192,255)');
                node.addOutPort('Out');
              } else if (data.type === 'bot') {
                node = new AdvancedNodeModel('Digital Assistant Root', 'rgb(0,192,255)');
                node.addOutPort('Out');
              } else if (data.type === 'diamond') {
                node = new DiamondNodeModel('Custom Diamond', 'rgb(0,192,255)');
              } else if (data.type === 'rectangle') {
                node = new RectangleNodeModel('Custom Rectangle', 'rgb(0,192,255)');
              } else if (data.type === 'context') {
                node = new ContextNodeModel('Context Node', 'rgb(0,192,255)');
              } else {
                node = new AdvancedNodeModel();
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
            <DiagramWidget className="srd-demo-canvas" diagramEngine={app.getDiagramEngine()} />
          </div>
        </div>
      </div>
    );
  }
}
