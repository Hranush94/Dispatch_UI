import React from 'react';
import {Modal} from 'react-bootstrap';
import {insertVehicleNote} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Notification} from 'react-pnotify';

class Note extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      note:'',
      showNotification: false,
      message:''
    };
  }
  
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true});
  }
  insertVehicleNote=(event)=>{
    event.preventDefault()
      var dispatchData = new FormData();
    dispatchData.set('vehicle_id', this.props.vehicle.id);
    dispatchData.set('note', this.state.note);
    this.props.insertVehicleNote(dispatchData).then(response=>{
      this.setState({message:"Success",showNotification:true})
      this.handleClose()
  
    }).catch(error=>{
      this.setState({message: error.response.data.error.message,showNotification:true})
      this.handleClose()
  
    })
  }
 onInputChange=(e)=>{
    e.preventDefault();
    this.setState({note:e.target.value})
 }
  
  render() {
    return (
      <div>
        <a href="#" onClick={(event) => this.handleShow(event)}
           className="btn btn-yellow2 width100">Note</a>
        <Modal show={this.state.show} onHide={this.handleClose} id="inventory_note">
          <Modal.Header closeButton>
            <Modal.Title>Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
  
            <div className="empty-xs-30 empty-md-30"></div>
  
            <div className="row">
              <div className="col-md-12">
                <textarea className="form-control" id="vehicleNote" rows="8" placeholder="Your Note"
                value={this.state.note} onChange={(e)=>{this.onInputChange(e)}}
                ></textarea>
              </div>
            </div>
  
            <div className="empty-xs-50 empty-md-50"></div>
  
            <div className="row">
              <div className="col-md-8"></div>
    
              <div className="col-md-4">
                <input type="hidden" id="vehicleNoteID"/>
                  <a href="javascript:void(0);"
                     onClick={(event)=>this.insertVehicleNote(event)}
                     className="btn btn-yellow2 width100">Submit</a>
              </div>
            </div>
  
  
            <div className="empty-xs-10 empty-md-10"></div>
          </Modal.Body>
          {this.state.showNotification ?
            <Notification
              type='notice'
              text={this.state.message}
              delay={2000}
              shadow={false}
              hide={true}
              nonblock={true}
              desktop={true}
            /> : ''}
        </Modal>
      </div>
    
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({insertVehicleNote}, dispatch);
}

export default connect(null, mapDispatchToProps)(Note);
