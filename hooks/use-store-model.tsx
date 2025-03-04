import { create } from 'zustand';

interface UseStoreModelStore {
    isOpen: boolean;
    onOpen: () => void; // Corrected to void
    onClose: () => void; // Corrected to void
}

export const useStoreModel = create<UseStoreModelStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
