interface IDatasetItem {
  id?: string
  modified?: string
  name?: string
  notes?: string
  organization?: { name: string }
  theme?: string
  title?: string
}

export { IDatasetItem }