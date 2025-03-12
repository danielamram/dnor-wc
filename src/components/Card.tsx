import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title: string;
}

export const DinorCard: React.FC<CardProps> = ({ title }) => {
  return (
    // @ts-ignore - Ignore type checking for web component
    <dn-card title={title}>
      <div>just a random content</div>
      {/* @ts-ignore */}
    </dn-card>
  );
};
