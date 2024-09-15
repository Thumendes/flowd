"use client";

import { asFieldMeta } from "@flowd/flow/core/fieldMeta";
import { useFormContext } from "react-hook-form";
import { match, P } from "ts-pattern";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ArrayField } from "./array-field";
import { joinName } from "./provider";

export interface FieldProps {
  schema: any;
  name?: string;
}

export function Field({ schema, name = "" }: FieldProps) {
  const form = useFormContext();

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
              />
            );
          })}
        </div>
      );
    })
    .with({ type: "array", description: P.string.optional() }, () => {
      return <ArrayField schema={schema} name={name} />;
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
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {label} {required}
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder={label} {...field} />
                </FormControl>
                <FormMessage />
                {meta?.description && (
                  <FormDescription>{meta.description}</FormDescription>
                )}
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {label} {required}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={minimum}
                    max={maximum}
                    placeholder={label}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {meta?.description && (
                  <FormDescription>{meta.description}</FormDescription>
                )}
              </FormItem>
            )}
          />
        );
      },
    )
    .with(
      { type: "boolean", description: P.string.optional() },
      ({ description }) => {
        const meta = asFieldMeta(description);
        const label = meta?.label ?? name;

        return (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <div className="space-y-1 leading-none">
                  <FormLabel>{label}</FormLabel>
                  {meta?.description && (
                    <FormDescription>{meta.description}</FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
        );
      },
    )
    .otherwise(() => null);

  return field;
}
