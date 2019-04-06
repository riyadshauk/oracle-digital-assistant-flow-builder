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
 * DISCLAIMER: I understand that extending React components is heavily discouraged in the
 * React/Facebook community; however, the storm-react-diagrams library was built in a way that
 * highly encourages extending React components. To avoid massive code duplication, I've decided
 * to follow along with this (anti?)-pattern here.
 *
 * I may want to fix this issue in the future (maybe creating a PR to storm-react-diagrams?)
 * @see https://reactjs.org/docs/composition-vs-inheritance.html
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
    if (this.targetPort === null || this.sourcePort === null) {
      return;
    }
    // eslint-disable-next-line max-len
    // this.addLabel(`${this.sourcePort.parent.name}.${this.sourcePort.label} -–> ${this.targetPort.parent.name}.${this.targetPort.label}`);
    // $FlowFixMe
    this.addLabel(`${this.sourcePort.label} ––> ${this.targetPort.label}`);
  }

  setSourcePort(port: PortModel) {
    if (port !== null) {
      port.addLink(this);
    }
    if (this.sourcePort !== null) {
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
    if (port !== null) {
      port.addLink(this);
    }
    if (this.targetPort !== null) {
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
