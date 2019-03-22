// @flow
import { AdvancedNodeModel } from '../../AdvancedDiagramFactories';

export default class ContextNodeModel extends AdvancedNodeModel {
  constructor(name: string = 'Untitled', color: string = 'rgb(0,192,255)', type: string = 'context') {
    super(name, color, type);
  }
}
