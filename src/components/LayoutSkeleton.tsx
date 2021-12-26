import { type ReactNode } from 'react';

export function LayoutSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto">
      {/* <Navbar className="mt-8 mb-6 rounded-md bp3-dark">
        <NavbarGroup>
          <NavbarHeading className="bp3-skeleton">
            Discoverify<span className="text-gray-3">.app</span>
          </NavbarHeading>
          <NavbarDivider />

          <Button minimal icon="home" text="Home" className="bp3-skeleton" />
          <Button minimal icon="user" text="Artists" className="bp3-skeleton" />
        </NavbarGroup>
        <NavbarGroup align="right">
          <Button
            minimal
            className="bp3-skeleton"
            text="Display name"
            icon={<div className="w-8 h-8" />}
          />
        </NavbarGroup>
      </Navbar> */}
      {children}
    </div>
  );
}
