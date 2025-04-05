import ResourcesExplorer from "@/components/ConnectionResourcesExplorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'TestackAI - Connection',
  description: 'Explore your resources located in an external provider and create knowledge bases from them.',
};

const ConnectionPage = async ({
  params,
}: {
  params: Promise<{ connectionId: string }>
}) => {
  const { connectionId } = await params;
  return (
    <div className="h-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Connection Explorer</h2>
      <ResourcesExplorer connectionId={connectionId} className="flex-1 overflow-hidden" />
    </div>
  )
}

export default ConnectionPage;
