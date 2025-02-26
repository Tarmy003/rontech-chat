import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper';
import React from 'react';

const Layout = ({ children }: React.PropsWithChildren) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default Layout;