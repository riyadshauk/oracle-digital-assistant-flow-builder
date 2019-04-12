// @flow
import React from 'react';
import { dump } from 'js-yaml';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import store from '../redux/store';

export default () => (
  <SyntaxHighlighter language="yaml" style={docco}>
    {dump(store.getState().representation.representation)}
  </SyntaxHighlighter>
);