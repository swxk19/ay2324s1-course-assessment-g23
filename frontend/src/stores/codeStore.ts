import { create } from 'zustand'
import { DEFAULT_LANGUAGE, type Language } from '../api/codeExecution'

export interface DocState {
    doc: string
    setDoc: (doc: string) => void
}

export const useDocStore = create<DocState>((set) => ({
    doc: '',
    setDoc: (doc: string) => set({ doc }),
}))

export interface LanguageState {
    language: Language
    setLanguage: (language: Language) => void
}

export const useLanguage = create<LanguageState>((set) => ({
    language: DEFAULT_LANGUAGE,
    setLanguage: (language: Language) => set({ language }),
}))
