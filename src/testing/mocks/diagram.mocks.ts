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

export const DMN_DIAGRAM = `
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

export const DMN_DIAGRAM_WITH_WARNINGS = `
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
