// @flow
import * as React from 'react';
import { PortWidget, NodeModel } from 'storm-react-diagrams';
import DiamondNodeModel from './DiamondNodeModel';

export interface DiamondNodeWidgetProps {
  node: DiamondNodeModel;
  size: number;
}

export interface DiamondNodeWidgetState {}

/**
 * @author Dylan Vorster
 */
export default class DiamondNodeWidget extends React.Component<DiamondNodeWidgetProps,
  DiamondNodeWidgetState> {
  static defaultProps: DiamondNodeWidgetProps = {
    size: 150,
    node: NodeModel,
  };

  constructor(props: DiamondNodeWidgetProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { size, node } = this.props;
    return (
      <div
        className="diamond-node"
        style={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        <svg>
          <polygon
            fill="purple"
            stroke="#000000"
            strokeWidth="3"
            strokeMiterlimit="10"
            points={`10, ${size / 2}, ${size / 2}, 10, ${size - 10}, ${size / 2}, ${size / 2}, ${size - 10}`}
          />
          <text x={size / 4} y={size / 2 + 5} fill="red">I love SVG!</text>
        </svg>
        <button
          type="button"
        >
          Add Property
        </button>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            top: size / 2 - 8,
            left: -8,
          }}
        >
          <PortWidget name="left" node={node} />
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: size / 2 - 8,
            top: -8,
          }}
        >
          <PortWidget name="top" node={node} />
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: size - 8,
            top: size / 2 - 8,
          }}
        >
          <PortWidget name="right" node={node} />
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: size / 2 - 8,
            top: size - 8,
          }}
        >
          <PortWidget name="bottom" node={node} />
        </div>
      </div>
    );
  }
}