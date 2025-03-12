import React, { FC } from "react";
import "./_grid.scss";

interface DnorGridProps {
  children: React.ReactNode;
}

export const DnorGrid: FC<DnorGridProps> = ({ children }) => {
  return <div className="dn-grid">{children}</div>;
};
