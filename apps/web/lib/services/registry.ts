export interface Registry {
  name: string;
  label: string;
  description: string;
  schema: { definitions: { schema: any } };
}

export async function getRegistry() {
  const res = await fetch("http://localhost:4040/registry");
  const data: Registry[] = await res.json();
  return data;
}
