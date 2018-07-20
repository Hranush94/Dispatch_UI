import React from 'react';
import {Modal} from 'react-bootstrap';


class Rescues extends React.Component {
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
          <i className="scoo-icon scoo-icon-5"></i>
          <span className="lbl">Rescues</span>
        </a>
        <Modal show={this.state.show} onHide={this.handleClose}
               id="all_rescues">
          <Modal.Header closeButton>
            <Modal.Title>Rescues</Modal.Title>
          </Modal.Header>
          <Modal.Body id="rescueinsert">
          </Modal.Body>
        </Modal>
      
      </div>
    
    );
  }
}

export default Rescues;
