"use client";

import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";

export function joinName(...keys: (string | number | undefined)[]) {
  keys = keys.filter((key) => typeof key === "number" || !!key);

  return keys.join(".");
}

export function FieldProvider({
  children,
  onChange,
}: {
  children: ReactNode;
  onChange?: (data: any) => void;
}) {
  const form = useForm();
  form.watch();

  useEffect(() => {
    const listener = form.watch((data) => onChange?.(data));
    return () => listener.unsubscribe();
  }, []);

  return <Form {...form}>{children}</Form>;
}
