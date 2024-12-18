"use client";

import { ModalContext } from "@/components/ModalContext";
import { PropsWithChildren } from "react";
import { useModal } from "./hooks/useModal";
import { SubscriptionModal } from "@/components/SubscriptionModal";

export function Providers({ children }: PropsWithChildren) {
  const { open, setOpen } = useModal();
  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}

      <SubscriptionModal open={open} setOpen={setOpen} />
    </ModalContext.Provider>
  );
}
