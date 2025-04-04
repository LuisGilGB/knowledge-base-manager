import PrivateLayoutComponent from "@/components/PrivateLayout";

const PrivateLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <PrivateLayoutComponent>
      {children}
    </PrivateLayoutComponent>
  );
}

export default PrivateLayout;
