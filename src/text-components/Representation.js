// @flow
/* eslint-env browser */
import React, { Component } from 'react';
import { dump } from 'js-yaml';
import SyntaxHighlighter from 'react-syntax-highlighter';
import CodeMirror from 'react-codemirror';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import store from '../redux/store';
import generateDiagramFromYAML from '../generateDiagramFromYAML';
import { yaml as pizzaBotExample } from '../helpers/PizzaBotFlowExample';
import { resetRepresentation } from '../redux/actions/representation';

require('codemirror/mode/yaml/yaml');

interface RepresentationProps { }

interface RepresentationState {
  code: string,
  isTyping: boolean,
}

export default class extends Component<RepresentationProps, RepresentationState> {
  unsubscribe: Function;

  constructor(props) {
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

  updateCode = (newCode: string) => {
    this.setState({
      code: newCode,
    });
  };

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
    store.dispatch({ type: 'RESET_STATE' });
    window.newModel();
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
    setTimeout(() => generateDiagramFromYAML(''));
  };

  render() {
    const { code, isTyping } = this.state;
    const options = {
      lineNumbers: true,
      mode: 'yaml',
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

    let codeView;
    if (isTyping) {
      codeView = <CodeMirror value={code} onChange={this.updateCode} options={options} />;
    } else {
      codeView = (
        <SyntaxHighlighter language="yaml" style={docco}>
          {dump(store.getState().representation.representation)}
        </SyntaxHighlighter>
      );
    }

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