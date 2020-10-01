import React from "react";
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

export default class PdfViewr extends React.Component {
  state = {
    namePages : null,
    pageNumber : 1
  }

  docRef = React.createRef();

  onDocumentLoadSuccess({ numPages }) {
    this.setState({ numPages });
  }

  onDragStart(e, signatureId) {
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

  onDrag(e) {
    e.preventDefault();
  }

  signHandler(e, page) {
    const payload = e.dataTransfer.getData("payload");
    console.log(payload);
  }

  onDrop(e, page) {
    this.signHandler(e, page);
  }

  componentDidMount() {
    console.log(this.docRef);
    this.docRef.addEventListener("drop", function (event) {
      console.log("a123");
      return this.onDrop(event, this.state.pageNumber);
    });
  }

  render() {
    return (
      <Content>
        <div className="conpany-area">
          <div
            className="company-item"
            onClick={() =>
              this.setState({ pageNumber: this.state.pageNumber + 1 })
            }
          >
            change state
          </div>
          <div
            className="company-item"
            draggable="true"
            onDragStart={(e) => this.onDragStart(e, 1)}
            onDrag={this.onDrag}
          >
            abc
          </div>
          <div
            className="company-item"
            draggable="true"
            onDrag={this.onDrag}
            onDragStart={(e) => this.onDragStart(e, 2)}
          >
            def
          </div>
        </div>
        <div>
          <Document
            file="Eloquent_JavaScript.pdf"
            onLoadSuccess={(num) => this.onDocumentLoadSuccess(num)}
            loading={() => <div>Please wait!...</div>}
            inputRef={(ref) => {
              this.docRef = ref;
            }}
          >
            {[1, 2, 3, 4].map((_, __) => (
              <Page pageNumber={_} key={__} />
            ))}
          </Document>
          <p>
            Page {this.state.pageNumber} of {this.state.numPages}
          </p>
        </div>
      </Content>
    );
  }


}

