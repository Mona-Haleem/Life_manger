/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_supabase_url: string
  readonly VITE_supabase_key: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
