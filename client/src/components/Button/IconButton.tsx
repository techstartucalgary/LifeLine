import { ReactNode } from "react";
import Button, { ButtonProps } from "./Button";
import { classnames } from "../../Utilities";

interface IconButtonProps extends ButtonProps {
  icon: ReactNode | string;
  iconClassName?: string;
}

const IconButton = ({ icon, iconClassName, ...args }: IconButtonProps) => {
  return (
    <Button {...args} className={classnames("px-2 md:px-4 py-3", args.className)}>
      <span className={classnames("material-symbols-outlined text-3xl md:text-2.5xl m-auto", iconClassName)}>{icon}</span>
    </Button>
  );
};

export default IconButton;
export type { IconButtonProps };