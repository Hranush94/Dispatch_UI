import React from 'react';
import {Modal} from 'react-bootstrap';
import {submitInventory} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Notification} from 'react-pnotify';

var site_id = localStorage.getItem('site_id')

class AddInventory extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      props: {},
      showNotification: false,
      message: ''
    };
  }
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault()
    this.setState({show: true});
  }
  onStatusChange = (event) => {
    var index = event.nativeEvent.target.selectedIndex;
    this.setState({props: {...this.state.props, ['status']: event.nativeEvent.target[index].text}});
  }
  onInputChange = (event, name) => {
    this.setState({props: {...this.state.props, [name]: event.target.value}});
  }
  submitInventory = (event) => {
    event.preventDefault()
    var array = [
      {name: 'license_plate', value: this.state.props.plate},
      {name: 'mileage', value: this.state.props.mileage},
      {name: 'vin', value: this.state.props.vin},
      {name: 'year', value: this.state.props.year},
      {name: 'make', value: this.state.props.make},
      {name: 'model', value: this.state.props.model},
      {name: 'description', value: this.state.props.description},
      {name: 'site_id', value: site_id},
      {name: 'status', value: this.state.props.status},
    
    ];
    this.props.submitInventory(array).then(response => {
      this.setState({message: "Success", showNotification: true})
      this.handleClose()
    }).catch(error => {
      this.setState({message: error.response.data.error.message, showNotification: true})
      this.handleClose()
      
    })
  }
  
  
  render() {
    return (
      <div>
        <a href="#" onClick={(e) => {
          this.handleShow(e)
        }}
           className="btn btn-yellow2 width100">Add Inventory</a>
        <Modal show={this.state.show} onHide={this.handleClose} id="add_inventory">
          <Modal.Header closeButton>
            <Modal.Title id="vehicleEdit_license_place">Add Inventory
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className="empty-xs-30 empty-md-30"></div>
            
            
            <form className="hori-form" id="newInventory">
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">License Plate</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <input type="text" className="form-control" name="license_plate"
                           value={this.state.props.plate} onChange={(e) => {
                      this.onInputChange(e, 'plate')
                    }}
                           id="inventoryLicense"/></p>
                </div>
              </div>
              <div className="empty-xs-40 empty-md-0"></div>
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Starting Milage</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <input type="text" className="form-control" name="mileage"
                           id="inventoryMilage"
                           value={this.state.props.mileage} onChange={(e) => {
                      this.onInputChange(e, 'mileage')
                    }}
                    /></p>
                </div>
              </div>
              <div className="empty-xs-40 empty-md-0"></div>
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Vin Number</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <input type="text" className="form-control" name="vin"
                           value={this.state.props.vin} onChange={(e) => {
                      this.onInputChange(e, 'vin')
                    }}
                           id="inventoryVin"/></p>
                </div>
              </div>
              <div className="empty-xs-40 empty-md-0"></div>
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Year</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <input type="text" className="form-control" name="year" value={this.state.props.year}
                           onChange={(e) => {
                             this.onInputChange(e, 'year')
                           }}
                           id="inventoryYear"/></p>
                </div>
              </div>
              <div className="empty-xs-40 empty-md-0"></div>
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Make</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <input type="text" className="form-control" name="make"
                           value={this.state.props.make} onChange={(e) => {
                      this.onInputChange(e, 'make')
                    }} id="inventoryMake"/></p>
                </div>
              </div>
              <div className="empty-xs-40 empty-md-0"></div>
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Model</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <input type="text" className="form-control" name="model"
                           value={this.state.props.model} onChange={(e) => {
                      this.onInputChange(e, 'model')
                    }}
                           id="inventoryModel"/></p>
                </div>
              </div>
              <div className="empty-xs-40 empty-md-0"></div>
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Description</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <input type="text" className="form-control" name="description"
                           value={this.state.props.description} onChange={(e) => {
                      this.onInputChange(e, 'description')
                    }}
                           id="inventoryDescription"/></p>
                </div>
              </div>
              <div className="empty-xs-40 empty-md-0"></div>
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Status</label>
                <div className="col-sm-8">
                  <select id="inventoryStatus" name="status" className="select2"
                          onChange={(event) => this.onStatusChange(event)}>
                    <option value="1">Active</option>
                    <option value="2">On Hold</option>
                    <option value="0">Inactive</option>
                    <option value="4">Other</option>
                  </select>
                </div>
              </div>
              
              
              <div className="empty-xs-30 empty-md-30"></div>
              
              <div className="form-group row">
                <div className="col-sm-8"></div>
                <div className="col-sm-4 text-right">
                  <input type="hidden" name="site_id" id="inventorySiteID" value={site_id}/>
                  <a href="#"
                     onClick={(e) => this.submitInventory(e)}
                     className="btn btn-yellow2 width100">Submit</a>
                </div>
              </div>
            </form>
            
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

function mapStateToProps(state) {
  return {
    vehicles: state.vehicles,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({submitInventory}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddInventory);
