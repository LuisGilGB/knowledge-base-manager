import ResourcesExplorer from "@/components/ResourcesExplorer";

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
