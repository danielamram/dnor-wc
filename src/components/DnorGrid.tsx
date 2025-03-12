import React, { ReactNode } from "react";
import "../styles/_grid.scss";

export interface GridProps {
  /**
   * The content to be rendered inside the grid
   */
  children: ReactNode;

  /**
   * Number of rows in the grid (defaults to 8)
   */
  rows?: 2 | 4 | 6 | 8;

  /**
   * Custom class names to apply to the grid
   */
  className?: string;
}

export interface GridItemProps {
  /**
   * The content to be rendered inside the grid item
   */
  children: ReactNode;

  /**
   * Number of columns the item spans (1-12)
   */
  colSpan?: number | "full";

  /**
   * Starting column for the item (1-11)
   */
  colStart?: number;

  /**
   * Number of rows the item spans (1-8)
   */
  rowSpan?: number | "full";

  /**
   * Starting row for the item (1-7)
   */
  rowStart?: number;

  /**
   * Custom class names to apply to the grid item
   */
  className?: string;
}

export const DnorGrid: React.FC<GridProps> = ({
  children,
  rows,
  className = "",
}) => {
  const rowsClass = rows ? `dn-grid-rows-${rows}` : "";

  return (
    <div className={`dn-grid ${rowsClass} ${className}`.trim()}>{children}</div>
  );
};

export const DnorGridItem: React.FC<GridItemProps> = ({
  children,
  colSpan,
  colStart,
  rowSpan,
  rowStart,
  className = "",
}) => {
  const classes = [className];

  if (colSpan) {
    classes.push(`dn-grid-col-span-${colSpan}`);
  }

  if (colStart) {
    classes.push(`dn-grid-col-start-${colStart}`);
  }

  if (rowSpan) {
    classes.push(`dn-grid-row-span-${rowSpan}`);
  }

  if (rowStart) {
    classes.push(`dn-grid-row-start-${rowStart}`);
  }

  return <div className={classes.join(" ").trim()}>{children}</div>;
};

export default DnorGrid;
