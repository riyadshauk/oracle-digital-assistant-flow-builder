// @flow
// import {
//   BaseModelListener,
//   NodeModel,
//   BaseEvent,
// } from 'storm-react-diagrams';
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

// interface NodeModelListener extends BaseModelListener {
//   positionChanged?: (event: BaseEvent<NodeModel>) => void;
// }

export default class extends AdvancedNodeModel {
  constructor() {
    super('Digital Assistant Root', 'lightblue', 'digital-assistant-root');
  }

  // positionChanged() {
  //   console.log('DigitalAssistantRoot this:', this);
  //   this.iterateListeners(
  //     (listener: NodeModelListener, event) => listener.positionChanged
  //     && listener.positionChanged(event),
  //   );
  // }
}