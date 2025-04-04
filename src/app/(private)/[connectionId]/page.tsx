import ConnectionFileExplorer from "@/components/ConnectionFileExplorer";

const Page = async ({
  params,
}: {
  params: Promise<{ connectionId: string }>
}) => {
  const { connectionId } = await params
  return (
    <div>
      <ConnectionFileExplorer connectionId={connectionId} />
    </div>
  )
}

export default Page;
