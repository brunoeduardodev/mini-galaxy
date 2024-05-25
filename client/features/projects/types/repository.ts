export type Repository = {
  id: number
  name: string
  full_name: string
  clone_url: string
  owner?: {
    name?: string | null
    login?: string | null
  } | null
}
