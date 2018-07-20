import React, {Component} from 'react';
import {connect} from "react-redux";
import {Collapse, Well} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import {getLocations, settings, getShifts, getDrivers2} from "../actions";
import {ButtonToolbar, DropdownButton, MenuItem, Dropdown} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import DriverProfile from './driver_profile_modal'
import Reporting from "./reporting_modal"

var circleStatus = '';
var circleName = '';
var user = JSON.parse(localStorage.getItem('customer_data'));

class Drivers extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false,
      value: 1,
      term: '',
      site_id: '',
      shifts: this.props.shifts,
      filteredDrivers: [],
      isFiltered: false,
      showModal: false,
      driverId: '',
      modalId: '',
      hours: 12,
      minutes: 20,
      enabled: true
    };
    let search = '';
    this.drivers2 = [];
    this.filteredDrivers;
  }
  
  componentDidMount() {
    this.props.getShifts();
  }
  
  handleShow = (event, driverid, modalId) => {
    event.preventDefault();
    this.setState({showModal: true, driverId: driverid, modalId: modalId});
  }
  
  handleClose = () => {
    this.setState({showModal: false});
    
  }
  collapse = (event) => {
    event.preventDefault();
    // if(!this.state.show){
    this.setState({show: !this.state.show});
    
  }
  
  onInputChange(term) {
    this.setState({term});
    this.onSearchTermChange(term);
  }
  
  onSearchTermChange = (term) => {
    this.filteredDrivers = [];
    this.props.shifts.map((value, index) => {
      if (value.crm_data) {
        if ((value.crm_data.first_name
          + " " + value.crm_data.last_name
          + " " + value.crm_data.email).toUpperCase().indexOf(term.toUpperCase()) >= 0) {
          this.filteredDrivers.push(value)
          this.setState({isFiltered: true});
          this.setState({filteredDrivers: this.filteredDrivers})
        }
        else {
          this.setState({filteredDrivers: this.filteredDrivers})
          
        }
        
      }
    })
    if (term === null) {
      this.setState({isFiltered: false});
      
    }
  }
  
  render() {
    return (
      <div className="with-sub" id='drivers'>
        <a href='#' className="clicked" onClick={(event) => this.collapse(event)}>
          <i className="scoo-icon scoo-icon-1" style={{top: 'auto'}}></i>
          <span className="lbl "
          >Drivers</span></a>
        <Collapse in={this.state.show}>
          <Well>
            <div style={{height: 370 + 'px', width: 100 + '%', overflowY: 'auto', overflowX: 'hidden'}}>
              <ul id="driverList">
                {this.props.shifts === undefined || this.props.shifts.length == 0 ?
                  <li>
                     <span className="lbl2"
                           style={{color: 'white', marginTop: 20 + 'px'}}><h6>Driver List is empty!</h6>
                       {/*<h6>Please Re-Select Jobsite</h6>*/}
                     </span>
                  </li>
                  : <div className="row search-drivers m-0" style={{display: 'block'}}>
                    <div className="col-md-12">
                      <div className="form-group">
                        <div className="form-control-wrapper form-control-icon-right">
                          <input type="text" value={this.state.term}
                                 onChange={(event) => this.onInputChange(event.target.value)}
                                 id="searchDrivers" className="form-control form-control-lg"
                                 placeholder="Search"/> <i className="search-drivers-icon font-icon-search"></i></div>
                      </div>
                    </div>
                  </div>}
                
                {this.props.websiteData.hr == 1 ?
                  !this.state.isFiltered ?
                  this.props.shifts.map((value, index) => {
                      if (value.crm_data) {
                        if (value.clock_status == 0) {
                          circleStatus = 'circle-grey';
                          circleName = 'Clocked Out';
                        } else {
                          circleStatus = '';
                          circleName = 'Clocked In';
                        }
                        return (<li className=" dropdown show opened-list accounts" id="dropdownMenuLink" key={index}>
                          <i
                            className={"font-icon fa fa-circle " + circleStatus} aria-hidden="true"></i>
                          
                          <span className="lbl2" onClick={(event) => this.handleShow(event, value.crm_data.id, 1)}
                          >{value.crm_data.first_name} {value.crm_data.last_name}</span>
                          
                          {this.state.modalId === 1 ?
                            (this.state.driverId === value.crm_data.id) ?
                              <div key={index} className="profile" tabIndex="-1" role="dialog"
                                   aria-labelledby="exampleModalProfile"
                                   aria-hidden="true">
                                <Modal className="profile" show={this.state.showModal}
                                       onHide={() => this.handleClose()}>
                                  <Modal.Header closeButton style={{paddingTop: 0}}>
                                    <Modal.Title>Profile</Modal.Title>
                                  </Modal.Header>
                                  <DriverProfile handleClose={this.handleClose} driverId={this.state.driverId}
                                                 value={value}/>
                                </Modal>
                              
                              </div> : ""
                            : ""}
                          
                          <ButtonToolbar>
                            <Dropdown id={index}>
                              
                              <Dropdown.Toggle className="sublist-dropdown">
                                <span
                                  className="opened-sub">Shift Time: {' ' + value.totalHours + ' '} Hours</span><span
                                className="opened-sub">{circleName}</span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="dropdown-menu-right show">
                                <MenuItem className="dropdown-item"
                                          onClick={(event) => this.handleShow(event, value.crm_data.id, 2)}>View
                                  Schedule </MenuItem>
                                {this.state.modalId === 2 ?
                                  (this.state.driverId === value.crm_data.id) ?
                                    <Modal className="view_schedule " show={this.state.showModal}
                                           onHide={() => this.handleClose()}>
                                      <Modal.Header closeButton style={{paddingTop: 0}}>
                                        <h5 className="modal-title"><span id="scheduleName">
                                      {value.crm_data.first_name + " " + value.crm_data.last_name}
                                    </span>
                                        </h5>
                                      </Modal.Header>
                                      
                                      <Modal.Body>
                                        <table className="table schedule-table">
                                          <thead>
                                          <tr>
                                            <td>Scheduled</td>
                                            <td>Actual</td>
                                            <td>Shift Length</td>
                                            <td>Scheduled Lunch Time</td>
                                            <td>Actual Lunch Time</td>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          <tr>
                                            <td className="grey-td"
                                                id="scheduleScheduled">{value.scheduleScheduled}</td>
                                            <td className="grey-td" id="scheduleActual">{value.scheduleActual}</td>
                                            <td className="grey-td"
                                                id="scheduleLength">{value.scheduleLength + "Hours"}</td>
                                            <td className="grey-td" id="scheduleLunch">{value.scheduleLunch}</td>
                                            <td className="grey-td"
                                                id="scheduleActualLunch">{value.scheduleActualLunch}</td>
                                          </tr>
                                          </tbody>
                                        
                                        </table>
                                      </Modal.Body>
                                    </Modal>
                                    : "" : ""
                                  
                                  
                                }
                                
                                
                                <MenuItem className="dropdown-item"
                                          onClick={(event) => this.handleShow(event, value.crm_data.id, 3)}>Reporting</MenuItem>
                                {this.state.modalId === 3 ?
                                  (this.state.driverId === value.crm_data.id) ?
                                    
                                    <Reporting value={value} showModal={this.state.showModal}
                                               handleClose={this.handleClose} user={user}/> : ""  : ""}
                                
                                
                                <MenuItem className="dropdown-item" target="_blank"
                                          href={"http://beezkeeper.com/hr/attendance/39/137/" + value.site_id + '/?id=' + value.crm_data.id}
                                  //  onClick={this.loadReport(value.crm_data.id)}
                                > Attendance </MenuItem>
                                <MenuItem className="dropdown-item"
                                          onClick={(event) => this.handleShow(event, value.crm_data.id, 1)}>Profile</MenuItem>
                              
                              
                              </Dropdown.Menu>
                            
                            </Dropdown>
                          
                          
                          </ButtonToolbar>
                        
                        
                        </li>)
                      }
                    })
                    : (this.state.filteredDrivers.length === 0) ? <div></div> :
                    this.state.filteredDrivers.map((value, index) => {
                      if (value.crm_data) {
                        if (value.clock_status == 0) {
                          circleStatus = 'circle-grey';
                          circleName = 'Clocked Out';
                        } else {
                          circleStatus = '';
                          circleName = 'Clocked In';
                        }
                        return (<li className=" dropdown show opened-list accounts" id="dropdownMenuLink" key={index}>
                          <i
                            className={"font-icon fa fa-circle " + circleStatus} aria-hidden="true"></i>
                          
                          <span className="lbl2" onClick={(event) => this.handleShow(event, value.crm_data.id, 1)}
                          >{value.crm_data.first_name} {value.crm_data.last_name}</span>
                          
                          {this.state.modalId === 1 ?
                            (this.state.driverId === value.crm_data.id) ?
                              <div key={index} className="profile" tabIndex="-1" role="dialog"
                                   aria-labelledby="exampleModalProfile"
                                   aria-hidden="true">
                                <Modal className="profile" show={this.state.showModal}
                                       onHide={() => this.handleClose()}>
                                  <Modal.Header closeButton style={{paddingTop: 0}}>
                                    <Modal.Title>Profile</Modal.Title>
                                  </Modal.Header>
                                  <DriverProfile handleClose={this.handleClose} driverId={this.state.driverId}
                                                 value={value}/>
                                </Modal>
                              
                              </div> : ""
                            : ""}
                          
                          <ButtonToolbar>
                            <Dropdown id={index}>
                              
                              <Dropdown.Toggle className="sublist-dropdown">
                                <span
                                  className="opened-sub">Shift Time: {' ' + value.totalHours + ' '} Hours</span><span
                                className="opened-sub">{circleName}</span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="dropdown-menu-right show">
                                <MenuItem className="dropdown-item"
                                          onClick={(event) => this.handleShow(event, value.crm_data.id, 2)}>View
                                  Schedule </MenuItem>
                                {this.state.modalId === 2 ?
                                  (this.state.driverId === value.crm_data.id) ?
                                    <Modal className="view_schedule " show={this.state.showModal}
                                           onHide={() => this.handleClose()}>
                                      <Modal.Header closeButton style={{paddingTop: 0}}>
                                        <h5 className="modal-title"><span id="scheduleName">
                                      {value.crm_data.first_name + " " + value.crm_data.last_name}
                                    </span>
                                        </h5>
                                      </Modal.Header>
                                      
                                      <Modal.Body>
                                        <table className="table schedule-table">
                                          <thead>
                                          <tr>
                                            <td>Scheduled</td>
                                            <td>Actual</td>
                                            <td>Shift Length</td>
                                            <td>Scheduled Lunch Time</td>
                                            <td>Actual Lunch Time</td>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          <tr>
                                            <td className="grey-td"
                                                id="scheduleScheduled">{value.scheduleScheduled}</td>
                                            <td className="grey-td" id="scheduleActual">{value.scheduleActual}</td>
                                            <td className="grey-td"
                                                id="scheduleLength">{value.scheduleLength + "Hours"}</td>
                                            <td className="grey-td" id="scheduleLunch">{value.scheduleLunch}</td>
                                            <td className="grey-td"
                                                id="scheduleActualLunch">{value.scheduleActualLunch}</td>
                                          </tr>
                                          </tbody>
                                        
                                        </table>
                                      </Modal.Body>
                                    </Modal>
                                    : "" : ""
                                  
                                  
                                }
                                
                                
                                <MenuItem className="dropdown-item"
                                          onClick={(event) => this.handleShow(event, value.crm_data.id, 3)}>Reporting</MenuItem>
                                {this.state.modalId === 3 ?
                                  (this.state.driverId === value.crm_data.id) ?
  
                                    <Reporting value={value} showModal={this.state.showModal}
                                               handleClose={this.handleClose} user={user}/> : ""
                                  
                                  
                                  : ""}
                                
                                
                                <MenuItem className="dropdown-item" target="_blank"
                                          href={"http://beezkeeper.com/hr/attendance/39/137/" + value.site_id + '/?id=' + value.crm_data.id}
                                  //  onClick={this.loadReport(value.crm_data.id)}
                                > Attendance </MenuItem>
                                <MenuItem className="dropdown-item"
                                          onClick={(event) => this.handleShow(event, value.crm_data.id, 1)}>Profile</MenuItem>
                              
                              
                              </Dropdown.Menu>
                            
                            </Dropdown>
                          
                          
                          </ButtonToolbar>
                        
                        
                        </li>)
                      }
                      
                    })
                  
                  
                  : ''}
              
              
              </ul>
            
            </div>
          </Well>
        </Collapse>
      
      </div>
    ) }}

function mapStateToProps(state) {
  
  return {
    locationSites: state.locationSites,
    websiteData: state.websiteData,
    shifts: state.shifts,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getLocations, settings, getShifts, getDrivers2}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Drivers);