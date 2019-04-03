// @flow
import {
  NodeModel,
  DiagramModel,
  DiagramEngine,
} from 'storm-react-diagrams';
// $FlowFixMe
import './sass/main.scss';
import { AdvancedLinkFactory } from './AdvancedDiagramFactories';
import ContextNodeFactory from './bot-components/context/ContextNodeFactory';
import DefaultComponentNodeFactory from './bot-components/defaultComponent/DefaultComponentNodeFactory';
import ConditionExistsNodeFactory from './bot-components/conditionExists/ConditionExistsNodeFactory';
import SystemListNodeFactory from './bot-components/systemList/SystemListNodeFactory';
import ConditionEqualsNodeFactory from './bot-components/conditionEquals/ConditionEqualsNodeFactory';
import SetVariableNodeFactory from './bot-components/setVariable/SetVariableNodeFactory';
import SystemOutputNodeFactory from './bot-components/systemOutput/SystemOutputNodeFactory';
import CopyVariablesNodeFactory from './bot-components/copyVariables/CopyVariablesNodeFactory';
import IntentNodeFactory from './bot-components/intent/IntentNodeFactory';
import DigitalAssistantRootNodeModel from './bot-components/digitalAssistantRoot/DigitalAssistantRootNodeModel';
import DigitalAssistantRootNodeFactory from './bot-components/digitalAssistantRoot/DigitalAssistantRootNodeFactory';

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
    this.diagramEngine.registerNodeFactory(new DefaultComponentNodeFactory());
    this.diagramEngine.registerNodeFactory(new ConditionExistsNodeFactory());
    this.diagramEngine.registerNodeFactory(new SystemListNodeFactory());
    this.diagramEngine.registerNodeFactory(new ConditionEqualsNodeFactory());
    this.diagramEngine.registerNodeFactory(new SetVariableNodeFactory());
    this.diagramEngine.registerNodeFactory(new SystemOutputNodeFactory());
    this.diagramEngine.registerNodeFactory(new CopyVariablesNodeFactory());
    this.diagramEngine.registerNodeFactory(new IntentNodeFactory());
    this.diagramEngine.registerNodeFactory(new DigitalAssistantRootNodeFactory());
    this.newModel();
  }

  newModel() {
    this.activeModel = new DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);

    this.botRoot = new DigitalAssistantRootNodeModel();
    this.botRoot.setPosition(300, 50);
    this.activeModel.addAll(this.botRoot);
  }

  getActiveDiagram(): DiagramModel {
    return this.activeModel;
  }

  getDiagramEngine(): DiagramEngine {
    return this.diagramEngine;
  }

  getBotRoot(): DigitalAssistantRootNodeModel {
    return this.botRoot;
  }
}
