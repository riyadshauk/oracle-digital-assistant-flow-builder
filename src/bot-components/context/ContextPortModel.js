// @flow
import { AdvancedPortModel } from '../../AdvancedDiagramFactories';

export default class ContextPortModel extends AdvancedPortModel {
  position: string;

  constructor(pos: string = 'top') {
    super(pos, 'context');
    this.position = pos;
  }
}
