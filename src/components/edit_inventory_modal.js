import React from 'react';
import {Modal} from 'react-bootstrap';
import {getLocations, updateInventory} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Notification} from 'react-pnotify';

var site_id = localStorage.getItem('site_id')

class EditInventory extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      sites: [],
      props: {},
      showNotification: false,
      message:''
    }
  }
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true}, () => {
      // this.props.handleClose()
    });
  }
  
  componentDidMount() {
    this.props.getLocations().then(response => {
      response.map(location => {
        location.sites.map(site => {
          if (site_id === site.id) {
            this.setState({sites: location.sites})
          }
        })
      })
    })
  }
  
  onStatusChange = (event) => {
    var index = event.nativeEvent.target.selectedIndex;
    // var siteId = event.nativeEvent.target[index].value;
    this.setState({props: {...this.state.props,['status']:event.nativeEvent.target[index].text}});
  }
  onSiteChange = (event) => {
    var index = event.nativeEvent.target.selectedIndex;
    var siteId = event.nativeEvent.target[index].value;
    this.setState({props: {...this.state.props,['site_id']:siteId}});
  
  }
  onInputChange = (event, name) => {
    this.setState({props: {...this.state.props,[name]:event.target.value}});
  }
  updateInventory=(event)=>{
    event.preventDefault()
    var array=[
      {name:'status',value:this.state.props.status},
      {name:'year',value:this.state.props.year},
      {name:'make',value:this.state.props.make},
      {name:'model',value:this.state.props.model},
      {name:'mileage',value:this.state.props.mileage},
      {name:'description',value:this.state.props.description},
      {name:'site_id',value:this.state.props.site_id},
      {name:'id',value:this.props.vehicle.id}
    
    ];
    this.props.updateInventory(array).then(response=>{
      this.setState({message:"Updated",showNotification:true})
      this.handleClose()

    }).catch(error=>{
      this.setState({message: error.response.data.error.message,showNotification:true})
      this.handleClose()

    })
  }
  render() {
    return (
      <div>
        <a href="#" onClick={(e) => {
          this.handleShow(e)
        }}
           className="btn btn-yellow2 width100  btn-with-icon  edit_button">Edit Description</a>
        <Modal show={this.state.show} onHide={this.handleClose} id="edit_inventory">
          <Modal.Header closeButton>
            <Modal.Title id="vehicleEdit_license_place">
              <strong>{this.props.vehicle.license_plate}</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="editInventory">
              <div className="empty-xs-30 empty-md-30"></div>
              
              <div className="row view_inventory">
                <div className="col-md-6 text-center">
                  <p><a href="#"><img src="img/tesla.png" width="95%"/></a></p>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4">
                      <p>Status</p>
                    </div>
                    <div className="col-md-8">
                      <select id="vehicleEdit_status" name="status" className="select2"
                              onChange={(event) => this.onStatusChange(event)} >
                        <option value="1">Active</option>
                        <option value="2">On Hold</option>
                        <option value="0">Inactive</option>
                        <option value="4">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="empty-xs-40 empty-md-10"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Year</p>
                    </div>
                    <div className="col-md-8">
                      <input type="text" className="form-control"
                             value={this.props.vehicle.year || this.state.props.year || ''}
                             onChange={e => this.onInputChange(e, 'year')}
                             name="year"
                             id="vehicleEdit_year"/>
                    </div>
                  </div>
                  <div className="empty-xs-40 empty-md-10"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Make</p>
                    </div>
                    <div className="col-md-8">
                      <input type="text" className="form-control"
                             value={this.props.vehicle.make || this.state.props.make || ''} name="make"
                             onChange={e => this.onInputChange(e, 'make')}
                             id="vehicleEdit_make"/>
                    </div>
                  </div>
                  <div className="empty-xs-40 empty-md-10"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Model</p>
                    </div>
                    <div className="col-md-8">
                      <input type="text" className="form-control"
                             value={this.props.vehicle.model || this.state.props.model || ''}
                             onChange={e => this.onInputChange(e, 'model')}
                             name="model"
                             id="vehicleEdit_model"/>
                    </div>
                  </div>
                  <div className="empty-xs-40 empty-md-10"></div>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Milleage</p>
                    </div>
                    <div className="col-md-8">
                      <input type="text" className="form-control"
                             value={this.props.vehicle.mileage || this.state.props.mileage || ''}
                             onChange={e => this.onInputChange(e, 'mileage')}
                             name="mileage"
                             id="vehicleEdit_milage"/>
                    </div>
                  </div>
                </div>
              
              </div>
              
              <div className="empty-xs-20 empty-md-20"></div>
              
              <div className="row">
                <div className="col-md-12 form-group">
                  <p>Description</p>
                  <textarea id="vehicleEdit_description" className="form-control" name="description"
                            value={this.props.vehicle.description || this.state.props.description || ''}
                            rows="4"
                            onChange={e => this.onInputChange(e, 'description')}
                  ></textarea>
                </div>
              </div>
              
              <div className="empty-xs-40 empty-md-30"></div>
              
              <div className="row view_inventory">
                <div className="col-md-4">
                  <p>Site</p>
                </div>
                <div className="col-md-8">
                  <select name="site_id" id="vehicleEdit_site" className="select2"
                          onChange={(event) => this.onSiteChange(event)} >
                    {this.state.sites.map((v, k) => (
                      <option key={k} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              
              <div className="empty-xs-50 empty-md-50"></div>
              
              <div className="row">
                <div className="col-md-8"></div>
                
                <div className="col-md-4">
                  <input type="hidden" id="editVehicleInventoryID" name="id" value={this.props.vehicle.id}/>
                  <a href="#"
                    onClick={(event)=>this.updateInventory(event)}
                     className="btn btn-yellow2 width100">Save
                    Changes</a>
                </div>
              </div>
              
              
              <div className="empty-xs-10 empty-md-10"></div>
            </form>
          
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
    locationSites: state.locationSites
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({updateInventory, getLocations}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInventory);
