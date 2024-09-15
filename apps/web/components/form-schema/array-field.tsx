"use client";

import { asFieldMeta } from "@flowd/flow/core/fieldMeta";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Field, FieldProps } from "./field";
import { joinName } from "./provider";

export function ArrayField({ schema, name = "" }: FieldProps) {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  const meta = asFieldMeta(schema.description);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Label>{meta?.label ?? name}</Label>
        <Button size="sm" onClick={() => append({})}>
          Add
          <PlusIcon className="size-4 ml-2" />
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          return (
            <div
              className="relative border p-3 rounded-md shadow-sm"
              key={index}
            >
              <button
                className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 size-4 rounded-full"
                onClick={() => remove(index)}
              >
                <Cross2Icon className="size-3 text-white" />
              </button>

              <Field schema={schema.items} name={joinName(name, index)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
