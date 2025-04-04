import ResourcesExplorer from "@/components/ResourcesExplorer";

const Page = async ({
  params,
}: {
  params: Promise<{ connectionId: string, resourceId: string }>
}) => {
  const { connectionId, resourceId } = await params;
  return (
    <div>
      <ResourcesExplorer connectionId={connectionId} resourceId={resourceId} />
    </div>
  )
}

export default Page;
