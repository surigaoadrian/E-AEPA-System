import React from 'react';
import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const GeneratePDF = async (htmlContent) => {
  // Create a temporary container for the HTML content
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = 'auto';
  container.style.visibility = 'hidden';
  container.style.overflow = 'auto'; // Adjust overflow property
  document.body.appendChild(container);

  // Wait for the content to render and measure its dimensions
  await new Promise(resolve => setTimeout(resolve, 1000)); // Increased timeout to 1 second

  const { scrollWidth, scrollHeight } = container;

  // Capture the full content as an image using html2canvas
  const canvas = await html2canvas(container, {
    scrollX: 0,
    scrollY: 0,
    width: scrollWidth,
    height: scrollHeight,
    useCORS: true,
    scale: 2, // Increase scale for better resolution
  });

  // Remove the temporary container
  document.body.removeChild(container);

  // Convert canvas to image data
  const imageData = canvas.toDataURL('image/png');
  const imageBytes = await fetch(imageData).then(res => res.arrayBuffer());

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Set PDF dimensions to match the canvas size
  const pageWidth = canvas.width;
  const pageHeight = canvas.height;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Embed the image in the PDF
  const image = await pdfDoc.embedPng(imageBytes);
  const { width: imgWidth, height: imgHeight } = image;

  // Draw the image on the PDF page
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: imgWidth,
    height: imgHeight,
  });

  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();

  // Save the PDF
  saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'download.pdf');
};

export default GeneratePDF;
