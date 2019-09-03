// @flow
import React, { Component } from 'react';
import store from '../redux/store';
import './SelectedLink.css';

interface SelectedLinkProps { }

interface SelectedLinkState {}

export default class extends Component<SelectedLinkProps, SelectedLinkState> {
  unsubscribe: Function;

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const link = store.getState().diagramMapping.selectedLink;
    if (!link) {
      return (
        <div className="selectedLink">
          <br />
          Last Selected Link: NULL
          <br />
          <br />
          &nbsp; tip:
          <em>
            &nbsp; shift-select a link to see an update here!
          </em>
        </div>
      );
    }
    const sourcePortLabel = link.sourcePort.label;
    const sourcePortParentName = link.sourcePort.parent.name;
    const targetPortLabel = link.targetPort.label;
    const targetPortParentName = link.targetPort.parent.name;
    return (
      <div className="selectedLink">
        <br />
        Last Selected Link:
        <br />
        <br />
        <li>
          Source Node:
          <ul>
            {sourcePortParentName}
          </ul>
        </li>
        <li>
          Target Node:
          <ul>
            {targetPortParentName}
          </ul>
        </li>
        <li>
          Link:
          <ul>
            {`${sourcePortLabel} <––> ${targetPortLabel}`}
          </ul>
        </li>
      </div>
    );
  }
}