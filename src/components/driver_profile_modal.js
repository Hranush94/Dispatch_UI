import React,{Component}from 'react';
import {Modal} from 'react-bootstrap';
import SendRescue from './send_rescue_modal'
class DriverProfile extends Component{
  constructor(props, context) {
    super(props, context);
  
    this.state = {
      show: false,
    
    };
  }
  
  
  handleShow = (event) => {
    event.preventDefault();
    this.setState({show: true});
  }
  
  handleClose = () => {
    this.setState({show: false});
    
  }
  render(){
    return (
      <Modal.Body>
    
        <div className="row">
          <div className="col-md-2 text-center">
            <img src="img/reporting_icon.png" width="55"/>
          </div>
          <div className="col-md-10">
            <div className="empty-xs-20 empty-md-15"></div>
            <h5 className="modal-title" id="profileName">
              {this.props.value.crm_data.first_name} {this.props.value.crm_data.last_name}
            </h5>
            <div className="empty-xs-20 empty-md-20"></div>
            <div className="row d-flex align-items-center">
              <div className="col-md-1 text-center">
                <img src="img/ic_point.png" width="22"/>
              </div>
              <div className="col-md-10 mobile-center">
                <span>Driver</span>
              </div>
            </div>
            <div className="empty-xs-20 empty-md-25"></div>
            <div className="row d-flex align-items-center">
              <div className="col-md-1 text-center">
                <img src="img/ic_email.png" width="22"/>
              </div>
              <div className="col-md-10 mobile-center">
                <a href="" className="black"
                   id="profileEmail">{this.props.value.crm_data.email}</a>
              </div>
            </div>
            <div className="empty-xs-10 empty-md-15"></div>
            <div className="row d-flex align-items-center">
              <div className="col-md-1 text-center">
                <img src="img/ic_phone.png" width="22"/>
              </div>
              <div className="col-md-10 mobile-center">
                <a href="" className="black"
                   id="profilePhone">{this.props.value.crm_data.phone}</a>
              </div>
            </div>
          </div>
        </div>
    
        <div className="empty-xs-30 empty-md-30"></div>
    
        <div className="row">
          <div className="col-md-4">
            <a href="#"
               className="btn btn-icon btn-rounded phone_button btn-yellow3">Call</a>
            <div className="empty-xs-30 empty-md-0"></div>
          </div>
          <div className="col-md-4">
            <a href="#"
               className="btn btn-icon btn-rounded message_button btn-yellow3">Message</a>
            <div className="empty-xs-30 empty-md-0"></div>
          </div>
          <div className="col-md-4">
            <a id="profileRescue" href="#" data-toggle="modal"
               data-target="#resque"
               className="btn btn-icon btn-yellow2 width100" onClick={(event)=>this.handleShow(event)}>Send Rescue</a>
  
            <Modal id="resque" show={this.state.show}
                   onHide={() => this.handleClose()}>
              <Modal.Header closeButton style={{paddingTop: 0}}>
               <h5 className="modal-title" id="rescueName">
                  {("Send rescue for "+ this.props.value.crm_data.first_name +"  "+this.props.value.crm_data.last_name).toUpperCase()}
                </h5>
               
              </Modal.Header>
              <SendRescue driverId={this.props.driverId} handleClose={this.handleClose}/>
            </Modal>
            <div className="empty-xs-30 empty-md-0"></div>
          </div>
        </div>
  
      </Modal.Body>
    )
  }
  

  
}
export default DriverProfile;