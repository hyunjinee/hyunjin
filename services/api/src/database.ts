import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

export class SuperbaseDatabase {
  vectorStore: SupabaseVectorStore
  client: SupabaseClient

  constructor(vectorStore: SupabaseVectorStore, client: SupabaseClient) {
    this.vectorStore = vectorStore
    this.client = client
  }

  static async fromExistingIndex() {
    const privateKey = process.env.SUPABASE_PRIVATE_KEY
    const url = process.env.SUPABASE_URL

    if (!privateKey || !url) {
      throw new Error('SUPABASE_PRIVATE_KEY and SUPABASE_URL must be set')
    }

    const client = createClient(url, privateKey)
  }

  async saveQa(question: string, answer: string, context: string, followupQuestions: string[]) {}
}
