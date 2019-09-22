// @flow
/* eslint-env browser */
import React, { Component } from 'react';
import { dump } from 'js-yaml';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { Pos } from 'codemirror';
import store from '../redux/store';
import generateDiagramFromYAML from '../generateDiagramFromYAML';
import { yaml as pizzaBotExample } from '../helpers/PizzaBotFlowExample';
import { markIDInvisible, markIDVisible } from '../redux/actions/diagramMapping';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';

require('codemirror/mode/yaml/yaml');

require('codemirror/addon/fold/brace-fold');
require('codemirror/addon/fold/comment-fold');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/indent-fold');

interface RepresentationProps { }

interface RepresentationState {
  code: string,
  isTyping: boolean,
  codeMirror: any,
}

const getLines = (editor: CodeMirror.Editor) => {
  const lines = [];
  Object.values(editor.doc.children)
    .forEach(lineObj => (
      Object.values(lineObj.lines)
        .forEach(line => lines.push(line.text))
    ));
  return lines;
};

const getLinesFromStart = (editor: CodeMirror.Editor, lineNumber: number) => (
  getLines(window.codeMirror).slice(0, lineNumber + 1)
  // getLines(window.codeMirror)
);

const getKeyPath: (lines: string[]) => string[] = (lines: string[]) => {
  let curLinePrefix: number;
  const reversePath: string[] = [];
  for (let i = lines.length - 1; i > -1; i -= 1) {
    const match = lines[i].match(/(^\s*)\b(\w*)/) || [];
    const [, prefix, key] = match.length > 2 ? match : ['', '', ''];
    if (curLinePrefix === undefined || curLinePrefix > prefix.length) {
      curLinePrefix = prefix.length;
      reversePath.push(key);
    }
  }
  return reversePath.reverse();
};

/**
 * @summary Set node's css to visibility: hidden, and properly
 * update the visibility of the links connected to it.
 * @description maintains a dictionary of linkToNodePair in
 * diagramMapping redux store. Also maintains a dictionary of
 * IDIsInvisible in diagramMapping redux store.
 * For any link, we check the two nodes it's connected to.
 * If either is hidden, we make sure the link stays hidden.
 * Otherwise, only if both nodes are visible, setVisible the
 * mutual link. When hiding a node, always ensure its links are
 * invisible.
 */
const correctlyToggleVisibilitiesInDiagram = (nodeID: string) => {
  if (nodeID === undefined) {
    return;
  }

  const setInvisible = (el: Element) => {
    const style = el.getAttribute('style') || '';
    el.setAttribute('style', `${style} visibility: hidden;`);
    return false;
  };

  const setVisible = (el: Element) => {
    const style = (el.getAttribute('style') || '')
      .replace(' visibility: hidden;', '');
    el.setAttribute('style', style);
    return true;
  };

  const { linkToNodePair, IDIsInvisible } = store.getState().diagramMapping;
  const node: NodeModel = window.activeModel.getNode(nodeID);

  let nodeIsInvisible;
  // $FlowFixMe
  const HTMLNode: Element = document.querySelector(`[data-nodeid="${nodeID}"]`);
  if (!IDIsInvisible[nodeID]) {
    nodeIsInvisible = !setInvisible(HTMLNode);
    store.dispatch(markIDInvisible(node.id));
  } else {
    nodeIsInvisible = !setVisible(HTMLNode);
    store.dispatch(markIDVisible(node.id));
  }

  // correctly hide or show any links connected to the node
  Object.values(node.ports).forEach((port) => {
    // $FlowFixMe missing in mixed
    Object.values(port.links).forEach((link) => {
      // $FlowFixMe missing in mixed
      const HTMLLinkChild: Element = document.querySelector(`[data-linkid="${link.id}"]`);
      if (nodeIsInvisible && !IDIsInvisible[link.id]) {
        // $FlowFixMe
        setInvisible(HTMLLinkChild.parentElement);
        store.dispatch(markIDInvisible(link.id));
      } else if (
        !nodeIsInvisible
        // eslint-disable-next-line no-bitwise
        && (!IDIsInvisible[linkToNodePair[link.id][0]]
          ^ !IDIsInvisible[linkToNodePair[link.id][1]])
      ) {
        // $FlowFixMe
        setVisible(HTMLLinkChild.parentElement);
        store.dispatch(markIDVisible(link.id));
      }
    });
  });
};

const updateDiagramFromKeyPath = (keyPath: string[]) => {
  const { nameToID } = store.getState().representation;
  const nodeName = keyPath[keyPath.length - 1] === 'context' ? 'Context' : keyPath[keyPath.length - 1];
  const nodeID = nameToID[nodeName];
  correctlyToggleVisibilitiesInDiagram(nodeID);
};

const updateDiagramFromGutterClick = (editor: CodeMirror.Editor, lineNumber: number) => {
  const linesFromStart = getLinesFromStart(editor, lineNumber);
  const keyPath = getKeyPath(linesFromStart);
  return updateDiagramFromKeyPath(keyPath);
};

/**
 * Call this in order to programmatically fold or unfold a property in the
 * rendered YAML.
 * @param {*} keyPath
 */
export const clickGutter = (...keyPath: string[]) => {
  if (keyPath.length === 0) {
    return;
  }
  let curLinePrefix = 0;
  let pathIdx = 0;
  const lines = getLines(window.codeMirror);
  let i;
  for (i = 0; i < lines.length && pathIdx < keyPath.length; i += 1) {
    const match = lines[i].match(/(^\s*)(\w*)/) || [];
    const [, prefix, key] = match.length > 2 ? match : ['', '', ''];
    if (curLinePrefix <= prefix.length && key === keyPath[pathIdx]) {
      curLinePrefix = prefix.length;
      pathIdx += 1;
    }
  }
  window.codeMirror.foldCode(Pos(i - 1));
  updateDiagramFromKeyPath(keyPath);
};

export default class extends Component<RepresentationProps, RepresentationState> {
  unsubscribe: Function;

  constructor(props: RepresentationProps) {
    super(props);
    this.state = {
      code: dump(store.getState().representation.representation),
      isTyping: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  editButtonClicked = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.isTyping
      // eslint-disable-next-line react/destructuring-assignment
      && dump(store.getState().representation.representation) !== this.state.code) {
      // eslint-disable-next-line no-alert
      const sure = window.confirm('Are you sure you want to disregard any edits?');
      if (!sure) {
        return;
      }
    }
    this.setState(({ isTyping, code }) => ({
      code: !isTyping ? dump(store.getState().representation.representation) : code,
      isTyping: !isTyping,
    }));
  };

  saveButtonClicked = () => {
    const { code } = this.state;
    this.setState(({ isTyping }) => ({
      isTyping: !isTyping,
    }));
    /**
     * @todo use RESET_REPRESENTATION instead, when diagram doesn't
     * completely regenerate on save
     */
    store.dispatch({ type: 'RESET_STATE' });
    window.newModel();
    // setTimeout is important, otherwise links don't stay attached to node when it is moved
    setTimeout(() => generateDiagramFromYAML(code));
  };

  loadPizzaBotExampleButtonClicked = () => {
    // eslint-disable-next-line no-alert
    const sure = window.confirm('Are you sure you want to load a pizza bot example flow?');
    if (!sure) {
      return;
    }
    this.setState({ isTyping: false });
    store.dispatch({ type: 'RESET_STATE' });
    window.newModel();
    // setTimeout is important, otherwise links don't stay attached to node when it is moved
    setTimeout(() => generateDiagramFromYAML(pizzaBotExample));
  };

  resetFlowButtonClicked = () => {
    // eslint-disable-next-line no-alert
    const sure = window.confirm('Are you sure you want to reset the current flow?');
    if (!sure) {
      return;
    }
    store.dispatch({ type: 'RESET_STATE' });
    window.newModel();
    generateDiagramFromYAML('');
  };

  render() {
    const { code, isTyping } = this.state;
    const options = {
      lineNumbers: true,
      mode: 'yaml',
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    };

    const editButtonText = isTyping ? 'Cancel' : 'Edit YAML';

    let editButton = (
      <button
        type="button"
        onClick={this.editButtonClicked}
      >
        {editButtonText}
      </button>
    );
    if (!editButtonText) {
      editButton = undefined;
    }

    const saveButtonText = isTyping ? 'Save' : undefined;

    let saveButton = (
      <button
        type="button"
        onClick={this.saveButtonClicked}
      >
        {saveButtonText}
      </button>
    );
    if (!saveButtonText) {
      saveButton = undefined;
    }

    const opts = {
      ...options,
      readOnly: isTyping ? false : 'nocursor',
    };
    const value = isTyping ? code : dump(store.getState().representation.representation);
    const codeView = (
      <CodeMirror
        className="yaml"
        value={value}
        onBeforeChange={(editor, data, newCode) => this.setState({ code: newCode })}
        options={opts}
        onGutterClick={updateDiagramFromGutterClick}
        editorDidMount={(editor) => {
          window.codeMirror = editor;
        }}
      />
    );

    const loadPizzaBotExampleButton = (
      <button
        type="button"
        onClick={this.loadPizzaBotExampleButtonClicked}
      >
        Load Pizza Bot Example YAML
      </button>
    );

    const resetFlowButton = (
      <button
        type="button"
        onClick={this.resetFlowButtonClicked}
      >
        Reset Flow
      </button>
    );

    return (
      <React.Fragment>
        <h2>
          Dialogue Flow YAML (representation of diagram):
        </h2>
        {saveButton}
        {editButton}
        {loadPizzaBotExampleButton}
        {resetFlowButton}
        {codeView}
      </React.Fragment>
    );
  }
}