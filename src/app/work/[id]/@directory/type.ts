export interface IDoc {
  id: string
  title: string
  parentId: string | null
  createdAt?: string
  updatedAt?: string
  isDeleted?: boolean | null
}
