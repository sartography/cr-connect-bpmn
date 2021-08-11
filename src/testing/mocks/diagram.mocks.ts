export const BPMN_DIAGRAM_EMPTY = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
               xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               id="sid-REPLACE_ME"
               targetNamespace="http://bpmn.io/bpmn"
               exporter="http://bpmn.io"
               exporterVersion="0.10.1">
    <process id="Process_REPLACE_ME" isExecutable="false" />
    <bpmndi:BPMNDiagram id="BpmnDiagram_REPLACE_ME">
      <bpmndi:BPMNPlane id="BpmnPlane_REPLACE_ME" bpmnElement="Process_REPLACE_ME" />
    </bpmndi:BPMNDiagram>
  </definitions>
`;

export const BPMN_DIAGRAM = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
               xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2"
               targetNamespace="http://bpmn.io/bpmn"
               exporter="http://bpmn.io"
               exporterVersion="0.10.1">
    <process id="Process_1" isExecutable="false" />
    <bpmndi:BPMNDiagram id="BpmnDiagram_1">
      <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1" />
    </bpmndi:BPMNDiagram>
  </definitions>
`;

export const BPMN_DIAGRAM_WITH_WARNINGS = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
               xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2"
               targetNamespace="http://bpmn.io/bpmn"
               exporter="http://bpmn.io"
               exporterVersion="0.10.1">
    <process id="Process_1" isExecutable="false" a:b="C" />
    <bpmndi:BPMNDiagram id="BpmnDiagram_1">
      <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1" />
    </bpmndi:BPMNDiagram>
  </definitions>
`;

export const DMN_DIAGRAM_EMPTY = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions
    xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"
    xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/"
    xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/"
  >
    <decision id="Decision_REPLACE_ME" name="Decision_REPLACE_ME">
      <decisionTable id="decisionTable_1">
        <input id="input_1">
          <inputExpression id="inputExpression_1" typeRef="string">
            <text></text>
          </inputExpression>
        </input>
        <output id="output_1" typeRef="string" />
      </decisionTable>
    </decision>
    <dmndi:DMNDI>
      <dmndi:DMNDiagram id="DMNDiagram_REPLACE_ME">
        <dmndi:DMNShape id="DMNShape_REPLACE_ME" dmnElementRef="Decision_REPLACE_ME">
          <dc:Bounds height="80" width="180" x="100" y="100" />
        </dmndi:DMNShape>
      </dmndi:DMNDiagram>
    </dmndi:DMNDI>
  </definitions>
`;

export const DMN_DIAGRAM = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions
    xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"
    xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/"
    xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/"
  >
    <decision id="Decision_REPLACE_ME" name="Decision_REPLACE_ME">
      <decisionTable id="decisionTable_1">
        <input id="input_1" label="num_presents">
          <inputExpression id="inputExpression_1" typeRef="long">
            <text></text>
          </inputExpression>
        </input>
        <output id="output_1" label="message" name="message" typeRef="string" />
        <rule id="DecisionRule_0gl355z">
          <inputEntry id="UnaryTests_06x22gk">
            <text>0</text>
          </inputEntry>
          <outputEntry id="LiteralExpression_0yuxzxi">
            <text>"GREAT Dog!  I love you."</text>
          </outputEntry>
        </rule>
        <rule id="DecisionRule_1s6l5b6">
          <inputEntry id="UnaryTests_1oyo6k0">
            <text>1</text>
          </inputEntry>
          <outputEntry id="LiteralExpression_09t5r62">
            <text>"Oh, Ginger."</text>
          </outputEntry>
        </rule>
        <rule id="DecisionRule_1dvd34d">
          <inputEntry id="UnaryTests_1k557bj">
            <text>2</text>
          </inputEntry>
          <outputEntry id="LiteralExpression_1n1eo23">
            <text>"Sheesh, you silly dog."</text>
          </outputEntry>
        </rule>
        <rule id="DecisionRule_0tqqjg9">
          <inputEntry id="UnaryTests_0dnd50d">
            <text>&gt; 2</text>
          </inputEntry>
          <outputEntry id="LiteralExpression_0fk5uhh">
            <text>"!@#$!@#$"</text>
          </outputEntry>
        </rule>
      </decisionTable>
    </decision>
    <dmndi:DMNDI>
      <dmndi:DMNDiagram id="DMNDiagram_REPLACE_ME">
        <dmndi:DMNShape id="DMNShape_REPLACE_ME" dmnElementRef="Decision_REPLACE_ME">
          <dc:Bounds height="80" width="180" x="100" y="100" />
        </dmndi:DMNShape>
      </dmndi:DMNDiagram>
    </dmndi:DMNDI>
  </definitions>
`;

export const DMN_DIAGRAM_WITH_WARNINGS = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions
    xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"
    xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/"
    xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/"
  >
    <decision id="Decision_REPLACE_ME" name="Decision 1" a:b="C" />
    <dmndi:DMNDI>
      <dmndi:DMNDiagram id="DMNDiagram_REPLACE_ME">
        <dmndi:DMNShape id="DMNShape_REPLACE_ME" dmnElementRef="Decision_REPLACE_ME">
          <dc:Bounds height="80" width="180" x="100" y="100" />
        </dmndi:DMNShape>
      </dmndi:DMNDiagram>
    </dmndi:DMNDI>
  </definitions>
`;

export const DMN_V1_1_DIAGRAM_EMPTY = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions
    xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"
    xmlns:biodi="http://bpmn.io/schema/dmn/biodi/1.0"
    id="Definitions_REPLACE_ME"
    name="DRD"
    namespace="http://camunda.org/schema/1.0/dmn"
  >
    <decision id="Decision_REPLACE_ME" name="Decision 1">
      <extensionElements>
        <biodi:bounds x="157" y="81" width="180" height="80" />
      </extensionElements>
      <decisionTable id="decisionTable_1">
        <input id="input_1">
          <inputExpression id="inputExpression_1" typeRef="string">
            <text></text>
          </inputExpression>
        </input>
        <output id="output_1" typeRef="string" />
      </decisionTable>
    </decision>
  </definitions>
`;


export const DMN_V1_1_DIAGRAM = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions
    xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"
    xmlns:biodi="http://bpmn.io/schema/dmn/biodi/1.0"
    id="Definitions_1hao5sb" name="DRD"
    namespace="http://camunda.org/schema/1.0/dmn"
    exporter="Camunda Modeler"
    exporterVersion="3.4.1"
  >
    <decision id="presents_to_message" name="Decision 1">
      <extensionElements>
        <biodi:bounds x="150" y="150" width="180" height="80" />
      </extensionElements>
      <decisionTable id="decisionTable_1">
        <input id="input_1" label="num_presents">
          <inputExpression id="inputExpression_1" typeRef="long">
            <text></text>
          </inputExpression>
        </input>
        <output id="output_1" label="message" name="message" typeRef="string" />
        <rule id="DecisionRule_0gl355z">
          <inputEntry id="UnaryTests_06x22gk">
            <text>0</text>
          </inputEntry>
          <outputEntry id="LiteralExpression_0yuxzxi">
            <text>"GREAT Dog!  I love you."</text>
          </outputEntry>
        </rule>
        <rule id="DecisionRule_1s6l5b6">
          <inputEntry id="UnaryTests_1oyo6k0">
            <text>1</text>
          </inputEntry>
          <outputEntry id="LiteralExpression_09t5r62">
            <text>"Oh, Ginger."</text>
          </outputEntry>
        </rule>
        <rule id="DecisionRule_1dvd34d">
          <inputEntry id="UnaryTests_1k557bj">
            <text>2</text>
          </inputEntry>
          <outputEntry id="LiteralExpression_1n1eo23">
            <text>"Sheesh, you silly dog."</text>
          </outputEntry>
        </rule>
        <rule id="DecisionRule_0tqqjg9">
          <inputEntry id="UnaryTests_0dnd50d">
            <text>&gt; 2</text>
          </inputEntry>
          <outputEntry id="LiteralExpression_0fk5uhh">
            <text>"!@#$!@#$"</text>
          </outputEntry>
        </rule>
      </decisionTable>
    </decision>
  </definitions>
`;

export const DMN_V1_1_DIAGRAM_WITH_WARNINGS = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions
    xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"
    xmlns:biodi="http://bpmn.io/schema/dmn/biodi/1.0"
    id="Definitions_1hao5sb" name="DRD"
    namespace="http://camunda.org/schema/1.0/dmn"
    exporter="Camunda Modeler"
    exporterVersion="3.4.1"
  >
    <decision id="presents_to_message" name="Decision 1" a:b="C" />
  </definitions>
`;
