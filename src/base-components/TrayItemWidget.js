// @flow
import React, { Component } from 'react';

export type TrayItemWidgetProps = {
  model: any;
  color?: string;
  name: string;
}

export type TrayItemWidgetState = {};

// eslint-disable-next-line import/prefer-default-export
export default class TrayItemWidget extends Component<TrayItemWidgetProps, TrayItemWidgetState> {
  static defaultProps: {
    color: string,
  };

  constructor(props: TrayItemWidgetProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { color, model, name } = this.props;
    return (
      <div
        style={{ borderColor: color }}
        draggable
        onDragStart={event => event.dataTransfer.setData('storm-diagram-node', JSON.stringify(model))}
        className="tray-item"
      >
        { name }
      </div>
    );
  }
}

TrayItemWidget.defaultProps = {
  color: 'blue',
};
