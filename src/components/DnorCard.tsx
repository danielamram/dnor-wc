import React, { PropsWithChildren } from "react";

interface DnorCardProps {
  title: string;
}

export const DnorCard: React.FC<PropsWithChildren<DnorCardProps>> = ({
  title,
  children,
}) => {
  // @ts-ignore
  return <dn-card title={title}>{children}</dn-card>;
};
