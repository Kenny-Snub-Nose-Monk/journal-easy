import { create } from 'zustand'

export interface IDoc {
  id: string
  title: string
  parentId: string | null
  createdAt?: string
  updatedAt?: string
  isDeleted?: boolean
  isStar?: boolean
  sharePassword: string | null
  userId?: string
}

interface IDocsState {
  loading: boolean
  docs: IDoc[]
  curDocId: string
  creating: boolean // is creating a new doc
  setLoading: (loading: boolean) => void
  setDocs: (list: IDoc[]) => void
  addDoc: (doc: IDoc) => void
  removeDoc: (id: string) => void
  updateDocIsStar: (id: string, isStar: boolean) => void
  updateDocTitle: (id: string, title: string) => void
  updateDocSharePassword: (id: string, sharePassword: string | null) => void
  setCurDocId: (id: string) => void
  setCreating: (creating: boolean) => void
}

export const useDocsStore = create<IDocsState>((set) => ({
  loading: true,
  docs: [],
  curDocId: '',
  creating: false,
  setLoading: (loading) => set({ loading }),
  setDocs: (docs) => set({ docs }),
  addDoc: (doc) => set((state) => ({ docs: [...state.docs, doc] })),
  removeDoc: (id) =>
    set((state) => ({ docs: state.docs.filter((i) => i.id !== id) })),
  updateDocIsStar: (id, isStar) =>
    set((state) => ({
      docs: state.docs.map((i) => (i.id === id ? { ...i, isStar } : i)),
    })),
  updateDocTitle: (id, title) =>
    set((state) => ({
      docs: state.docs.map((i) => (i.id === id ? { ...i, title } : i)),
    })),
  updateDocSharePassword: (id, sharePassword) =>
    set((state) => ({
      docs: state.docs.map((i) => (i.id === id ? { ...i, sharePassword } : i)),
    })),
  setCurDocId: (curDocId) => set({ curDocId }),
  setCreating: (creating) => set({ creating }),
}))
