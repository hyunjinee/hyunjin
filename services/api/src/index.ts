import express from 'express'
import { takeNotes } from './notes'

main()

function main() {
  const app = express()

  const port = process.env.PORT || 8080

  app.use(express.json())
  app.get('/', (req, res) => {
    res.send('Hello World')
  })
  app.post('/take_notes', async (req, res) => {
    const { pageUrl, name, pagesToDelete } = req.body

    const pagesToDeleteArray = pagesToDelete ? processPagesToDelete(pagesToDelete) : undefined

    const notes = await takeNotes(pageUrl, name, pagesToDeleteArray)

    res.status(200).send(notes)
  })
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

function processPagesToDelete(pagesToDelete: string) {
  const numArr = pagesToDelete.split(',').map((num) => parseInt(num.trim()))
  return numArr
}

// async function loadPdfFromUrl(url: string) {
//   const response = await fetch(url)
//   const blob = await response.blob()
//   return blob
// }

// async function main({ pageUrl, name, pagesToDelete }: { pageUrl: string; name: string; pagesToDelete: number[] }) {
//   if (!pageUrl.endsWith('pdf')) {
//     throw new Error('Page URL must end with .pdf')
//   }

//   const pdf = await loadPdfFromUrl(pageUrl)
//   const pdfText = await pdf.text()
//   console.log(pdfText)
// }
