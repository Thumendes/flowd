"use client";

import "@xyflow/react/dist/style.css";

import { Registry } from "@/lib/services/registry";
import { uniqueId } from "@flowd/utils";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Node,
  NodeTypes,
  Panel,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { DragEvent, useCallback, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { createAgentNode } from "./node";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface FlowRootProps {
  registry: Registry[];
}

export function FlowRoot({ registry }: FlowRootProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  function onDragStart(event: DragEvent<HTMLDivElement>, nodeType: string) {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  }

  const onDrop = useCallback(
    (event: DragEvent) => {
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData(
        "application/reactflow",
      ) as keyof NodeTypes;

      const position = reactFlowInstance.flowToScreenPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      setNodes((nodes) => [
        ...nodes,
        {
          id: uniqueId(),
          type: type,
          position: position,
          data: {},
        } satisfies Node,
      ]);
    },
    [reactFlowWrapper, reactFlowInstance],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const nodeTypes = useMemo(() => {
    return registry.reduce((nodeTypes, agent) => {
      nodeTypes[agent.name] = createAgentNode(agent);
      return nodeTypes;
    }, {} as NodeTypes);
  }, [registry]);

  return (
    <div className="w-screen h-screen grid grid-cols-[60px_1fr] grid-rows-[60px_1fr]">
      <div className="col-span-2 border-b flex items-center justify-between px-4">
        <div>
          <h1 className="text-lg font-semibold leading-3">Editor de fluxos</h1>
          <span className="text-sm text-muted-foreground">
            Editor de fluxos
          </span>
        </div>

        <div className="">
          <Button variant="outline">Salvar</Button>
          <Button>Salvar</Button>
        </div>
      </div>

      <div className="border-r">
        <div></div>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          {registry.map((agent) => (
            <div
              key={agent.name}
              draggable
              onDragStart={(event) => onDragStart(event, agent.name)}
              className="p-2"
            >
              <Button className="w-full">{agent.label}</Button>
            </div>
          ))}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel>
          <div className="w-full h-full" ref={reactFlowWrapper}>
            <ReactFlow
              onInit={setReactFlowInstance}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onDrop={onDrop}
              onDragOver={onDragOver}
              snapGrid={[16, 16]}
              snapToGrid
            >
              <Controls position="bottom-right" />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
