
import { create } from "zustand";

export type ModalType = "AuthUser" 

interface ModalData {
  channel?: any;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  signature: string | null;
  isOpen: boolean;
  onOpen: (type: ModalType,signature?: string | null, data?: ModalData | string ) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  signature: null, 
  isOpen: false,
  onOpen: (type, signature: string | null = null, data = {},) => {
    const newData = typeof data === 'string' ? { signature: data } : data;
    set((state) => ({ isOpen: true, type, data: newData as ModalData, signature: signature ?? state.signature }));
  },  
  onClose: () => set({ type: null, isOpen: false, signature: null }), 
}));