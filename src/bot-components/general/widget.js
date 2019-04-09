// @flow
import * as React from 'react';
import { BaseWidget } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import { registerNotEditable } from '../../helpers/helpers';
import { DefaultComponentNodeForm, DefaultComponentNodeBodyWithOneSpecialInPort, EditComponentTypeForm } from '../../helpers/PureComponents';
import store from '../../redux/store';

export interface GeneralNodeWidgetProps {
  node: AdvancedNodeModel;
  addState: Function;
}

export interface GeneralNodeWidgetState {
  notEditable: {};
}

/**
 * @author Riyad Shauk
 * @todo still need to be able to add to properties and add to transitions
 */
export default class GeneralNodeWidget extends
  BaseWidget<GeneralNodeWidgetProps, GeneralNodeWidgetState> {
  constructor(props: GeneralNodeWidgetProps) {
    super('srd-default-node', props);
    this.state = {
      propertyName: '',
      propertyValue: '',
      isEditing: {},
      prevPropertyName: '',
      notEditable: {},
      representation: {
        component: 'Default.Component',
        properties: {
        },
        transitions: {
          next: '',
        },
      },
      name: '',
      isEditingTitle: false,
      nameBeforeEditTitleClicked: '',
      isEditingComponentType: false,
      nameBeforeEditComponentClicked: '',
    };
    const { addState, node } = this.props;
    const { id } = node;
    const stateNamePrefix = 'Default';
    addState(this.state.representation, stateNamePrefix, id);
    this.state.name = store.getState().representation.idToName[node.id];
    this.state.nameBeforeEditTitleClicked = this.state.name;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillMount() {
    const { node } = this.props;
    node.addInPort('IN');
    node.addOutPort('OUT');
    registerNotEditable.apply(this, ['IN', 'OUT']);
  }

  componentDidMount() {
    const { node } = this.props;
    this.unsubscribe = store.subscribe(() => {
      this.setState({ name: store.getState().representation.idToName[node.id] });
    });
  }

  render() {
    const { node } = this.props;
    /**
     * @todo buttons: Add Property, Add Variable, Add Transition, Add Action
     */
    return (
      <div className="default-component-node" style={{ position: 'relative' }}>
        { DefaultComponentNodeForm.apply(this, [this]) }
        { EditComponentTypeForm.apply(this, [this]) }
        { DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this]) }
      </div>
    );
  }
}