// @flow
import { LinkModel } from 'storm-react-diagrams';
import { AdvancedPortModel, AdvancedLinkModel } from '../../AdvancedDiagramFactories';

export default class ContextPortModel extends AdvancedPortModel {
  constructor(pos: string | 'left' | 'right') {
    super(pos, 'context');
  }

  // eslint-disable-next-line class-methods-use-this
  createLinkModel(): LinkModel {
    return new AdvancedLinkModel();
  }
}