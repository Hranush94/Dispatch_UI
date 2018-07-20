import React, {Component} from 'react';
import { Row, Col} from 'react-bootstrap';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { getShifts, schedule, removeReport,submitRouteAssignment} from "../actions";
import {Notification} from 'react-pnotify';

var arrayMainroute = [],
  arrayRouteID = [],
  arraySPR = [],
  arrayLength = [],
  arrayFPD = [],
  arrayLPD = [],
  arrayLPA = [],
  arrayVehicle = [],
  array = [];

var today = new Date();
const startDate = ((today.getMonth() + 1).toString().length < 2 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' +
  (today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate()) + '-' + today.getFullYear();
var site_id = localStorage.getItem('site_id')

class RouteAssignmentModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      routes: [],
      message: '',
      showNotification: false,
    };
  }
  
  
  componentDidMount() {
    this.props.getShifts();
    this.props.schedule();
  }
  
  handleShow = (event, driverid) => {
    event.preventDefault();
    this.setState({showModal: true, driverId: driverid});
  }
  
  handleClose = () => {
    this.setState({showModal: false});
    
  }
  
  onInputChange = (event, id, keyName) => {
    
    this.setState({showNotification: false})
    let route = this.state.routes[id] || {};
    route[keyName] = event.target.value;
    this.setState({
      routes: {
        ...this.state.routes,
        [id]: route
        
      }
    })
  }
  removeReport = (id) => {
    this.props.removeReport().then(response => {
      this.props.getShifts();
      this.setState({message: 'Removed', showNotification: true})
      
    }).catch(error => {
      if(error.response){
        this.setState({message: error.response.data.error.message, showNotification: true})}
  
    })
  }
  submitRouteAssignment = (event) => {
    event.preventDefault();
    array = [...arrayMainroute, ...arrayRouteID, ...arraySPR, ...arrayLength,
      ...arrayFPD, ...arrayLPD, ...arrayLPA, ...arrayVehicle, {name: 'site_id', value: site_id},
      { name: 'date',value: startDate}]
    this.props.submitRouteAssignment(array).then(resolve => {
      this.setState({message: 'Success', showNotification: true})
      this.handleClose();
    }).catch(error=>{
      if(error.response){
        this.setState({message: error.response.data.error.message, showNotification: true})}
      this.handleClose()
  
    })
    
  }
  
  render() {
    return (
      <form id="routeReport">
        <table className="table routes-table text-center" id="routeContent">
          <thead>
          <tr>
            <td>Driver</td>
            <td>Route</td>
            <td>Route ID</td>
            <td>SPR</td>
            <td>Lenght</td>
            <td>FPD</td>
            <td>LPD</td>
            <td>LPA</td>
            <td>VAN</td>
            <td>Remove</td>
          </tr>
          </thead>
          <tbody>
          {this.props.shifts.map((value, index) => {
            if (value.crm_data && value.crm_data.removed != 1) {
              
              var data = {};
              if (this.props.schedules.length != 0) {
                this.props.schedules.routes.map((r, index) => {
                  if (r.crm_account_id == value.crm_data.id) {
                    data = {
                      mainroute: (r && r.route) ? r.route : '',
                      route_id: (r && r.route_id) ? r.route_id : '',
                      spr: (r && r.spr) ? r.spr : '',
                      length: (r && r.route_length) ? r.route_length : '',
                      fpd: (r && r.fpd) ? r.fpd : '',
                      lpd: (r && r.lpd) ? r.lpd : '',
                      lpa: (r && r.lpa) ? r.lpa : '',
                      vehicle: (r && r.vehicle) ? r.vehicle : '',
                      
                    }
                  }
                  
                })
              }
              const mainroute = (this.state.routes[index] && this.state.routes[index].mainroute);
              const route_id = (this.state.routes[index] && this.state.routes[index].route_id);
              const spr = (this.state.routes[index] && this.state.routes[index].spr);
              const length = (this.state.routes[index] && this.state.routes[index].length);
              const fpd = (this.state.routes[index] && this.state.routes[index].fpd);
              const lpd = (this.state.routes[index] && this.state.routes[index].lpd);
              const lpa = (this.state.routes[index] && this.state.routes[index].lpa);
              const vehicle = (this.state.routes[index] && this.state.routes[index].vehicle);
              var objMainroute = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof mainroute != 'undefined' ? mainroute : data.mainroute || ''
              }
              arrayMainroute[index] = objMainroute;
              var objRouteID = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof route_id != 'undefined' ? route_id : data.route_id || ''
              }
              arrayRouteID[index] = objRouteID;
              var objSPR = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof spr != 'undefined' ? spr : data.spr || ''
              }
              arraySPR[index] = objSPR;
              var objLength = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof length != 'undefined' ? length : data.length || ''
              }
              arrayLength[index] = objLength;
              var objFPD = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof fpd != 'undefined' ? fpd : data.fpd || ''
              }
              arrayFPD[index] = objFPD;
              var objLPD = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof lpd != 'undefined' ? lpd : data.lpd || ''
              }
              arrayLPD[index] = objLPD;
              var objLPA = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof lpa != 'undefined' ? lpa : data.lpa || ''
              }
              arrayLPA[index] = objLPA;
              var objVehicle = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof vehicle != 'undefined' ? vehicle : data.vehicle || ''
              }
              arrayVehicle[index] = objVehicle;
              
              
              return (<tr id={'remove_schedule_driver_' + value.crm_data.id} key={index}>
                <td><p>{value.crm_data.first_name + " " + value.crm_data.last_name} </p></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="Route"
                           value={typeof mainroute != 'undefined' ? mainroute : data.mainroute || ''}
                           onChange={event => this.onInputChange(event, index, 'mainroute')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="ID"
                           value={typeof route_id != 'undefined' ? route_id : data.route_id || ''}
                           onChange={event => this.onInputChange(event, index, 'route_id')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="SPR"
                           value={typeof spr != 'undefined' ? spr : data.spr || ''}
                           onChange={event => this.onInputChange(event, index, 'spr')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="Length"
                           value={typeof length != 'undefined' ? length : data.length || ''}
                           onChange={event => this.onInputChange(event, index, 'length')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="FPD"
                           value={typeof fpd != 'undefined' ? fpd : data.fpd || ''}
                           onChange={event => this.onInputChange(event, index, 'fpd')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="LPD"
                           value={typeof lpd != 'undefined' ? lpd : data.lpd || ''}
                           onChange={event => this.onInputChange(event, index, 'lpd')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="LPA"
                           value={typeof lpa != 'undefined' ? lpa : data.lpa || ''}
                           onChange={event => this.onInputChange(event, index, 'lpa')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="VAN"
                           value={typeof vehicle != 'undefined' ? vehicle : data.vehicle || ''}
                           onChange={event => this.onInputChange(event, index, 'vehicle')}/></td>
                <td>
                  <a href="#"
                     onClick={() => {
                       if (window.confirm('Are you sure you would like to delete!?')) {
                         this.removeReport(value.crm_data.id)
                       }
                     }}
                  
                     className="t-icon"><img
                    src="img/tras.png" width="15"/></a>
                  {/*<App/>*/}
                
                </td>
              </tr>)
            }
          })}
          </tbody>
        </table>
        
        <Row style={{MarginTop: 30}}>
          <Col md={8}></Col>
          <Col md={4}>
            <input type="hidden" name="site_id" id="routeSiteID"/>
            <input type="hidden" name="date" id="routeDate"/>
            <a href=" " onClick={(event) => {
              this.submitRouteAssignment()
            }}
               className="btn btn-yellow2 width100">Submit Route Assignment</a>
          </Col>
        </Row>
  
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
      </form>
    
    )
  }
}

function mapStateToProps(state) {
  return {
    shifts: state.shifts,
    schedules: state.schedules,
    dispatcher_reports: state.dispatcher_reports,
    
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ schedule, getShifts, removeReport,submitRouteAssignment}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteAssignmentModal);