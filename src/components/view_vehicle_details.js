import React from 'react';
import {Modal} from 'react-bootstrap';
import {inventory} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Note from './note_vehicle_modal';
import EditInventory from './edit_inventory_modal'
var vehicleInfo = '';
var vehicleStatus = '';

class ViewVehicleDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showDetail: false,
        };
  }

  handleCloseDetail = (event) => {
    event.preventDefault()
    this.setState({showDetail: false});
  }
  
  handleShowDetail = (e) => {
    e.preventDefault()
  
    if (this.props.vehicle.status == 0) {
      vehicleStatus = 'Inactive';
    } else if (this.props.vehicle.status == 1) {
      vehicleStatus = 'Active';
    } else if (this.props.vehicle.status == 2) {
      vehicleStatus = 'On Hold';
    } else if (this.props.vehicle.status == 3) {
      vehicleStatus = 'Other';
    } else {
      vehicleStatus = '';
    }
   
    this.setState({showDetail: true});
  
  }

  
  render() {
    return (
      <div>
        <a href="#"
           onClick={(e) => {
             this.handleShowDetail(e)
           }}
           className="btn btn-report width100">View
          Details</a>
        <Modal show={this.state.showDetail} onHide={(event)=>this.handleCloseDetail(event)} id="view_inventory">
          <Modal.Header closeButton>
            <Modal.Title id="viewInventory_title"> <strong>{this.props.vehicle.license_plate}</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="empty-xs-30 empty-md-30"></div>
              
              <div className="row view_inventory">
                <div className="col-md-6 text-center">
                  <img src="img/tesla.png" width="95%"/>
                </div>
                <div className="col-md-6">
                  <div className="empty-xs-30 empty-md-0"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Status</p>
                    </div>
                    <div className="col-md-8 grey-bg" id="viewInventory_status">
                      <p>{vehicleStatus}  </p>
                    </div>
                  </div>
                  <div className="empty-xs-40 empty-md-10"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Year</p>
                    </div>
                    <div className="col-md-8" id="viewInventory_year">
                      <p>{this.props.vehicle.year}  </p>
                    </div>
                  </div>
                  <div className="empty-xs-40 empty-md-10"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Make</p>
                    </div>
                    <div className="col-md-8 grey-bg" id="viewInventory_make">
                      <p>{this.props.vehicle.make}  </p>
                    </div>
                  </div>
                  <div className="empty-xs-40 empty-md-10"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Model</p>
                    </div>
                    <div className="col-md-8" id="viewInventory_model">
                      <p>{this.props.vehicle.model}   </p>
                    </div>
                  </div>
                  <div className="empty-xs-40 empty-md-10"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Mileage</p>
                    </div>
                    <div className="col-md-8 grey-bg" id="viewInventory_milage">
                      <p>{this.props.vehicle.mileage}  </p>
                    </div>
                  </div>
                </div>
              
              </div>
              
              <div className="empty-xs-40 empty-md-20"></div>
              
              <div className="row">
                <div className="col-md-12">
                  <p>Description</p>
                  <p className="in-desc" id="viewInventory_description">
                    {this.props.vehicle.description}
                  </p>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-12" id="noteContent">
                  <p>Notes</p>
                  {this.props.vehicle.notes.map((note, index) => {
                    <p className="in-desc" id="viewInventory_description">{note.note}</p>
                  })
                  
                  }
                </div>
              </div>
              
              <div className="empty-xs-50 empty-md-50"></div>
              
              <div className="row">
                <div className="col-md-6"></div>
                <div className="col-md-2">
                  <Note vehicle={this.props.vehicle} />
                  <div className="empty-xs-40 empty-md-0"></div>
                </div>
                <div className="col-md-4">
                  <EditInventory vehicle={this.props.vehicle}/>
                  <div className="empty-md-0"></div>
                </div>
              </div>
              
              
              <div className="empty-xs-10 empty-md-10"></div>
            </div>
          
          </Modal.Body>
        </Modal>
      
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    vehicles: state.vehicles,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({inventory}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewVehicleDetail);
