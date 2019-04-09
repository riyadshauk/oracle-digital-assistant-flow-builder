// @flow
import {
  NodeModel,
  DiagramModel,
  DiagramEngine,
} from 'storm-react-diagrams';
// $FlowFixMe
import './sass/main.scss';
import { AdvancedLinkFactory } from './AdvancedDiagramFactories';
import ContextNodeFactory from './bot-components/context/factory';
import GeneralNodeFactory from './bot-components/general/factory';
import ExistsNodeFactory from './bot-components/exists/factory';
import ListNodeFactory from './bot-components/list/factory';
import EqualsNodeFactory from './bot-components/equals/factory';
import SetVariableNodeFactory from './bot-components/setVariable/factory';
import OutputNodeFactory from './bot-components/output/factory';
import CopyVariablesNodeFactory from './bot-components/copyVariables/factory';
import IntentNodeFactory from './bot-components/intent/factory';

/**
 * @author Dylan Vorster
 */
export default class App {
  activeModel: DiagramModel;

  diagramEngine: DiagramEngine;

  botRoot: NodeModel;

  constructor() {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerLinkFactory(new AdvancedLinkFactory());
    this.diagramEngine.registerNodeFactory(new ContextNodeFactory());
    this.diagramEngine.registerNodeFactory(new GeneralNodeFactory());
    this.diagramEngine.registerNodeFactory(new ExistsNodeFactory());
    this.diagramEngine.registerNodeFactory(new ListNodeFactory());
    this.diagramEngine.registerNodeFactory(new EqualsNodeFactory());
    this.diagramEngine.registerNodeFactory(new SetVariableNodeFactory());
    this.diagramEngine.registerNodeFactory(new OutputNodeFactory());
    this.diagramEngine.registerNodeFactory(new CopyVariablesNodeFactory());
    this.diagramEngine.registerNodeFactory(new IntentNodeFactory());
    this.newModel();
  }

  newModel() {
    this.activeModel = new DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);
  }

  getActiveDiagram(): DiagramModel {
    return this.activeModel;
  }

  getDiagramEngine(): DiagramEngine {
    return this.diagramEngine;
  }
}
