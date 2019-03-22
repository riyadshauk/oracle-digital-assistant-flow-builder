// @flow
import React, { Component } from 'react';

export type TrayWidgetProps = {
  children?: any,
};

export type TrayWidgetState = {};

/**
 * @author Dylan Vorster
 */
export default class TrayWidget extends Component<TrayWidgetProps, TrayWidgetState> {
  static defaultProps: TrayWidgetProps = {};

  constructor(props: TrayWidgetProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return <div className="tray">{ children }</div>;
  }
}

TrayWidget.defaultProps = {
  children: undefined,
};
