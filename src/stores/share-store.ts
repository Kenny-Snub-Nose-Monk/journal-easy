import { create } from 'zustand'

export interface IShareRelationAuthor {
  id: string
  name: string | null
  email: string | null
}

export interface IShareRelationDoc {
  id: string
  title: string
}

export interface IShareRelation {
  id: string
  docId: string
  authorId: string
  userId: string
  doc: IShareRelationDoc
  author: IShareRelationAuthor
  access: string
  noticeType: string
}

interface IShareRelationState {
  shareRelations: IShareRelation[]
  setShareRelations: (list: IShareRelation[]) => void
  addShareRelation: (shareRelation: IShareRelation) => void
  // removeShareRelation: (id: string) => void
}

export const useShareStore = create<IShareRelationState>((set) => ({
  shareRelations: [],
  setShareRelations: (shareRelations) => set({ shareRelations }),
  addShareRelation: (shareRelation) =>
    set((state) => ({
      shareRelations: [...state.shareRelations, shareRelation],
    })),
  // removeShareRelation: (id) => set((state) => ({ shareRelations: state.shareRelations.filter((i) => i.id !== id) })),
}))
