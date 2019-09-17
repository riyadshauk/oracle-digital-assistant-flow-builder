// @flow
import * as React from 'react';
import { BaseWidget } from 'storm-react-diagrams';
import { Resizable } from 're-resizable';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort } from '../../helpers/FunctionalComponents';
import { registerNotEditable } from '../../helpers/helpers';
import store from '../../redux/store';

export interface EqualsNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface EqualsNodeWidgetState {
  representation: {
    component: 'System.ConditionEquals',
    properties: {
      variable: string,
      value: string,
    },
    transitions: {
      actions: {
        equal: string,
        notequal: string,
      },
    },
    name: string,
  };
  notEditable: {};
}

/**
 * @author Riyad Shauk
 */
export default class EqualsNodeWidget extends
  BaseWidget<EqualsNodeWidgetProps, EqualsNodeWidgetState> {
  constructor(props: EqualsNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        component: 'System.ConditionEquals',
        properties: {
          variable: '',
          value: '',
        },
        transitions: {
          actions: {
            equal: '',
            notequal: '',
          },
        },
      },
      name: '',
      isEditingTitle: false,
      nameBeforeEditTitleClicked: '',
    };
    const { addState, node } = props;
    const { id } = node;
    const stateNamePrefix = node.name || 'Equals';
    addState(this.state.representation, stateNamePrefix, id);
    this.state.name = store.getState().representation.idToName[node.id];
    this.state.nameBeforeEditTitleClicked = this.state.name;
  }

  isEditing = () => Object.values(this.state.isEditing).reduce((prev, cur) => (prev || cur), false);

  componentWillMount() {
    const { node } = this.props;
    node.addInPort('IN');
    node.addInPort('variable');
    node.addInPort('value –– ');
    node.addInPort('true');
    node.addInPort('false');

    registerNotEditable.apply(this, ['IN', 'variable', 'true', 'false']);
  }

  componentDidMount() {
    const { node } = this.props;
    this.unsubscribe = store.subscribe(() => {
      this.setState({ name: store.getState().representation.idToName[node.id] });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { node } = this.props;
    return (
      <Resizable>
        <div className="default-component-node" style={{ position: 'relative' }}>
          {DefaultComponentNodeForm.apply(this, [this])}
          {DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this])}
        </div>
      </Resizable>
    );
  }
}