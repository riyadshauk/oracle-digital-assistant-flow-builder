// @flow
import * as React from 'react';
import * as _ from 'lodash';
import {
  BaseWidget,
  DefaultPortLabel,
} from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export interface ConditionExistsNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface ConditionExistsNodeWidgetState {
  representation: {
    component: 'System.ConditionExists',
    properties: {
      variable: string,
    },
    transitions: {
      actions: {
        exists: string,
        notexists: string,
      },
    },
  },
  name: string,
}

/**
 * @author Riyad Shauk
 */
export default class extends
  BaseWidget<ConditionExistsNodeWidgetProps, ConditionExistsNodeWidgetState> {
  constructor(props: ConditionExistsNodeWidgetProps) {
    super('srd-default-node', props);
    console.log('ConditionExists constructor invoked');
    this.state = {
      representation: {
        component: 'System.ConditionExists',
        properties: {
          variable: '',
        },
        transitions: {
          actions: {
            exists: '',
            notexists: '',
          },
        },
      },
      name: 'System.ConditionExists.Name',
    };
    const { addState } = props;
    const newStateName = 'System.ConditionExists.Name';
    addState(this.state.representation, newStateName);
  }

  generatePort = (port: any) => <DefaultPortLabel model={port} key={port.id} />

  isEditing = () => Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);

  componentWillMount() {
    const { node } = this.props;
    node.addInPort(' ');
    node.addInPort('variable');
    node.addInPort('true');
    node.addInPort('false');
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