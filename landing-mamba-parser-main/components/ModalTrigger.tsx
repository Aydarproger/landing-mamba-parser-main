"use client";

import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { useModalContext } from "./ModalContext";

export function ModalTrigger({
  children,
  ...rest
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const { setOpen } = useModalContext();
  return (
    <button {...rest} onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}
