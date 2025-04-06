import { Document } from 'langchain/document'
import axios from 'axios'
import { PDFDocument } from 'pdf-lib'

async function loadPdfFromUrl(url: string) {
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'arraybuffer',
  })

  return response.data
}

async function deletePagesFromPdf(pdf: Buffer, pagesToDelete: number[]) {
  const pdfDoc = await PDFDocument.load(pdf)

  let numToOffsetBy = 1

  for (const pageNumber of pagesToDelete) {
    pdfDoc.removePage(pageNumber - numToOffsetBy)
    numToOffsetBy += 1
  }

  const pdfBytes = await pdfDoc.save()

  return Buffer.from(pdfBytes)
}

export async function takeNotes(paperUrl: string, name: string, pagesToDelete?: number[]) {}
