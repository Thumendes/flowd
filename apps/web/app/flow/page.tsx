import { FlowRoot } from "@/components/flow/root";
import { getRegistry } from "@/lib/services/registry";

export default async function FlowPage() {
  const registry = await getRegistry();

  return (
    <div>
      <FlowRoot registry={registry} />
    </div>
  );
}
