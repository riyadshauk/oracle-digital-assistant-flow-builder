// @flow
import * as React from 'react';
import * as _ from 'lodash';
import { NodeModel, BaseWidget } from 'storm-react-diagrams';
import {
  updatePropertyName,
  updatePropertyValue,
  isEditing,
  addOrUpdateProperty,
  generatePort,
  editTitleClicked,
  updateTitleName,
  editComponentTypeClicked,
  updateComponentType,
  addOrUpdateRawProperty,
} from './helpers';
import { AdvancedNodeModel } from '../AdvancedDiagramFactories';

export const DefaultComponentNodeForm = (thisWidget: BaseWidget) => {
  const { propertyName, propertyValue } = thisWidget.state;
  return (
    <form id="addVariable" onSubmit={addOrUpdateProperty.bind(thisWidget)}>
      <label htmlFor="addOrUpdateProperty">
        Name:&nbsp;
        <input type="text" value={propertyName} onChange={updatePropertyName.bind(thisWidget)} />
        <br />
        Value:&nbsp;
        <input type="text" value={propertyValue} onChange={updatePropertyValue.bind(thisWidget)} />
        <br />
        <input
          type="submit"
          value={isEditing.apply(thisWidget) ? 'Save Edits' : 'Add Property'}
        />
      </label>
    </form>
  );
};

export const DefaultComponentNodeFormRawLabel = (thisWidget: BaseWidget) => {
  const { propertyName, propertyValue } = thisWidget.state;
  return (
    <form id="addVariable" onSubmit={addOrUpdateRawProperty.bind(thisWidget)}>
      <label htmlFor="addOrUpdateRawProperty">
        Name:&nbsp;
        <input type="text" value={propertyName} onChange={updatePropertyName.bind(thisWidget)} />
        <br />
        Value:&nbsp;
        <input type="text" value={propertyValue} onChange={updatePropertyValue.bind(thisWidget)} />
        <br />
        <input
          type="submit"
          value={isEditing.apply(thisWidget) ? 'Save Edits' : 'Add Property'}
        />
      </label>
    </form>
  );
};

export const VariableNameComponentNodeForm = (thisWidget: BaseWidget) => {
  const { propertyName, propertyValue } = thisWidget.state;
  return (
    <form id="addVariable" onSubmit={addOrUpdateProperty.bind(thisWidget)}>
      <label htmlFor="addOrUpdateProperty">
        Name:&nbsp;
        <input type="text" value={propertyName} onChange={updatePropertyName.bind(thisWidget)} />
        <br />
        EntityType:&nbsp;
        <input type="text" value={propertyValue} onChange={updatePropertyValue.bind(thisWidget)} />
        <br />
        <input
          type="submit"
          value={isEditing.apply(thisWidget) ? 'Save Edits' : 'Add Property'}
        />
      </label>
    </form>
  );
};

export const DefaultComponentNodeBody = (node: NodeModel, thisWidget: BaseWidget) => (
  <div {...thisWidget.getProps()} style={{ background: node.color }}>
    {
      !Object.prototype.hasOwnProperty.call(thisWidget.state.representation, 'context')
        ? (
          <div className={thisWidget.bem('__title')}>
            <div className={thisWidget.bem('__name')}>{thisWidget.state.name}</div>
            <EditTitleForm thisWidget={thisWidget} />
          </div>
        )
        : undefined
    }
    <div className={thisWidget.bem('__title')}>
      <div className={thisWidget.bem('__name')}>{node.name}</div>
    </div>
    <div className={thisWidget.bem('__ports')}>
      <div className={thisWidget.bem('__in')}>
        {_.map(node.getInPorts(), generatePort.bind(thisWidget))}
      </div>
      <div className={thisWidget.bem('__out')}>
        {_.map(node.getOutPorts(), generatePort.bind(thisWidget))}
      </div>
    </div>
  </div>
);

// eslint-disable-next-line max-len
export const DefaultComponentNodeBodyWithOneSpecialInPort = (node: NodeModel, thisWidget: BaseWidget, suffixElements?: React.Element<any>[]) => (
  <div {...thisWidget.getProps()} style={{ background: node.color }}>
    <EditTitleForm thisWidget={thisWidget} />
    <div className={thisWidget.bem('__title')}>
      <div className={thisWidget.bem('__name')}>{node.name}</div>
      <div className={thisWidget.bem('__in')}>
        {/* {thisWidget.generatePort.apply(thisWidget, [node.getInPorts()[0]])} */}
        {_.map(node.getInPorts(), generatePort.bind(thisWidget))[0]}
      </div>
    </div>
    <div className={thisWidget.bem('__ports')}>
      <div className={thisWidget.bem('__in')}>
        {_.map(node.getInPorts(), generatePort.bind(thisWidget)).slice(1)}
      </div>
      <div className={thisWidget.bem('__out')}>
        {_.map(node.getOutPorts(), generatePort.bind(thisWidget))}
      </div>
    </div>
    {
      (suffixElements || []).map((element, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={`suffixElement${idx}`}>
          {element}
        </div>
      ))
    }
  </div>
);

export const EditTitleForm = ({ thisWidget }: BaseWidget) => (
  <div className={thisWidget.bem('__title')}>
    {
      // if
      thisWidget.state.isEditingTitle
        ? (
          <div className={thisWidget.bem('__name')}>
            <form
              id="modifyTitle"
              onSubmit={(event: SyntheticInputEvent<EventTarget>) => (
                editTitleClicked.apply(thisWidget, [event])
              )}
            >
              <input
                type="text"
                value={thisWidget.state.name}
                onChange={(event: SyntheticInputEvent<EventTarget>) => (
                  updateTitleName.apply(thisWidget, [event])
                )}
              />
            </form>
          </div>
        )
        // else
        : <div className={thisWidget.bem('__name')}>{thisWidget.state.name}</div>
    }
    <button
      type="button"
      onClick={
        (event: SyntheticInputEvent<EventTarget>) => editTitleClicked.apply(thisWidget, [event])
      }
    >
      {thisWidget.state.isEditingTitle ? 'Save' : 'Edit Title'}
    </button>
  </div>
);

export const AddProperty = (
  thisWidget: BaseWidget,
  node: AdvancedNodeModel,
  onSubmit: (event: SyntheticInputEvent<EventTarget>,
    node: AdvancedNodeModel,
    componentPropertyType: string) => void,
  onChange: (event: SyntheticInputEvent<EventTarget>, componentPropertyType: string) => void,
  componentPropertyType: string,
) => (
  <div className={thisWidget.bem('__title')}>
    <div className={thisWidget.bem('__name')}>
      <form
        id="modifyTitle"
        onSubmit={
          (event: SyntheticInputEvent<EventTarget>) => (
            onSubmit.apply(thisWidget, [event, node, componentPropertyType])
          )
        }
      >
        <input
          type="text"
          value={thisWidget.state[`current${componentPropertyType}Text`]}
          onChange={
            (event: SyntheticInputEvent<EventTarget>) => (
              onChange.apply(thisWidget, [event, componentPropertyType])
            )}
        />
      </form>
    </div>
    <button
      type="button"
      onClick={
        (event: SyntheticInputEvent<EventTarget>) => (
          onSubmit.apply(thisWidget, [event, node, componentPropertyType])
        )
      }
    >
      {`Add ${componentPropertyType}`}
    </button>
  </div>
);

/**
 * This is a special component, basically just for the General bot-component.
 */
export const EditComponentTypeForm = (thisWidget: BaseWidget) => (
  <div className={thisWidget.bem('__title')}>
    {
      // if
      thisWidget.state.isEditingComponentType
        ? (
          <div className={thisWidget.bem('__name')}>
            <form
              id="modifyTitle"
              onSubmit={(event: SyntheticInputEvent<EventTarget>) => (
                editComponentTypeClicked.apply(thisWidget, [event])
              )}
            >
              <input
                type="text"
                value={thisWidget.state.representation.component}
                onChange={(event: SyntheticInputEvent<EventTarget>) => (
                  updateComponentType.apply(thisWidget, [event])
                )}
              />
            </form>
          </div>
        )
        // else
        : <div className={thisWidget.bem('__name')}>{thisWidget.state.representation.component}</div>
    }
    <button
      type="button"
      onClick={
        (event: SyntheticInputEvent<EventTarget>) => (
          editComponentTypeClicked.apply(thisWidget, [event])
        )
      }
    >
      {thisWidget.state.isEditingComponentType ? 'Save' : 'Edit'}
    </button>
  </div>
);