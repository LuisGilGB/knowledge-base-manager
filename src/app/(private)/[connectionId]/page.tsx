import ResourcesExplorer from "@/components/ResourcesExplorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'TestackAI - Connection',
  description: 'Explore your resources located in an external provider and create knowledge bases from them.',
};

const Page = async ({
  params,
}: {
  params: Promise<{ connectionId: string }>
}) => {
  const { connectionId } = await params;
  return (
    <div>
      <ResourcesExplorer connectionId={connectionId} />
    </div>
  )
}

export default Page;
