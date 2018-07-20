import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import {connect} from "react-redux";
import {getShifts, submitRescue} from "../actions";
import {bindActionCreators} from "redux";
import ClockPicker from "./time_picker";
import {Notification} from 'react-pnotify';

class SendRescue extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false,
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
      enabled: true,
      rescuer: '',
      packages: '',
      rescuerID: '',
      showNotification: false,
      message:''
      
    };
  }
  
  onPackagesChange = (event) => {
    this.setState({packages: event.target.value})
  }
  onDriverChange = (event) => {
    var index = event.nativeEvent.target.selectedIndex;
    var rescuer = event.nativeEvent.target[index].text;
    var rescuerID = event.nativeEvent.target[index].value
    this.setState({rescuer: rescuer, rescuerID: rescuerID});
  }
  
  submitRescue = (event) => {
    event.preventDefault()
    this.props.submitRescue(this.state.packages,this.state.hours+':'+this.state.minutes,this.state.rescuer,this.state.rescuerID).
    then(response => {
      this.setState({message:"Added",showNotification:true})
      this.props.handleClose()
    }).catch(error=>{
      this.setState({message: error.response.data.error.message,showNotification:true})
      this.props.handleClose()
  
    })
  }
  
  render() {
    let {hours, minutes, enabled} = this.state;
    let checkbox = <input type="checkbox" checked={this.state.enabled}
                          onChange={(e) => this.setState({enabled: e.target.checked})}/>;
    return (
      
      <Modal.Body>
        <div className="empty-xs-20 empty-md-30"></div>
        
        <div className="row">
          <div className="col-md-12 rescue">
            <select className="select2" id="rescueDrivers" onChange={(event) => this.onDriverChange(event)}>
              {this.props.shifts.map((value, index) => {
                if (value.crm_data) {
                  if (value.crm_data.id !== this.props.driverId) {
                    return (<option value={value.crm_data.id}
                                    key={index}>{value.crm_data.first_name} {value.crm_data.last_name}</option>)
                  }
                }
                
              })}
            </select>
          </div>
        </div>
        
        <div className="empty-xs-10 empty-md-10"></div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="form-group clockpicker">
              <ClockPicker
                addonBefore={checkbox}
                placement='bottom'
                disabled={!enabled}
                hours={hours}
                minutes={minutes}
                onChange={(hours, minutes) => this.setState({hours, minutes})}/>
            </div>
          </div>
          <div className="col-md-6">
            <p className="form-control-static"><input type="text" className="form-control" id="rescuePackages"
                                                      placeholder="Packages" value={this.state.packages}
                                                      onChange={(event) => {
                                                        this.onPackagesChange(event)
                                                      }}/></p>
          </div>
        </div>
        
        <div className="empty-xs-30 empty-md-30"></div>
        
        <div className="row">
          <div className="col-md-7"></div>
          <div className="col-md-5 text-right ">
            <input type="hidden" id="rescueDriverID"/>
            <a href="javascript:void(0);" id="submitRescueButton"
               onClick={(event)=>this.submitRescue(event)}
               className="btn btn-yellow2">Submit</a>
          </div>
        </div>
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
      
      </Modal.Body>
    
    )
  }
  
  
}


function mapStateToProps(state) {
  
  return {
    shifts: state.shifts,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getShifts, submitRescue}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SendRescue);