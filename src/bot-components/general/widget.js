// @flow
import * as React from 'react';
import { BaseWidget } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';
import {
  registerNotEditable,
  generatePort,
  addPropertyClicked,
  updateStatePropertyText,
} from '../../helpers/helpers';
import {
  DefaultComponentNodeForm,
  DefaultComponentNodeBodyWithOneSpecialInPort,
  EditComponentTypeForm,
  AddProperty,
} from '../../helpers/FunctionalComponents';
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
        component: 'MyGeneralComponentType',
        properties: {
        },
        transitions: {
          actions: {},
          next: '',
        },
      },
      name: '',
      isEditingTitle: false,
      nameBeforeEditTitleClicked: '',
      isEditingComponentType: false,
      currentTransitionPropertyText: '',
      currentActionPropertyText: '',
      currentPropertyPropertyText: '',
    };
    const { addState, node } = this.props;
    const { id } = node;
    const stateNamePrefix = 'General';
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
        {DefaultComponentNodeForm.apply(this, [this])}
        {EditComponentTypeForm.apply(this, [this])}
        {DefaultComponentNodeBodyWithOneSpecialInPort.apply(this, [node, this, [
          // $FlowFixMe
          <div className={this.bem('__in')}>
            {
              node.getOutPorts().map((port) => {
                if (port.label === 'actions' || port.label === 'next' || port.label === 'OUT') {
                  return;
                }
                // eslint-disable-next-line consistent-return
                return generatePort.apply(this, [port]);
              })
            }
          </div>,
          AddProperty(this, node, addPropertyClicked, updateStatePropertyText, 'Transition'),
          AddProperty(this, node, addPropertyClicked, updateStatePropertyText, 'Action'),
          AddProperty(this, node, addPropertyClicked, updateStatePropertyText, 'Property'),
        ]])}
      </div>
    );
  }
}