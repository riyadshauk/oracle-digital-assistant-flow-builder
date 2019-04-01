// @flow
import * as React from 'react';
import * as _ from 'lodash';
import { NodeModel, BaseWidget, DefaultPortLabel } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export interface ConditionExistsNodeWidgetProps {
  node: AdvancedNodeModel;
}

export interface ConditionExistsNodeWidgetState {}

/**
 * @author Riyad Shauk
 */
export default class ConditionExistsNodeWidget extends
  BaseWidget<ConditionExistsNodeWidgetProps, ConditionExistsNodeWidgetState> {
  static defaultProps: ConditionExistsNodeWidgetProps = {
    node: NodeModel,
  };

  constructor(props: ConditionExistsNodeWidgetProps) {
    super('srd-default-node', props);
  }

  generatePort = (port: any) => <DefaultPortLabel model={port} key={port.id} />

  isEditing = () => Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);

  componentWillMount() {
    const { node } = this.props;
    node.addInPort('variable');
    node.addInPort('exists');
    node.addInPort('¬ exists');
  }

  render() {
    const { node } = this.props;

    return (
      <div className="default-component-node" style={{ position: 'relative' }}>

        <div {...this.getProps()} style={{ background: node.color }}>
          <div className={this.bem('__title')}>
            <div className={this.bem('__name')}>{node.name}</div>
          </div>
          <div className={this.bem('__ports')}>
            <div className={this.bem('__in')}>
              {_.map(node.getInPorts(), this.generatePort)}
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