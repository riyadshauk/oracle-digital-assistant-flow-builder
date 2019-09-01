// @flow
/* eslint-env browser */
import {
  DiagramModel,
  DiagramEngine,
} from 'storm-react-diagrams';
import './sass/main.scss';
import { AdvancedLinkFactory, AdvancedNodeModel } from './AdvancedDiagramFactories';
import ContextNodeFactory from './bot-components/context/factory';
import GeneralNodeFactory from './bot-components/general/factory';
import ExistsNodeFactory from './bot-components/exists/factory';
import ListNodeFactory from './bot-components/list/factory';
import EqualsNodeFactory from './bot-components/equals/factory';
import SetVariableNodeFactory from './bot-components/setVariable/factory';
import OutputNodeFactory from './bot-components/output/factory';
import CopyVariablesNodeFactory from './bot-components/copyVariables/factory';
import IntentNodeFactory from './bot-components/intent/factory';
import TextNodeFactory from './bot-components/text/factory';
import store from './redux/store';
import ParametersNodeFactory from './bot-components/parameters/factory';
import SystemVariablesNodeFactory from './bot-components/systemVariables/factory';
import { mapNameToID } from './redux/actions/representation';
import generateDiagramFromYAML from './generateDiagramFromYAML';

/**
 * @author Dylan Vorster
 * @author Riyad Shauk
 */
export default class App {
  activeModel: DiagramModel;

  diagramEngine: DiagramEngine;

  variablesAdded: Event;

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
    this.diagramEngine.registerNodeFactory(new TextNodeFactory());
    this.diagramEngine.registerNodeFactory(new ParametersNodeFactory());
    this.diagramEngine.registerNodeFactory(new SystemVariablesNodeFactory());
    window.newModel = this.newModel;
    this.newModel();
  }

  newModel() {
    window.activeModel = new DiagramModel();
    this.diagramEngine.setDiagramModel(window.activeModel);

    const parametersNode = new AdvancedNodeModel('Parameters', undefined, 'parameters');
    store.dispatch(mapNameToID(parametersNode));
    parametersNode.setPosition(25, 30);

    const systemVariablesNode = new AdvancedNodeModel('SystemVariables', undefined, 'systemVariables');
    store.dispatch(mapNameToID(systemVariablesNode));
    systemVariablesNode.setPosition(250, 30);

    const contextNode = new AdvancedNodeModel('Context', undefined, 'context');
    store.dispatch(mapNameToID(contextNode));
    contextNode.setPosition(475, 30);

    window.diagramEngine = this.diagramEngine;
    window.activeModel.addAll(parametersNode, systemVariablesNode, contextNode);

    generateDiagramFromYAML('');
  }

  getActiveDiagram(): DiagramModel {
    return this.activeModel;
  }

  getDiagramEngine(): DiagramEngine {
    return this.diagramEngine;
  }
}
