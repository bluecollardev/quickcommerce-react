import React, { Component } from 'react'

import { Button, Modal } from 'react-bootstrap'

class PdfViewer extends Component {
  constructor(props) {
    super(props)

    this.state = {displayPdfViewer: false}
  }

  render() {
    let { displayPdfViewer } = this.state
    let { displayMode } = this.props

    if (displayPdfViewer && displayMode === 'modal') {
      return (
        <div className='dark'>
          <Modal
            dialogClassName='pdf-viewer-modal'
            show={true}>
            <Modal.Header>
              <Modal.Title>
                <div className='column_attr clearfix align_center'>
                  <h2 className='heading-with-border'
                    style={{textAlign: 'center'}}>PDF Viewer Title</h2>
                  <Button
                    onClick={() => {
                      this.setState({displayPdfViewer: false})
                    }}
                    className='close'
                    dataDismiss='modal'>&times;</Button>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                className='pdf-viewer-wrapper'>
                <iframe allowFullScreen
                  className='pdf-viewer'
                  src={QC_APP_URL + 'viewer-js/#../' + QC_FILES_PATH + 'EQUIFAX.pdf'}
                />
                <Button block
                  onClick={() => {
                    // Trigger invisible link
                    this.pdfDownloadTrigger.click()

                    this.setState({displayPdfViewer: !this.state.displayPdfViewer})
                  }}
                  bsStyle='success'>
                  Download as PDF
                </Button>
                {/* Programatically click this link */}
                <a download
                  ref={(trigger) => this.pdfDownloadTrigger = trigger}
                  href={QC_FILES_URI + 'EQUIFAX.pdf'}
                  style={{display: 'none'}}
                />
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )
    }

    if (!(displayMode === 'modal')) {
      return (
        <div
          className='pdf-viewer-wrapper'>
          <iframe allowFullScreen
            className='pdf-viewer'
            src={QC_APP_URL + 'viewer-js/#../' + QC_FILES_PATH + 'EQUIFAX.pdf'}
          />
          <Button block
            onClick={() => {
              // Trigger invisible link
              this.pdfDownloadTrigger.click()

              this.setState({displayPdfViewer: !this.state.displayPdfViewer})
            }}
            bsStyle='success'>
            Download as PDF
          </Button>
          {/* Programatically click this link */}
          <a download
            ref={(trigger) => this.pdfDownloadTrigger = trigger}
            href={QC_FILES_URI + 'EQUIFAX.pdf'}
            style={{display: 'none'}}
          />
        </div>
      )
    }
  }
}

export default PdfViewer
