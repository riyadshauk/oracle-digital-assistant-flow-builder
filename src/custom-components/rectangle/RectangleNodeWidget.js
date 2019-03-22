// @flow
import * as React from 'react';
import { PortWidget, NodeModel } from 'storm-react-diagrams';
import RectangleNodeModel from './RectangleNodeModel';
import TextRegion from '../text-region/textRegion';

export interface RectangleNodeWidgetProps {
  node: RectangleNodeModel;
  size: number;
}

export interface RectangleNodeWidgetState {
  x: number;
  y: number;
  texts: string[];
  counter: number;
}

/**
 * @author Dylan Vorster
 */
export default class RectangleNodeWidget extends React.Component<RectangleNodeWidgetProps,
  RectangleNodeWidgetState> {
  static defaultProps: RectangleNodeWidgetProps = {
    size: 150,
    node: NodeModel,
  };

  constructor(props: RectangleNodeWidgetProps) {
    super(props);
    const { size } = this.props;
    this.state = {
      x: 1.5 * size,
      y: size,
      texts: [],
      counter: 0,
    };
  }

  addProperty = () => {
    const { texts, counter } = this.state;
    texts.push(`property ${counter}`);
    this.setState(prevState => ({
      y: prevState.y + 20,
      counter: prevState.counter + 1,
    }));
  };

  render() {
    const { node } = this.props;
    const { x, y, texts } = this.state;
    return (
      <div
        className="rectangle-node"
        style={{
          position: 'relative',
          width: x,
          height: y,
        }}
      >
        <button
          type="button"
          onClick={this.addProperty}
        >
          Add Property
        </button>
        <svg
          height="100%"
          width="100%"
        >
          <polygon
            fill="purple"
            stroke="#000000"
            strokeWidth="3"
            strokeMiterlimit="10"
            points={`0,0 ${x},0 ${x},${y} 0,${y}`}
          />
          <TextRegion texts={texts} x={0} />
        </svg>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            top: y / 2 - 8,
            left: -8,
          }}
        >
          <PortWidget name="left" node={node} />
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: x / 2 - 8,
            top: -8,
          }}
        >
          <PortWidget name="top" node={node} />
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: x - 8,
            top: y / 2 - 8,
          }}
        >
          <PortWidget name="right" node={node} />
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: x / 2 - 8,
            top: y - 8,
          }}
        >
          <PortWidget name="bottom" node={node} />
        </div>
      </div>
    );
  }
}