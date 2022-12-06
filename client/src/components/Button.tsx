import { ReactNode, ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "filled" | "tonal" | "text";
  className?: string;
};

const base = `
  bg-transparent text-primary text-center font-medium tracking-[0.01rem]
  px-6 py-3 pt-[0.67rem] align-middle rounded-full relative
  transition-all before:transition-all

  before:block before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0
  before:bg-transparent before:user-select-none before:-z-1 before:rounded-full

  hover:before:bg-state-layers-light-primary/[.08]
  focus:before:bg-state-layers-light-primary/[.12]
  active:before:bg-state-layers-light-primary/[.12]

  disabled:bg-light-on-surface/[.12] disabled:text-light-on-surface/[.38] disabled:cursor-not-allowed
`;

const classnames = {
  filled: twMerge(base, "bg-primary text-white hover:before:bg-light-on-primary/[.08] focus:before:bg-light-on-primary/[.12] active:before:bg-light-on-primary/[.12]"),
  text: twMerge(base, "px-3 disabled:bg-transparent disable:before:bg-transparent"),
  tonal: twMerge(base, "bg-light-secondary-container text-light-on-secondary-container hover:before:bg-state-layers-on-secondary-container/[.08] focus:before:bg-state-layers-on-secondary-container/[.12] active:before:bg-state-layers-on-secondary-container/[.12]"),
};

const Button = ({ variant = "text", children, className, ...props }: ButtonProps) => {
  return <button className={twMerge(classnames[variant], className)} {...props}>{children}</button>;
};

export default Button;
