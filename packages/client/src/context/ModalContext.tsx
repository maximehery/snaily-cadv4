import { useRouter } from "next/router";
import * as React from "react";

interface Context {
  isOpen: (id: string) => boolean;
  closeModal: (id: string) => void;
  openModal: <T = unknown>(id: string, payload?: T) => void;
  getPayload: <T = unknown>(id: string) => T | null;
}

type Payloads = Record<string, any>;
const ModalContext = React.createContext<Context | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState<string[]>([]);
  const [payloads, setPayloads] = React.useState<Payloads>({});
  const router = useRouter();

  function isOpen(id: string) {
    return open.includes(id);
  }

  function openModal<T = unknown>(id: string, payload?: T) {
    if (isOpen(id)) return;

    setPayloads((p) => ({ ...p, [id]: payload }));
    setOpen((p) => [...p, id]);
  }

  function closeModal(id: string) {
    if (!isOpen(id)) return;

    setPayloads((p) => ({ ...p, [id]: undefined }));
    setOpen((p) => p.filter((v) => v !== id));
  }

  function getPayload(id: string) {
    return payloads[id];
  }

  const value = {
    isOpen,
    openModal,
    closeModal,
    getPayload,
  };

  React.useEffect(() => {
    setOpen([]);
  }, [router.pathname]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("`useModal` must be used within a `ModalProvider`");
  }

  return context;
}
