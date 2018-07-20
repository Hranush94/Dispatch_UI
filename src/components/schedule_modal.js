import React, {Component} from 'react';
import {Button, OverlayTrigger, Row, Col, Label} from 'react-bootstrap';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
  getLocations,
  schedule,
  getShifts,
  getDrivers2,
  submitScheduleReport,
  removeReport,
  pullDispachersReport
} from "../actions";
import {Notification} from 'react-pnotify';
import Reporting from "./reporting_modal";

var user = JSON.parse(localStorage.getItem('customer_data'));
var array = [],
  arrayStart = [],
  arrayEnd = [],
  arrayWave = [];

var today = new Date();
const startDate = ((today.getMonth() + 1).toString().length < 2 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' +
  (today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate()) + '-' + today.getFullYear();
var site_id = localStorage.getItem('site_id')

class ScheduleModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showNotification: false,
      message:'',
      schedules: {},
      driverId: '',
      showModal: false,
      hours: 12,
      minutes: 20,
      enabled: true,
      
    };
  }
  
  componentDidMount() {
    this.props.getShifts();
    this.props.schedule();
    this.props.pullDispachersReport()
  }
  
  handleShow = (event, driverid) => {
    event.preventDefault();
    this.setState({showModal: true, driverId: driverid});
  }
  
  handleClose = () => {
    this.setState({showModal: false});
    
  }
  onInputChange = (event, id, keyName) => {
    if (keyName === 'wave') {
      let schedule = this.state.schedules[id] || {};
      var index = event.nativeEvent.target.selectedIndex;
      schedule[keyName] = event.nativeEvent.target[index].value;
      this.setState({
        schedules: {
          ...this.state.schedules,
          [id]: schedule
          
        }
      })
    } else {
      let schedule = this.state.schedules[id] || {};
      schedule[keyName] = event.target.value;
      this.setState({
        schedules: {
          ...this.state.schedules,
          [id]: schedule
          
        }
      })
    }
    
  }
  
  
  removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }
  submitScheduleReport = (event) => {
    event.preventDefault();
    array = [...arrayStart, ...arrayEnd, ...arrayWave, {name: 'site_id', value: site_id}, {
      name: 'date',
      value: startDate
    }]
    this.props.submitScheduleReport(array).then(resolve => {
      this.setState({message: 'Success', showNotification: true})
      this.handleClose();
    }).catch(error => {
      if(error.response){
        this.setState({message: error.response.data.error.message, showNotification: true})}
      this.handleClose()
  
    })
  }
  
  
  render() {
    return (
      <form id="scheduleReport">
        <table className="table routes-table text-center" id="scheduleContent" style={{display:"flex"}}>
          <thead>
          <tr>
            <td>Drivers</td>
            <td>EOS Start</td>
            <td>EOS End</td>
            <td>Wave</td>
            <td>Reports</td>
          </tr>
          </thead>
          <tbody>
          {this.props.shifts.map((value, index) => {
            if (value.crm_data) {
              var data = {};
              var driverId = '';
              if (this.props.schedules.length != 0) {
                this.props.schedules.schedules.map((schedule, index) => {
                  if (schedule.crm_account_id == value.crm_data.id) {
                    data = {start: schedule.start, end: schedule.end, wave: schedule.wave}
                    
                  }
                })
              }
              const end = (this.state.schedules[index] && this.state.schedules[index].end);
              const start = (this.state.schedules[index] && this.state.schedules[index].start);
              const wave = (this.state.schedules[index] && this.state.schedules[index].wave);
              var objStart = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof start != 'undefined' ? start : data.start || ''
              }
              arrayStart[index] = objStart
              
              var objEnd = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: (typeof end !== 'undefined') ? end : data.end || ''
              }
              arrayEnd[index] = objEnd
              var objWave = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof wave != 'undefined' ? wave : data.wave || ''
              }
              arrayWave[index] = objWave;
              
              return (
                <tr key={index}>
                  <td><p>{value.crm_data.first_name + " " + value.crm_data.last_name}</p></td>
                  <td><input type="text" name={'user_' + value.crm_data.id + '[] '} className="form-control"
                             placeholder="EOS Start"
                             value={typeof start != 'undefined' ? start : data.start || ''}
                             onChange={event => this.onInputChange(event, index, 'start')}
                  /></td>
                  <td><input type="text" name={'user_' + value.crm_data.id + '[]'} className="form-control"
                             placeholder="EOS End"
                             value={(typeof end !== 'undefined') ? end : data.end || ''}
                             onChange={event => this.onInputChange(event, index, 'end')}
                  /></td>
                  <td><select name={'user_' + value.crm_data.id + '[]'}
                              value={typeof wave != 'undefined' ? wave : data.wave || ''}
                              className="select2" onChange={event => this.onInputChange(event, index, 'wave')}>
                    {data.wave && data.wave === '1' ?
                      <option value="1">Wave 1</option>
                      : ''}
                    {(this.props.dispatcherReport && this.props.dispatcherReport.wave2) ?
                    //  data.wave === '2' ?
                        <option value="2">Wave 2</option> : ''
                      //: ''
                    }
                    {(this.props.dispatcherReport && this.props.dispatcherReport.wave3) ?
                     
                        <option value="3">Wave 3</option> : ''
                    }
                    {(this.props.dispatcherReport && this.props.dispatcherReport.wave4) ?
                                              <option value="4">Wave 4</option> : ''}
                  </select></td>
                  <td><a href="#" onClick={(event) => this.handleShow(event, value.crm_data.id)}
                         className="btn btn-report">Report</a>
                    {(this.state.driverId === value.crm_data.id) ?
                      
                      <Reporting value={value} showModal={this.state.showModal}
                                 handleClose={this.handleClose} user={user}/>
                      : ""}
                  
                  
                  </td>
                </tr>);
            }
          })
          
          
          }
          </tbody>
        </table>
        
        
        <Row style={{MarginTop: 30}}>
          <Col md={8}></Col>
          <Col md={4}>
            <input type="hidden" name="site_id" id="scheduleSiteID"/>
            <input type="hidden" name="date" id="scheduleDate"/>
            <a href="" onClick={event => this.submitScheduleReport(event)}
            
               className="btn btn-yellow2 width100">Submit Schedule Report</a>
          
          
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
    dispatcherReport: state.dispatcher_reports,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getLocations,
    schedule,
    getShifts,
    getDrivers2,
    submitScheduleReport,
    removeReport, pullDispachersReport
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleModal);