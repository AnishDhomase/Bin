import { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import DownloadIcon from "@mui/icons-material/Download";
import { Document, Page, pdfjs } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function FileViewer({ url, filename, open, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);

  const isPdf = filename.toLowerCase().endsWith(".pdf");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3 bg-gray-900 text-white">
        <span className="font-medium truncate">{filename}</span>
        <div className="flex gap-2">
          <IconButton
            onClick={() => setScale((prev) => prev + 0.2)}
            color="inherit"
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
            color="inherit"
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton onClick={handleDownload} color="inherit">
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      {/* File Preview */}
      <div className="flex justify-center items-center h-full bg-black overflow-auto">
        {isPdf ? (
          <div className="flex flex-col items-center">
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={<p className="text-white">Loading PDF...</p>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                />
              ))}
            </Document>
          </div>
        ) : (
          <TransformWrapper initialScale={1}>
            {({ zoomIn, zoomOut }) => (
              <>
                <TransformComponent>
                  <img
                    src={url}
                    alt={filename}
                    className="max-h-[90vh] max-w-full object-contain"
                  />
                </TransformComponent>

                {/* Hidden: buttons control both image + pdf */}
                <style jsx>{`
                  .react-transform-component {
                    margin: auto;
                  }
                `}</style>
              </>
            )}
          </TransformWrapper>
        )}
      </div>
    </Dialog>
  );
}
