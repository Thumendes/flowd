"use client";

import { asFieldMeta } from "@flowd/flow/core/fieldMeta";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { match, P } from "ts-pattern";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FieldProps {
  schema: any;
  className?: string;
  name?: string;
}

function joinName(...keys: (string | number | undefined)[]) {
  keys = keys.filter((key) => typeof key === "number" || !!key);

  return keys.join(".");
}

export function ArrayField({ schema, name, className }: FieldProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Label>{name}</Label>
        <Button size="sm" onClick={() => setCount(count + 1)}>
          Add
          <PlusIcon className="size-4 ml-2" />
        </Button>
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => {
          return (
            <div className="border p-3 rounded-md shadow-sm" key={index}>
              <Field schema={schema} name={joinName(name, index)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Field({ schema, name, className }: FieldProps) {
  const field = match(schema)
    .with({ type: "object", description: P.string.optional() }, () => {
      return (
        <div className="space-y-2">
          {Object.keys(schema.properties).map((key) => {
            return (
              <Field
                key={key}
                schema={schema.properties[key]}
                name={joinName(name, key)}
                className="space-y-4"
              />
            );
          })}
        </div>
      );
    })
    .with({ type: "array", description: P.string.optional() }, () => {
      return <ArrayField schema={schema.items} name={name} />;
    })
    .with(
      { type: "string", description: P.string.optional() },
      ({ description }) => {
        const meta = asFieldMeta(description);
        const label = meta?.label ?? name;
        const required = meta?.isRequired ? (
          <span className="text-red-500">*</span>
        ) : null;

        return (
          <div>
            <Label>
              {label}
              {required}
            </Label>
            <Input type="text" placeholder={label} name={name} />
            {meta?.description && (
              <p className="text-sm text-muted-foreground">
                {meta.description}
              </p>
            )}
          </div>
        );
      },
    )
    .with(
      {
        type: "number",
        minimum: P.number.optional(),
        maximum: P.number.optional(),
        description: P.string.optional(),
      },
      ({ maximum, minimum, description }) => {
        const meta = asFieldMeta(description);
        const label = meta?.label ?? name;
        const required = meta?.isRequired ? (
          <span className="text-red-500">*</span>
        ) : null;

        return (
          <div>
            <Label>
              {label}
              {required}
            </Label>
            <Input
              type="number"
              placeholder={label}
              min={minimum}
              max={maximum}
            />
            {meta?.description && (
              <p className="text-sm text-muted-foreground">
                {meta.description}
              </p>
            )}
          </div>
        );
      },
    )
    .with({ type: "boolean", description: P.string.optional() }, () => {
      return <Checkbox />;
    })
    .otherwise(() => null);

  return field;
}
