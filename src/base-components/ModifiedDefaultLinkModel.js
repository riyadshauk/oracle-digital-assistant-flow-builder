// @flow
/**
 * @author Dylan Vorster
 * @author Riyad Shauk
 */
import {
  LinkModelListener,
  BaseEvent,
  DefaultLinkModel,
  PortModel,
} from 'storm-react-diagrams';
import { addAction, addTransition } from '../redux/actions/representation';
import store from '../redux/store';
import { mapLinkToNodePair } from '../redux/actions/diagramMapping';

export interface DefaultLinkModelListener extends LinkModelListener {
  colorChanged?: (event: BaseEvent<DefaultLinkModel> & { color: null | string }) => void;

  widthChanged?: (event: BaseEvent<DefaultLinkModel> & { width: 0 | number }) => void;
}

/**
 * The purpose of this class is to dynamically add meaningful labels to the diagram.
 *
 * This class decorates and overrides some methods derived from LinkModel
 * (which is extended by DefaultLinkModel).
 *
 * Also, note that this is not a React component, nor is it extending a React component.
 */
export default class ModifiedDefaultLinkModel extends DefaultLinkModel<DefaultLinkModelListener> {
  constructor(type: string = 'default') {
    super(type);
  }

  /**
   * @helper This is a helper method for the two overridden methods below
   * (setSourcePort and setTargetPort).
   */
  generateLabelIfPossible() {
    if (!this.targetPort
      || !this.sourcePort
      || this.sourcePort.parent.type === 'context'
    ) {
      return;
    }
    // eslint-disable-next-line max-len
    // this.addLabel(`${this.sourcePort.parent.name}.${this.sourcePort.label} -–> ${this.targetPort.parent.name}.${this.targetPort.label}`);
    // $FlowFixMe
    this.addLabel(`${this.sourcePort.label} ––> ${this.targetPort.label}`);

    const [node1, node2] = [this.getSourcePort().getNode(), this.getTargetPort().getNode()];
    if (node1 && node2) {
      store.dispatch(mapLinkToNodePair(this, node1, node2));
    }

    if (this.sourcePort.label === 'OUT' && this.targetPort.label === 'IN') {
      store.dispatch(
        addTransition({
          sourceID: this.sourcePort.parent.id,
          targetID: this.targetPort.parent.id,
        }),
      );
    } else {
      store.dispatch(
        addAction({
          sourceID: this.sourcePort.parent.id,
          targetID: this.targetPort.parent.id,
          sourceActionName: this.sourcePort.label,
          targetLabelName: this.targetPort.label.substring(0, this.targetPort.label.indexOf(' –– ')),
        }),
      );
    }
  }

  setSourcePort(port: PortModel) {
    if (port) {
      port.addLink(this);
    }
    if (this.sourcePort) {
      this.sourcePort.removeLink(this);
    }
    this.sourcePort = port;
    this.iterateListeners((listener: LinkModelListener, event) => {
      if (listener.sourcePortChanged) {
        listener.sourcePortChanged({ ...event, port });
      }
    });
    // @Riyad-edit: add meaningful label to link
    this.generateLabelIfPossible();
  }

  setTargetPort(port: PortModel) {
    if (port) {
      port.addLink(this);
    }
    if (this.targetPort) {
      this.targetPort.removeLink(this);
    }
    this.targetPort = port;
    this.iterateListeners((listener: LinkModelListener, event) => {
      if (listener.targetPortChanged) {
        listener.targetPortChanged({ ...event, port });
      }
    });
    // @Riyad-edit: add meaningful label to link
    this.generateLabelIfPossible();
  }
}
