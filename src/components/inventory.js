import React from 'react';
import {Modal} from 'react-bootstrap';
import {inventory} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import ViewVehicleDetail from './view_vehicle_details'
import AddInventory from './add_inventory_modal'
class Inventory extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
    };
  }
  
  componentDidMount() {
    this.props.inventory()
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
          <i className="scoo-icon scoo-icon-7"></i>
          <span className="lbl">Inventory</span>
        </a>
        <Modal show={this.state.show} onHide={this.handleClose} id="inventory">
          <Modal.Header closeButton>
            <Modal.Title>INVENTORY</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className="empty-xs-30 empty-md-30"></div>
            
            <div className="row" id="vehicleListings">
              {this.props.vehicles.map((listing, index) => {
                if (listing.status == 0) {
                  var vehicleStatus = 'circle-red';
                } else if (listing.status == 1) {
                  var vehicleStatus = 'circle-green';
                } else if (listing.status == 2) {
                  var vehicleStatus = 'circle-yellow';
                } else if (listing.status == 3) {
                  var vehicleStatus = 'circle-red';
                } else {
                  var vehicleStatus = 'circle-green';
                }
                return (<div className="col-md-3" key={index}>
                    <div className="inventory-box text-center"><p>
                      <img src="img/inventory1.png" className="img-fluid"/>
                    </p>
                      <p><i className={"fa fa-circle route-circle  " + vehicleStatus} aria-hidden="true"></i>
                        <strong>{listing.license_plate}</strong></p>
                      
                      <ViewVehicleDetail vehicle={listing} handleClose={this.handleClose}/>
                      <div className="empty-xs-40 empty-md-0"></div>
                    </div>
                    <div className="empty-xs-20 empty-md-20"></div>
                  
                  </div>
                )
              })}
            
            </div>
            
            <div className="empty-xs-20 empty-md-20"></div>
            
            <div className="row">
              <div className="col-md-8"></div>
              <div className="col-md-4">
               <AddInventory/>
              </div>
            </div>
            
            
            <div className="empty-xs-10 empty-md-10"></div>
          
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

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
