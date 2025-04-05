import ConnectionsSelector from "@/components/ConnectionsSelector";

const ConnectionsExplorerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex gap-x-4 h-full divide-x">
      <ConnectionsSelector className="w-48" />
      <div className="flex-1 p-4 pt-10 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

export default ConnectionsExplorerLayout;
