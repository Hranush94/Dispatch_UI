import React from 'react';
import {Modal} from 'react-bootstrap';

class IncidentReports extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false
    };
  }
  
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true});
  }
  
  render() {
    return (
      <div>
             <a href="#" onClick={(event) => this.handleShow(event)}>
          <i className="scoo-icon scoo-icon-6"></i>
          <span className="lbl">Incident Report</span>
        </a>
        <Modal show={this.state.show} onHide={this.handleClose}
               id="incident_reports">
          <Modal.Header closeButton>
            <Modal.Title>Incident Reports</Modal.Title>
          </Modal.Header>
          <Modal.Body id="incidentReportsContent">
          </Modal.Body>
        </Modal>
      
      </div>
    
    );
  }
}

export default IncidentReports;
