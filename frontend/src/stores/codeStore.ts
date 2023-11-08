import { create } from 'zustand'

export interface DocState {
    doc: string
    setDoc: (doc: string) => void
}

export const useDocStore = create<DocState>((set) => ({
    doc: '',
    setDoc: (doc: string) => set({ doc }),
}))
