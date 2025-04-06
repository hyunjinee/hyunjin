import { ChatOpenAI } from '@langchain/openai'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

// Initialize the chat model
const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
})

export async function chatWithAI(message: string): Promise<string> {
  try {
    const response = await chat.invoke(message)
    console.log(response)
    return response.content.toString()
  } catch (error) {
    console.error('Error in chat:', error)
    throw new Error('Failed to get response from AI')
  }
}

chatWithAI('Hello, how are you?')
