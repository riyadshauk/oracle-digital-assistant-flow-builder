import { safeLoad } from 'js-yaml';

export const yaml = `
metadata:
  platformVersion: "1.0"
main: true
name: "PizzaBot"
parameters:
  age: 18
context:
  variables:
    size: "PizzaSize"
    type: "PizzaType"
    crust: "PizzaCrust"
    iResult: "nlpresult"
    sameAsLast: "YesNo"
states:
  intent:
    component: "System.Intent"
    properties:
      variable: "iResult"
    transitions:
      actions:
        OrderPizza: "checklastorder"
        CancelPizza: "cancelorder"
        unresolvedIntent: "unresolved"
  checklastorder:
    component: "System.ConditionExists"
    properties:
      variable: "user.lastsize"
    transitions:
      actions:
        exists: "lastorderprompt"
        notexists: "resolvesize"
  lastorderprompt:
    component: "System.List"
    properties:
      options: "Yes,No"
      prompt: "Same pizza as last time?"
      variable: "sameAsLast"
    transitions: {}
  rememberchoice:
    component: "System.ConditionEquals"
    properties:
      variable: "sameAsLast"
      value: "No"
    transitions:
      actions:
        equal: "resolvesize"
        notequal: "load"
  resolvesize:
    component: "System.SetVariable"
    properties:
      variable: "size"
      value: "\${iResult.value.entityMatches['PizzaSize'][0]}"
    transitions: {}
  resolvecrust:
    component: "System.SetVariable"
    properties:
      variable: "crust"
      value: "\${iResult.value.entityMatches['PizzaCrust'][0]}"
    transitions: {}
  resolvetype:
    component: "System.SetVariable"
    properties:
      variable: "type"
      value: "\${iResult.value.entityMatches['PizzaType'][0]}"
    transitions: {}
  needcheckage:
    component: "System.ConditionExists"
    properties:
      variable: "user.lastsize"
    transitions:
      actions:
        exists: "crust"
        notexists: "askage"
  askage:
    component: "System.Output"
    properties:
      text: "How old are you?"
    transitions: {}
  checkage:
    component: "AgeChecker"
    properties:
      minAge: 18
    transitions:
      actions:
        allow: "crust"
        block: "underage"
  load:
    component: "System.CopyVariables"
    properties:
      from: "user.lastsize,user.lasttype,user.lastcrust"
      to: "size,type,crust"
    transitions: {}
  crust:
    component: "System.List"
    properties:
      options: "Thick,Thin,Stuffed,Pan"
      prompt: "What crust do you want for your Pizza?"
      variable: "crust"
    transitions: {}
  size:
    component: "System.List"
    properties:
      options: "Large,Medium,Small"
      prompt: "What size Pizza do you want?"
      variable: "size"
    transitions: {}
  type:
    component: "System.Text"
    properties:
      prompt: "What Type of Pizza do you want?"
      variable: "type"
    transitions: {}
  save:
    component: "System.CopyVariables"
    properties:
      from: "size,type,crust"
      to: "user.lastsize,user.lasttype,user.lastcrust"
    transitions: {}
  done:
    component: "System.Output"
    properties:
      text: "Your \${size.value} \${type.value} Pizza is on its way."
    transitions:
      return: "done"
  underage:
    component: "System.Output"
    properties:
      text: "You are too young to order a pizza"
    transitions:
      return: "underage"
  cancelorder:
    component: "System.Output"
    properties:
      text: "Your order is cancelled"
    transitions:
      return: "cancelOrder"
  unresolved:
    component: "System.Output"
    properties:
      text: "I don't understand. What do you want to do?"
    transitions:
      return: "unresolved"
`;

export const json = safeLoad(yaml);