import { Field } from "@/components/form-schema/field";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { redirect } from "next/navigation";
import { getRegistry } from "@/lib/services/registry";

export default async function Home() {
  const data = await getRegistry();

  return (
    <main className="container mx-auto">
      <header className="py-4">
        <h1 className="text-xl font-semibold">Flowd</h1>
      </header>

      <div className="space-y-5">
        {data.map((registry) => (
          <div key={registry.name} className="border shadow-md rounded-md p-4">
            <div className="mb-3">
              <h1 className="text-lg font-semibold">{registry.label}</h1>
              <p className="text-muted-foreground">{registry.description}</p>
            </div>
            <Collapsible>
              <CollapsibleTrigger>Ver formulário</CollapsibleTrigger>
              <CollapsibleContent>
                <Field schema={registry.schema.definitions.schema} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    </main>
  );
}
