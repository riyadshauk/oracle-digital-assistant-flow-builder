// @flow
import * as React from 'react';
import * as _ from 'lodash';
import { NodeModel, BaseWidget, DefaultPortLabel } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export interface ConditionEqualsNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface ConditionEqualsNodeWidgetState { }

/**
 * @author Riyad Shauk
 */
export default class ConditionEqualsNodeWidget extends
  BaseWidget<ConditionEqualsNodeWidgetProps, ConditionEqualsNodeWidgetState> {
  static defaultProps: ConditionEqualsNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: ConditionEqualsNodeWidgetProps) {
    super('srd-default-node', props);
  }

  generatePort = (port: any) => <DefaultPortLabel model={port} key={port.id} />

  isEditing = () => Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);

  componentWillMount() {
    const { node } = this.props;
    node.addInPort(' ');
    node.addInPort('variable');
    node.addInPort('=');
    node.addInPort('≠');
  }

  render() {
    const { node } = this.props;
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        <div {...this.getProps()} style={{ background: node.color }}>
          <div className={this.bem('__title')}>
            <div className={this.bem('__name')}>{node.name}</div>
            <div className={this.bem('__in')}>
              {this.generatePort(node.getInPorts()[0])}
            </div>
          </div>
          <div className={this.bem('__ports')}>
            <div className={this.bem('__in')}>
              {_.map(node.getInPorts(), this.generatePort).slice(1)}
            </div>
            <div className={this.bem('__out')}>
              {_.map(node.getOutPorts(), this.generatePort)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}