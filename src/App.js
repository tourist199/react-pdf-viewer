import React, { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import styled from "styled-components";

const Content = styled.div`
  display: flex;

  .company-item {
    padding: 10px;
    background: #abcdef;
    margin: 20px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid #cdfecb;
  }
`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const docRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDragStart(e, signatureId) {
    const { top, left } = e.target.getBoundingClientRect();
    const signatureClickOffsetX = left - e.clientX;
    const signatureClickOffsetY = top - e.clientY;

    const payload = {
      signatureId,
      signatureClickOffsetX,
      signatureClickOffsetY,
    };

    e.dataTransfer.setData("payload", JSON.stringify(payload));
  }

  function onDrag(e) {
    e.preventDefault();
  }

  function signHandler(e, page) {
    const payload = e.dataTransfer.getData("payload");
    console.log(payload);
  }

  function onDrop(e, page) {
    signHandler(e, page)
  }

  useEffect(() => {
    console.log('render');
  })

  useEffect(() => {
    console.log(docRef);
    docRef.current.addEventListener("drop", function (event) {
      console.log('a123');
      return onDrop(event, pageNumber);
    });
  }, [])

  return (
    <Content>
      <div className="conpany-area">
        <div
          className="company-item"
          onClick={() => setPageNumber((prev) => prev + 1)}
        >
          change state
        </div>
        <div
          className="company-item"
          draggable="true"
          onDragStart={(e) => onDragStart(e, 1)}
          onDrag={onDrag}
        >
          abc
        </div>
        <div
          className="company-item"
          draggable="true"
          onDrag={onDrag}
          onDragStart={(e) => onDragStart(e, 2)}
        >
          def
        </div>
      </div>
      <div>
        <Document
          file="Eloquent_JavaScript.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={() => <div>Please wait!...</div>}
          inputRef={docRef}
        >
          {[1, 2, 3, 4].map((_, index) => (
            <Page pageNumber={_} key={index} />
          ))}
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    </Content>
  );
}

export default App;
