import AppHeader from "@/components/AppHeader";
import PrivateLayoutComponent from "@/components/PrivateLayout";

const PrivateLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <PrivateLayoutComponent header={<AppHeader />}>
      {children}
    </PrivateLayoutComponent>
  );
}

export default PrivateLayout;
