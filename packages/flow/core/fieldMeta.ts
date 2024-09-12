interface FieldMetaOptions {
  _fieldMeta: true;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  description?: string;
}

class FieldMeta<Options extends FieldMetaOptions = FieldMetaOptions> {
  constructor(private options: Options) {}

  setLabel<Label extends string>(label: Label) {
    return new FieldMeta<Options & { label: Label }>({
      ...this.options,
      label,
    });
  }

  setPlaceholder<Placeholder extends string>(placeholder: Placeholder) {
    return new FieldMeta<Options & { placeholder: Placeholder }>({
      ...this.options,
      placeholder,
    });
  }

  setType<Type extends string>(type: Type) {
    return new FieldMeta<Options & { type: Type }>({
      ...this.options,
      type,
    });
  }

  required() {
    return new FieldMeta<Options & { required: true }>({
      ...this.options,
      required: true,
    });
  }

  setDescription<Description extends string>(description: Description) {
    return new FieldMeta<Options & { description: Description }>({
      ...this.options,
      description,
    });
  }

  get() {
    return JSON.stringify(this.options);
  }

  get label() {
    return this.options.label;
  }

  get type() {
    return this.options.type;
  }

  get isRequired() {
    return this.options.required ?? false;
  }

  get description() {
    return this.options.description;
  }
}

export function fieldMeta<Label extends string>(label: Label) {
  return new FieldMeta({ _fieldMeta: true }).setLabel(label);
}

export function isFieldMeta(value: unknown): value is FieldMetaOptions {
  if (typeof value === "string") {
    try {
      const options = JSON.parse(value);
      if ("_fieldMeta" in options && options._fieldMeta) return true;
    } catch {
      return false;
    }
  }

  if (typeof value === "object" && value !== null) {
    if ("_fieldMeta" in value && value._fieldMeta) {
      return true;
    }
  }

  return false;
}

export function asFieldMeta(value: unknown) {
  if (value instanceof FieldMeta) return value;
  if (typeof value !== "string") return null;

  try {
    const options = JSON.parse(value);

    if ("_fieldMeta" in options && options._fieldMeta) {
      return new FieldMeta(options);
    }
  } catch {}

  return null;
}
