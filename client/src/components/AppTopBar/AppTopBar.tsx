import { ReactElement, RefObject } from "react";

import { classnames } from "../../Utilities";

import CompactHeadline from "./CompactHeadline";
import Headline from "./Headline";
import { IconButton, IconButtonProps } from "./Subcomponents";

interface AppTopBarProps2 {
  variant?: "small" | "medium" | "large";
  elevation?: boolean;
  title?: ReactElement | string;
  subtitle?: ReactElement | string;
  leadingNavigation?: ReactElement;
  trailingIcon?: ReactElement;
  containerRef?: RefObject<HTMLDivElement>;
}

const useAppTopBar = ({
  variant = "large",
  elevation,
  title,
  subtitle,
  leadingNavigation,
  trailingIcon,
  containerRef,
}: AppTopBarProps2) => {
  const compactHeadline = () => (
    <CompactHeadline
      title={<>{title}</>}
      titleClassName={classnames(variant === "small" && "!opacity-100")}
      leadingNavigation={leadingNavigation}
      trailingIcon={trailingIcon}
      elevation={elevation}
      containerRef={containerRef}
    />
  );

  const headline = () => (
    <Headline
      className={classnames(
        variant === "small" && "h-0",
        variant === "large" && "pt-6"
      )}
      title={<>{title}</>}
      subtitle={<>{subtitle}</>}
      containerRef={containerRef}
    />
  );

  return [compactHeadline, headline];
};

export default useAppTopBar;
export { IconButton, useAppTopBar };
export type { AppTopBarProps2, IconButtonProps };
