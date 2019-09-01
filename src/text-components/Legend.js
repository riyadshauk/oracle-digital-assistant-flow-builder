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
      <h1>
        This is a bidirectional&nbsp;
        <a href="https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/dialog-flow-definition.html#GUID-CE86A43E-286A-462C-8B80-0BA2666D80F7">dialogue-flow</a>
        -builder for the Oracle Digital Assistant (ODA).
      </h1>
      <h2>
        1. Generate a Visual Representation of ODA YAML (the dialogue flow)
      </h2>
      <li>
        Simply click 'Edit YAML', and copy-paste your YAML code in.
      </li>
      <h2>
        2. Declaratively Generate ODA YAML (the dialogue flow)
      </h2>
      <li>
        Drag-and-drop bot components from the side bar (on the left) onto the
        canvas (in the middle).
      </li>
      <li>
        Notice the YAML update as the diagram updates.
      </li>
      <li>
        You may continue to add to or edit things on the diagram, and the YAML
        will appropriately update.
      </li>
      <li>
        You may edit the YAML, and a diagram representation of it will
        re-generate on the canvas (in the middle).
      </li>
      <li>
        To add&nbsp;
        <strong>transitions</strong>
        ,&nbsp;
        <strong>actions</strong>
        , or&nbsp;
        <strong>variables</strong>
        you just need to click-and-drag from the appropriate pair of rectangles on the diagram.
      </li>
      <li>
        Not clear? Click on the&nbsp;
        <strong>Load Pizza Bot Example YAML</strong>
        &nbsp; button for a visual demonstration of how a dialogue flow diagram
        looks that represents a typical example Pizza Bot dialogue flow YAML.
      </li>
    </Collapsible>
    <br />
    <Collapsible trigger="Legend of non-trivial key combinations">
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
    </Collapsible>
    <br />
    <h5>
      Pro-tip: You can scale the size of the diagram using your trackpad's
      standard zoom gestures (or by simply scrolling on the canvas)!
    </h5>
  </div>
);