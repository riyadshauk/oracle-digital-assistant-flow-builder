// @flow
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Collapsible from 'react-collapsible';
import './Legend.css';

export default () => (
  <div>
    <h5>
      Psst... Drag-and-drop components from the side bar (on the left) onto the
      canvas (in the middle)!
    </h5>
    <Collapsible trigger="General Usage">
      <h4>
        This is a bidirectional&nbsp;
        <a href="https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/dialog-flow-definition.html#GUID-CE86A43E-286A-462C-8B80-0BA2666D80F7">dialogue-flow</a>
        -builder for the Oracle Digital Assistant (ODA).
      </h4>
      <h3>
        1. Generate a Visual Representation of ODA YAML (the dialogue flow)
      </h3>
      <li>
        Simply click 'Edit YAML', and copy-paste your YAML code in.
      </li>
      <h3>
        2. Declaratively Generate ODA YAML (the dialogue flow)
      </h3>
      <li>
        • Drag-and-drop bot components from the side bar (on the left) onto the
        canvas (in the middle).
      </li>
      <br />
      <li>
        • To add&nbsp;
        <strong>transitions</strong>
        ,&nbsp;
        <strong>actions</strong>
        , or&nbsp;
        <strong>variables</strong>
        &nbsp;you just need to click-and-drag from the appropriate pair of
        rectangles on the diagram.
      </li>
      <br />
      <li>
        • Click&nbsp;
        <strong>Load Pizza Bot Example YAML</strong>
        &nbsp;and learn from example.
      </li>
    </Collapsible>
    <br />
    <Collapsible trigger="'Extra' Features Index">
      <br />
      <li>
        <strong>
          shift-click
        </strong>
        : to select multiple elements on the diagram canvas (or simply to select a transition link).
      </li>
      <br />
      <li>
        <strong>
          shift-delete
        </strong>
        : to delete an element on the diagram (WARNING: if you don't want to delete multiple items,
        make sure you haven't shift-selected multiple items prior to hitting shift-delete).
      </li>
      <br />
      <li>
        <strong>
          double-click the title of a node
        </strong>
        : to toggle visibility of the dialogue flow in both the diagram and the YAML code.
      </li>
      <br />
      <li>
        <strong>
          click the triangle next to a line number
        </strong>
        : to toggle visibility of the dialogue flow in both the diagram and the YAML code.
      </li>
      <br />
      <li>
        <strong>
          click-and-drag sidebar borders
        </strong>
        : to horizontally resize the two sidebars.
      </li>
    </Collapsible>
    <br />
    <h5>
      Pro-tip: You can scale the size of the diagram using your trackpad's
      standard zoom gestures (or by simply scrolling on the canvas)!
    </h5>
  </div>
);