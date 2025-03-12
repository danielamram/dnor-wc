import React, { useEffect, useRef } from "react";

interface DinorButtonProps {
  title?: string;
  variant?: "primary-filled" | "secondary-filled";
  size?: "tiny" | "small" | "medium" | "large" | "huge";
  onClick?: () => void;
  children?: React.ReactNode;
}

export const DinorButton: React.FC<DinorButtonProps> = ({
  title,
  variant,
  size,
  onClick,
}) => {
  const buttonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const button = buttonRef.current;

    if (button) {
      // @ts-ignore
      button.addEventListener("dataSent", onClick);
    }

    return () => {
      if (button) {
        // @ts-ignore
        button.removeEventListener("dataSent", onClick);
      }
    };
  }, [onClick]);

  return (
    // @ts-ignore
    <dn-button ref={buttonRef} title={title} type={variant} size={size}>
      {title}
      {/* @ts-ignore */}
    </dn-button>
  );
};
