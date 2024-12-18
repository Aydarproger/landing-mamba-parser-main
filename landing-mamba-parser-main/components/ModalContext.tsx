import { useModal } from "@/app/hooks/useModal";
import { createContext, useContext } from "react";

export const ModalContext = createContext<
  ReturnType<typeof useModal> | undefined
>(undefined);

export function useModalContext() {
  const context = useContext(ModalContext);

  if (!context) throw new Error("Use realated hook with context");

  return context;
}
