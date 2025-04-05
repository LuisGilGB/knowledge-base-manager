import ConnectionsSelector from "@/components/ConnectionsSelector";

const ConnectionsExplorerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-full divide-y md:divide-x">
      <ConnectionsSelector className="md:w-48" />
      <div className="flex-1 p-4 pt-10 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

export default ConnectionsExplorerLayout;
