"use client";

import { Registry } from "@/lib/services/registry";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { useDebounce } from "react-use";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field } from "../form-schema/field";
import { FieldProvider } from "../form-schema/provider";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function createAgentNode(agent: Registry) {
  return function AgentNode({ id, data, selected }: NodeProps) {
    const { updateNodeData } = useReactFlow();
    const [isOpen, setIsOpen] = useState(false);

    const [onChange] = useDebounce(
      (payload: any) => updateNodeData(id, payload),
      250,
      [id],
    );

    return (
      <div
        className={cn(
          "bg-background border rounded-lg w-[300px]",
          selected && "ring-2 ring-indigo-500",
        )}
      >
        <div className="p-2 flex justify-between">
          <div className="grid">
            <span>{agent.label}</span>
            <span className="text-xs text-muted-foreground">{id}</span>
          </div>

          <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)}>
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <div className="p-2 px-3 relative bg-muted">
          <Handle
            style={{ height: 12, width: 12 }}
            type="source"
            position={Position.Left}
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Input</span>
            <span>Output</span>
          </div>

          <Handle
            style={{ height: 12, width: 12 }}
            type="target"
            position={Position.Right}
          />
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-h-[75vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{agent.label}</DialogTitle>
              <DialogDescription>{agent.description}</DialogDescription>
            </DialogHeader>

            <FieldProvider onChange={onChange}>
              <Field schema={agent.schema.definitions.schema} />
            </FieldProvider>
          </DialogContent>
        </Dialog>
      </div>
    );
  };
}
