// @flow
/* eslint-disable react/no-unescaped-entities */
import React from 'react';

export default () => (
  <div>
    <h1>
      Legend of non-trivial key combinations:
    </h1>
    <li>
      <strong>
        shift-click
      </strong>
      : to select multiple elements on the diagram canvas (or simply to select a transition link)
    </li>
    <li>
      <strong>
        shift-delete
      </strong>
      : to delete an element on the diagram (WARNING: if you don't want to delete multiple items,
      make sure you haven't shift-selected multiple items prior to hitting shift-delete)
    </li>
  </div>
);