import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import ClockPicker from "./time_picker";
import 'bootstrap-daterangepicker/daterangepicker.css';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import dateFormat from 'dateformat';
import {submitHRReport, getShifts} from '../actions/index'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Notification} from 'react-pnotify';

class Reporting extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
      enabled: true,
      startDate: new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear(),
      showNotification: false,
      message: '',
      props: {},
      
    }
    this.handleApply = this.handleApply.bind(this);
  }
  

  onReportChange = (event, id, name) => {
    var index = event.nativeEvent.target.selectedIndex;
    this.setState({
      props: {
        ...this.state.props, [id]: event.nativeEvent.target[index].value,
        [name]: event.nativeEvent.target[index].text
      }
    });
  }
  
  handleApply(event, picker) {
    this.setState({
      startDate: picker.startDate,
    });
  }
  
  onDateChange = (event) => {
    this.setState({startDate: event.target.value})
  }
  onInputChange = (event, name) => {
    this.setState({props: {...this.state.props, [name]: event.target.value}});
  }
  submitHrReport = (event) => {
    event.preventDefault()
    var site_id = localStorage.getItem('site_id');
   var hour=this.state.hours.toString().length==1?"0"+this.state.hours.toString():this.state.hours.toString();
   var minute=this.state.minutes.toString().length==1?"0"+this.state.minutes.toString():this.state.minutes.toString();
    // var time=dateFormat(this.state.hours.toString()  +':'+ this.state.minutes.toString(),"HH:MM")
    var dispatchData = [
      {name: "date", value: dateFormat(this.state.startDate, "mm/dd/yyyy")},
      {name: "site_id", value: site_id},
      {name: "start", value: dateFormat(this.state.startDate, "yyyy-mm-dd")+ ' 0:00:00 -800'},
      {name: "end", value: dateFormat(this.state.startDate, "yyyy-mm-dd")+' 23:59:59 -800'},
      {name: "crm_account_id", value: (JSON.parse(localStorage.getItem("customer_data"))).id},
      {name: "main_topic", value: this.state.props.reportID},
      {name: "date", value: dateFormat(this.state.startDate, "mm/dd/yyyy")},
      {name: "time", value: hour +':'+minute}]
    if (this.state.props.reportID == 1) {
      if (this.state.props.reasonID == 1) {
        if (this.state.props.subReasonID == 1) {
          dispatchData = [...dispatchData,
            {name: "reason", value: this.state.props.reason},
            {name: "sub_reason", value: this.state.props.sub_reason},
            {name: "Package Count", value: this.state.props.packageCount || ''},
            {name: "Stop Count", value: this.state.props.stopCount || ''},
            {name: "Route Length", value: this.state.props.routeLength || ''},
            {name: "Minimum Drop Rate", value: this.state.props.minDropRate || ''},
            {name: "Actual Drop Rate", value: this.state.props.actualDropRate || ''}
          ]
        }
        else if (this.state.props.subReasonID == 2) {
          dispatchData = [...dispatchData,
            {name: "reason", value: this.state.props.reason},
            {name: "sub_reason", value: this.state.props.sub_reason},
            {name: "4 week Running DPMO", value: this.state.props.runningDPMO || ''},
            {name: "DNR count", value: this.state.props.dnrCount1 || ''},
            {name: "total packages delivered", value: this.state.props.totalPackages1 || ''},
            {name: "Current 7 day DPMO", value: this.state.props.current7dayDPMO || ''},
            {name: "DNR count", value: this.state.props.dnrCount2 || ''},
            {name: "total packages delivered", value: this.state.props.totalPackages2 || ''},
          ]
        }
        
      }
      else if (this.state.props.reasonID == 2) {
        if (this.state.props.subReasonID == 1) {
          dispatchData = [...dispatchData,
            {name: "reason", value: this.state.props.reason},
            {name: "sub_reason", value: this.state.props.sub_reason},
            {name: "Harassment Details", value: this.state.props.harassmentDetails || ''},
          ]
        }
        else if (this.state.props.subReasonID == 2) {
          dispatchData = [...dispatchData,
            {name: "reason", value: this.state.props.reason},
            {name: "sub_reason", value: this.state.props.sub_reason},
            {name: "Harassment Details", value: this.state.props.harassmentDetails || ''},
          ]
        }
      }
      else if (this.state.props.reasonID == 3) {
        dispatchData = [...dispatchData,
          {name: "reason", value: this.state.props.reason},
          {name: "sub_reason", value: this.state.props.sub_reason},
          {name: "Harassment Details", value: this.state.props.harassmentDetails || ''},
        ]
      }
      else if (this.state.props.reasonID == 4) {
        dispatchData = [...dispatchData,
          {name: "reason", value: this.state.props.reason},
          {name: "time_arrived", value: this.state.props.time_arrived || ''},
          {name: "Harassment Details", value: this.state.props.harassmentDetails || ''},
        ]
      }
      else if (this.state.props.reasonID == 5) {
        dispatchData = [...dispatchData,
          {name: "reason", value: this.state.props.reason},
          {name: "river_tt_number", value: this.state.props.river_tt_number || ''},
          {name: "Harassment Details", value: this.state.props.harassmentDetails || ''},
        ]
      }
      else if (this.state.props.reasonID == 6) {
        dispatchData = [...dispatchData,
          {name: "reason", value: this.state.props.reason},
          {name: "comments", value: this.state.props.comments || ''},
          {name: "Harassment Details", value: this.state.props.harassmentDetails || ''},
        ]
      }
      
    }
    else if (this.state.props.reportID == 2) {
      dispatchData = [...dispatchData,
        {name: "reason", value: this.state.props.reason || ''},
        {name: "was_da_called", value: this.state.props.was_da_called || 'Yes'},
        {name: "num_times_called", value: this.state.props.num_times_called || '1'},
        {name: "time_called", value: this.state.props.time_called || ''},
        {name: "was_da_texted", value: this.state.props.was_da_texted || 'Yes'},
        {name: "time_texted", value: this.state.props.time_texted || ''},
      ]
    }
    else if (this.state.props.reportID == 3) {
      dispatchData = [...dispatchData,
        {name: "reason", value: this.state.props.reason || ''},
        {name: "was_da_called", value: this.state.props.was_da_called || 'DA was called by Dispatch'},
        {name: "reason_given", value: this.state.props.reason_given || "Car break-down"},
        {name: "office_notified", value: this.state.props.office_notified || "Office was Called"},
        {name: "dispatch_notified", value: this.state.props.dispatch_notified || 'Yes'},
      ]
    }
    else if (this.state.props.reportID == 4) {
      dispatchData = [...dispatchData,
        {name: "reason", value: this.state.props.reason || 'Over headcount'},
      ]
    }
    else if (this.state.props.reportID == 5) {
      dispatchData = [...dispatchData,
        {name: "route", value: this.state.props.route || ''},
        {name: "package_count", value: this.state.props.package_count || ''},
        {name: "stop_count", value: this.state.props.stop_count || ''},
        {name: "da_action", value: this.state.props.da_action || ''},
        {name: "location", value: this.state.props.location || ''},
        {name: "reason", value: this.state.props.reason || 'Unknown stop time'},
      ]
    }
    else if (this.state.props.reportID == 6) {
      dispatchData = [...dispatchData,
        {name: "amazon_name", value: this.state.props.amazon_name || ''},
        {name: "amazon_email", value: this.state.props.amazon_email || ''},
        {name: "stop_count", value: this.state.props.stop_count || ''},
        {name: "da_action", value: this.state.props.da_action || ''},
        {name: "location", value: this.state.props.location || ''},
        {name: "tier", value: this.state.props.tier || "Complaint"},
        {name: "reason", value: this.state.props.reason || "Going off route"},
      ]
    }
  
    // this.props.submitHRReport(dispatchData).then(response => {
    //   this.setState({showNotification: true, message: 'Success'});
    //   this.props.getShifts()
    //   this.props.handleClose()
    // }).catch(error => {
    //   this.setState({message: error.response.data.error.message, showNotification: true})
    //
    // })
  }
  
  render() {
    let label = dateFormat(this.state.startDate, "mm/dd/yyyy");
    let {hours, minutes, enabled} = this.state;
    let checkbox = <input type="checkbox" checked={this.state.enabled}
                          onChange={(e) => this.setState({enabled: e.target.checked})}/>;
    return (
      <Modal className="reporting " show={this.props.showModal}
             onHide={() => this.props.handleClose()}>
        <Modal.Header closeButton style={{paddingTop: 0}}>
        
        </Modal.Header>
        
        <Modal.Body>
          <div id="hrReportForm">
            <div className="row d-flex align-items-center">
              <div className="col-md-1 ">
                <img src="img/reporting_icon.png" width="55"/>
              </div>
              <div className="col-md-11" style={{marginTop: 2 + '%'}}>
                <h5 className="modal-title" id="reportDriverTitle"
                    style={{marginLeft: 15 + 'px'}}>
                  {('Report: ' + this.props.value.crm_data.first_name + ' ' +
                    this.props.value.crm_data.last_name + ' By: ' + this.props.user.firstname + ' ' +
                    this.props.user.lastname).toUpperCase()}
                </h5>
              </div>
            </div>
            
            <div className="empty-xs-30 empty-md-30"></div>
            
            <div className="row" style={{height: 48 + 'px'}}>
              <div className="col-md-6 custom-select-1" style={{height: 100 + '%'}}>
                <div className="row d-flex align-items-center"
                     style={{height: 100 + '%'}}>
                  <div className="col-md-1 mobile-center" style={{marginTop: 10 + 'px'}}>
                    <img src="img/select-icon.png" width='25'/>
                  </div>
                  <div className="col-md-10 mobile-center" style={{height: 100 + '%'}}>
                    <select name="main_topic" id="reportTopic"
                            onChange={(event) => this.onReportChange(event, 'reportID', 'report')}
                            className="select2 select-icon">
                      <option value="0">Please Select Report</option>
                      <option value="1">HR Reporting</option>
                      <option value="2">NCNS</option>
                      <option value="3">LMCO</option>
                      <option value="4">Sent Home</option>
                      <option value="5">On-Road Reporting</option>
                      <option value="6">Amazon Reporting</option>
                    </select>
                  
                  </div>
                </div>
              </div>
            </div>
            
            <div className="empty-xs-40 empty-md-50"></div>
            
            <div className="row">
              <div className="col-md-8">
                <div className="row datepicker">
                  <div className="col-md-1 ">
                    <p>Date</p>
                  </div>
                  
                  <div className="col-md-10">
                    <div className="form-group">
                      <div className='input-group date'>
                        
                        <DatetimeRangePicker
                          showDropdowns
                          singleDatePicker
                          date={this.state.startDate}
                          onApply={this.handleApply}>
                          <Button className="datePickerBtn">
                            <input id="daterange3" type="text"
                                   value={label}
                                   onChange={(event) => this.onDateChange(event)}
                                   name="date"
                                   className="form-control b-r-0"/>
                            <i className="font-icon font-icon-calend"/> &nbsp;
                          
                          </Button>
                        </DatetimeRangePicker>
                      
                      </div>
                    </div>
                  </div>
                </div>
              
              </div>
              <div className="col-md-4">
                <div className="row timepicker ">
                  <div className="col-md-1">
                    <p>Time</p>
                  </div>
                  <div className="col-md-11">
                    <div className="form-group">
                      
                      <ClockPicker
                        addonBefore={checkbox}
                        placement='bottom'
                        disabled={!enabled}
                        hours={hours}
                        minutes={minutes}
                        onChange={(hours, minutes) => this.setState({hours, minutes})}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="empty-xs-10 empty-md-10"></div>
            
            {(this.state.props.reportID == 1) ?
              <div className="row">
                <div className="col-md-12">
                  <select id="HRreason" name="reason" className="select2"
                          onChange={(event) => this.onReportChange(event, 'reasonID', 'reason')}
                  >
                    <option value='0'>Please Select a Reason</option>
                    <option value='1'>Performance</option>
                    <option value='2'>Harassment</option>
                    <option value='3'>Insubordination</option>
                    <option value='4'>Tardiness</option>
                    <option value='5'>Rabbit Damage</option>
                    <option value='6'>Other</option>
                  </select>
                </div>
                {(this.state.props.reasonID == 1) ?
                  <div>
                    <div className="empty-xs-20 empty-md-20"></div>
                    <div className="col-md-12">
                      <select name="sub_reason" className="select2"
                              onChange={(event) => this.onReportChange(event, 'subReasonID', "sub_reason")}>
                        <option value='0'>Please Select an Answer</option>
                        <option value='1'>Does not meet minimum hourly drop rate</option>
                        <option value='2'>DPMO</option>
                      </select>
                    </div>
                    {(this.state.props.subReasonID == 1) ?
                      <div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        <div>
                          <div className="col-md-12"><span>Package Count</span><br/>
                            <p className="form-control-static">
                              <input type="text" className="form-control" name="Package Count" placeholder="Reason"
                                     value={this.state.props.packageCount|| ''}
                                     onChange={(e) => {
                                       this.onInputChange(e, 'packageCount')
                                     }}
                              /></p>
                          </div>
                        </div>
                        <div>
                          <div className="col-md-12"><span>Stop Count</span><br/><p className="form-control-static">
                            <input
                              type="text" className="form-control" name="Stop Count" placeholder="Reason"
                              value={this.state.props.stopCount || ''}
                              onChange={(e) => {
                                this.onInputChange(e, 'stopCount')
                              }}
                            /></p></div>
                        </div>
                        <div>
                          <div className="col-md-12"><span>Route Length</span><br/><p className="form-control-static">
                            <input
                              type="text" className="form-control" name="Route Length" placeholder="Reason"
                              value={this.state.props.routeLength || ''}
                              onChange={(e) => {
                                this.onInputChange(e, 'routeLength')
                              }}
                            /></p></div>
                        </div>
                        <div>
                          <div className="col-md-12"><span>Minimum Drop Rate</span><br/><p
                            className="form-control-static">
                            <input type="text" className="form-control" name="Minimum Drop Rate" placeholder="Reason"
                                   value={this.state.props.minDropRate || ''}
                                   onChange={(e) => {
                                     this.onInputChange(e, 'minDropRate')
                                   }}
                            /></p>
                          </div>
                        </div>
                        <div>
                          <div className="col-md-12"><span>Actual Drop Rate</span><br/><p
                            className="form-control-static"><input
                            type="text" className="form-control" name="Actual Drop Rate" placeholder="Reason"
                            value={this.state.props.actualDropRate || ''}
                            onChange={(e) => {
                              this.onInputChange(e, 'actualDropRate')
                            }}
                          /></p></div>
                        </div>
                      </div>
                      : (this.state.props.subReasonID == 2) ?
                        <div>
                          <div className="empty-xs-20 empty-md-20"></div>
                          <div>
                            <div className="col-md-12"><span>4 week Running DPMO</span><br/><p
                              className="form-control-static">
                              <input type="text" className="form-control" name="4 week Running DPMO"
                                     placeholder="Reason"
                                     value={this.state.props.runningDPMO || ''}
                                     onChange={(e) => {
                                       this.onInputChange(e, 'runningDPMO')
                                     }}/>
                            </p>
                            </div>
                          </div>
                          <div>
                            <div className="col-md-12"><span>DNR count</span><br/><p className="form-control-static">
                              <input
                                type="text" className="form-control" name="DNR count" placeholder="Reason"
                                value={this.state.props.DNRcount1 || ''}
                                onChange={(e) => {
                                  this.onInputChange(e, 'DNRcount1')
                                }}
                              /></p></div>
                          </div>
                          <div>
                            <div className="col-md-12"><span>Total Packages Delivered</span><br/><p
                              className="form-control-static">
                              <input type="text" className="form-control"
                                                                     name="total packages delivered"
                                                                     placeholder="Reason"
                                                                     value={this.state.props.totalPackages1 || ''}
                                                                     onChange={(e) => {
                                                                       this.onInputChange(e, 'totalPackages1')
                                                                     }}/></p>
                            </div>
                          </div>
                          <div>
                            <div className="col-md-12"><span>Current 7 day DPMO</span><br/><p
                              className="form-control-static">
                              <input type="text" className="form-control" name="Current 7 day DPMO"
                                     placeholder="Reason"
                                     value={this.state.props.current7dayDPMO || ''}
                                     onChange={(e) => {
                                       this.onInputChange(e, 'current7dayDPMO')
                                     }}
                              /></p>
                            </div>
                          </div>
                          <div>
                            <div className="col-md-12"><span>DNR count</span><br/><p className="form-control-static">
                              <input
                                type="text" className="form-control" name="DNR count" placeholder="Reason"
                                value={this.state.props.DNRcount2 || ''}
                                onChange={(e) => {
                                  this.onInputChange(e, 'DNRcount2')
                                }}
                              
                              /></p></div>
                          </div>
                          <div>
                            <div className="col-md-12"><span>Total Packages Delivered</span><br/><p
                              className="form-control-static"><input type="text" className="form-control"
                                                                     name="total packages delivered"
                                                                     placeholder="Reason"
                                                                     value={this.state.props.totalPackages2 || ''}
                                                                     onChange={(e) => {
                                                                       this.onInputChange(e, 'totalPackages2' || '')
                                                                     }}/></p>
                            </div>
                          </div>
                        </div>
                        : ''}
                  </div>
                  : (this.state.props.reasonID == 2) ?
                    <div>
                      <div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        <div className="col-md-12">
                          <select name="sub_reason" className="select2"
                                  onChange={(event) => this.onReportChange(event, 'subReasonID', "sub_reason")}>
                            >
                            <option>Please Select an Answer</option>
                            <option>Verbal</option>
                            <option>Sexual Harassment</option>
                          </select>
                        </div>
                      </div>
                      
                      
                      <div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        <div className="col-md-12"><span>Details</span><br/><p className="form-control-static"><input
                          type="text" className="form-control" name="Harassment Details" placeholder="Reason"
                          value={this.state.props.harassmentDetails || ''}
                          onChange={(e) => {
                            this.onInputChange(e, 'harassmentDetails')
                          }}
                        /></p>
                        </div>
                      </div>
                    </div>
                    : (this.state.props.reasonID == 3) ?
                      <div>
                        <div>
                          <div className="empty-xs-20 empty-md-20"></div>
                          <div className="col-md-12">
                            <select name="sub_reason" className="select2"
                                    onChange={(event) => this.onReportChange(event, 'subReasonID', 'sub_reason')}
                            >
                              <option>Please Select an Answer</option>
                              <option>On site</option>
                              <option>Off site</option>
                              <option>Phone</option>
                              <option>Over Phone Text</option>
                              <option>Refusal to clean Van</option>
                              <option>Not following Dispatch directions</option>
                              <option>Refusal of work</option>
                              <option>Refusal to rescue</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <div className="empty-xs-20 empty-md-20"></div>
                          <div className="col-md-12"><span>Details</span><br/><p className="form-control-static"><input
                            type="text" className="form-control" name="Harassment Details" placeholder="Reason"
                            value={this.state.props.harassmentDetails || ''}
                            onChange={(e) => {
                              this.onInputChange(e, 'harassmentDetails')
                            }}
                          /></p>
                          </div>
                        </div>
                      </div>
                      : (this.state.props.reasonID == 4) ?
                        <div>
                          <div>
                            <div className="empty-xs-20 empty-md-20"></div>
                            <div className="col-md-12"><span>Time Arrived</span><br/><p className="form-control-static">
                              <input type="text" className="form-control" name="time_arrived"
                                     placeholder="Time Arrived"
                                     value={this.state.props.time_arrived || ''}
                                     onChange={(e) => {
                                       this.onInputChange(e, 'time_arrived')
                                     }}
                              />
                            </p>
                            </div>
                          </div>
                          <div>
                            <div className="empty-xs-20 empty-md-20"></div>
                            <div className="col-md-12"><span>Details</span><br/><p className="form-control-static">
                              <input
                                type="text" className="form-control" name="Harassment Details" placeholder="Reason"
                                value={this.state.props.harassmentDetails || ''}
                                onChange={(e) => {
                                  this.onInputChange(e, 'harassmentDetails')
                                }}/>
                            </p></div>
                          </div>
                        </div>
                        
                        : (this.state.props.reasonID == 5) ?
                          <div>
                            <div>
                              <div className="empty-xs-20 empty-md-20"></div>
                              <div className="col-md-12"><span>River TT #</span><br/><p className="form-control-static">
                                <input type="text" className="form-control" name="river_tt_number"
                                       placeholder="River TT #"
                                       value={this.state.props.river_tt_number || ''}
                                       onChange={(e) => {
                                         this.onInputChange(e, 'river_tt_number')
                                       }}/>
                              </p></div>
                            </div>
                            <div>
                              <div className="empty-xs-20 empty-md-20"></div>
                              <div className="col-md-12"><span>Details</span><br/><p className="form-control-static">
                                <input
                                  type="text" className="form-control" name="Harassment Details" placeholder="Reason"
                                  value={this.state.props.harassmentDetails || ''}
                                  onChange={(e) => {
                                    this.onInputChange(e, 'harassmentDetails')
                                  }}/>
                              </p></div>
                            </div>
                          </div>
                          : (this.state.props.reasonID == 6) ?
                            <div>
                              <div>
                                <div className="empty-xs-20 empty-md-20"></div>
                                <div className="col-md-12"><span>Comments</span><br/><p className="form-control-static">
                                  <input
                                    type="text" className="form-control" name="comments" placeholder="Comments"
                                    value={this.state.props.comments || ''}
                                    onChange={(e) => {
                                      this.onInputChange(e, 'comments')
                                    }}
                                  /></p>
                                </div>
                              </div>
                              <div>
                                <div className="empty-xs-20 empty-md-20"></div>
                                <div className="col-md-12"><span>Details</span><br/><p className="form-control-static">
                                  <input
                                    type="text" className="form-control" name="Harassment Details"
                                    placeholder="Reason"
                                    value={this.state.props.harassmentDetails || ''}
                                    onChange={(e) => {
                                      this.onInputChange(e, 'harassmentDetails')
                                    }}
                                  /></p></div>
                              </div>
                            </div>
                            : ''
                }
              </div>
              
              
              : (this.state.props.reportID == 2) ?
                <div>
                  <div className="row">
                    <div className="col-md-12"><span>Reason</span><br/><p className="form-control-static">
                      <input type="text" className="form-control" name="reason" placeholder="Reason"
                             value={this.state.props.reason || ''}
                             onChange={(e) => {
                               this.onInputChange(e, 'reason')
                             }}
                      /></p></div>
                  </div>
                  <div className="empty-xs-20 empty-md-20"></div>
                  
                  <div className="row">
                    <div className="col-md-12">
                      <span>Was the DA called?</span><br/>
                      <select id="HRreason" name="was_da_called"
                              className="select2"
                              onChange={(event) => this.onReportChange(event, 'subReasonID1', "was_da_called")}>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                  <div className="empty-xs-20 empty-md-20"></div>
                  
                  <div className="row">
                    <div className="col-md-12">
                      <span># of times called</span><br/>
                      <select id="mainReason" name="num_times_called"
                              className="select2"
                              onChange={(event) => this.onReportChange(event, 'subReasonID2', "num_times_called")}>
                        
                        <option>1</option>
                        <option>2</option>
                        <option>2+</option>
                      </select></div>
                  </div>
                  <div className="empty-xs-20 empty-md-20"></div>
                  
                  <div className="row">
                    <div className="col-md-12"><span>Time called</span><br/><p className="form-control-static"><input
                      type="text" className="form-control" name="time_called" placeholder="Time Called"
                      value={this.state.props.time_called || ''}
                      onChange={(e) => {
                        this.onInputChange(e, 'time_called')
                      }}/></p></div>
                  </div>
                  <div className="empty-xs-20 empty-md-20"></div>
                  
                  <div className="row">
                    <div className="col-md-12">
                      <span>Was the DA texted?</span><br/>
                      <select id="mainReason" name="was_da_texted"
                              className="select2"
                              onChange={(event) => this.onReportChange(event, 'subReasonID3', "was_da_texted")}>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                  <div className="empty-xs-20 empty-md-20"></div>
                  
                  <div className="row">
                    <div className="col-md-12"><span>Time Texted</span><br/><p className="form-control-static"><input
                      type="text" className="form-control" name="time_texted" placeholder="Time Texted"
                      value={this.state.props.time_texted || ''}
                      onChange={(e) => {
                        this.onInputChange(e, 'time_texted')
                      }}
                    /></p></div>
                  </div>
                  
                  <div className="empty-xs-20 empty-md-20"></div>
                
                
                </div>
                
                : (this.state.props.reportID == 3) ?
                  <div>
                    <div className="row">
                      <div className="col-md-12"><span>Reason</span><br/><p className="form-control-static">
                        <input type="text"
                               className="form-control"
                               name="reason"
                               placeholder="Reason"
                               value={this.state.props.reason || ''}
                               onChange={(e) => {
                                 this.onInputChange(e, 'reason')
                               }}/></p>
                      </div>
                    </div>
                    <div className="empty-xs-20 empty-md-20"></div>
                    
                    <div className="row">
                      <div className="col-md-12">
                        <span>Was the DA called?</span><br/>
                        <select id="mainReason" name="was_da_called"
                                className="select2"
                                onChange={(event) => this.onReportChange(event, 'subReasonID4', "was_da_called")}>
                          
                          <option>DA was called by Dispatch</option>
                          <option>DA called Dispatch</option>
                        </select>
                      </div>
                    </div>
                    <div className="empty-xs-20 empty-md-20"></div>
                    
                    <div className="row">
                      
                      <div className="col-md-12">
                        <span>Was a reason given?</span><br/>
                        <select id="mainReason" name="reason_given"
                                className="select2"
                                onChange={(event) => this.onReportChange(event, 'subReasonID5', "reason_given")}>
                          <option>Car break-down</option>
                          <option>Babysitter</option>
                          <option>Family Emergency</option>
                          <option>Sick</option>
                          <option>Got in accident</option>
                          <option>Previous engagement</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="empty-xs-20 empty-md-20"></div>
                    
                    <div className="row">
                      <div className="col-md-12">
                        <span>Was office notified?</span><br/>
                        <select id="mainReason" name="office_notified"
                                className="select2"
                                onChange={(event) => this.onReportChange(event, 'subReasonID6', "office_notified")}>
                          
                          <option>Office was Called</option>
                          <option>Office was sent a text</option>
                          <option>Ticket was submitted</option>
                        </select></div>
                    </div>
                    <div className="empty-xs-20 empty-md-20"></div>
                    
                    <div className="row">
                      <div className="col-md-12">
                        <span>Did office notify dipatch?</span><br/>
                        <select id="mainReason" name="dispatch_notified"
                                className="select2"
                                onChange={(event) => this.onReportChange(event, 'subReasonID6', "dispatch_notified")}>
                          
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>
                    <div className="empty-xs-20 empty-md-20"></div>
                  
                  </div>
                  
                  : (this.state.props.reportID == 4) ?
                    <div className="row">
                      <div className="col-md-12">
                        <span>Reason?</span><br/>
                        <select id="mainReason" name="reason" className="select2"
                                onChange={(event) => this.onReportChange(event, 'subReasonID5', "reason")}>
                          <option>Over headcount</option>
                          <option>Late</option>
                          <option>Not in uniform</option>
                        </select>
                      </div>
                    </div>
                    : (this.state.props.reportID == 5) ?
                      <div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        
                        <div className="row">
                          <div className="col-md-12"><span>Route</span><br/><p className="form-control-static">
                            <input type="text" className="form-control" name="route" placeholder="Route"
                                   value={this.state.props.route || ''}
                                   onChange={(e) => {
                                     this.onInputChange(e, 'route')
                                   }}/></p></div>
                        </div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        
                        <div className="row">
                          <div className="col-md-12"><span>Package count</span><br/><p className="form-control-static">
                            <input type="text" className="form-control" name="package_count"
                                   placeholder="Package Count"
                                   value={this.state.props.package_count || ''}
                                   onChange={(e) => {
                                     this.onInputChange(e, 'package_count')
                                   }}/>
                          </p></div>
                        </div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        
                        <div className="row">
                          <div className="col-md-12"><span>Stop Count</span><br/><p className="form-control-static">
                            <input
                              type="text" className="form-control" name="stop_count" placeholder="Stop Count"
                              value={this.state.props.stop_count || ''}
                              onChange={(e) => {
                                this.onInputChange(e, 'stop_count')
                              }}/></p>
                          </div>
                        </div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        
                        <div className="row">
                          <div className="col-md-12"><span>DA action</span><br/><p className="form-control-static">
                            <input
                              type="text" className="form-control" name="da_action" placeholder="DA action"
                              value={this.state.props.da_action || ''}
                              onChange={(e) => {
                                this.onInputChange(e, 'da_action')
                              }}/></p></div>
                        </div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        
                        <div className="row">
                          <div className="col-md-12"><span>Location</span><br/><p className="form-control-static"><input
                            type="text" className="form-control" name="location" placeholder="Location"
                            value={this.state.props.location || ''}
                            onChange={(e) => {
                              this.onInputChange(e, 'location')
                            }}/></p></div>
                        </div>
                        <div className="empty-xs-20 empty-md-20"></div>
                        
                        <div className="row">
                          <div className="col-md-12">
                            <span>Reason</span><br/>
                            <select id="mainReason" name="reason" className="select2"
                                    onChange={(event) => this.onReportChange(event, 'subReasonID6', "reason")}>
                              >
                              <option>Going off route</option>
                              <option>Extended lunch</option>
                              <option>Unknown stop time</option>
                              <option>Reckless Driving</option>
                              <option>Customer Service complaint</option>
                              <option>Marking Packages incorrectly</option>
                              <option>Rescue Refusal</option>
                              <option>Excessive personal phone usage</option>
                              <option>No sense of Urgency</option>
                            </select>
                          </div>
                        </div>
                        <div className="empty-xs-20 empty-md-20"></div>
                      
                      </div>
                      : (this.state.props.reportID == 6) ?
                        <div>
                          <div className="row">
                            <div className="col-md-12"><span>Amazon associate name</span><br/><p
                              className="form-control-static">
                              <input type="text" name="amazon_name" className="form-control"
                                     placeholder="Amazon associate name"
                                     value={this.state.props.amazon_name || ''}
                                     onChange={(e) => {
                                       this.onInputChange(e, 'amazon_name')
                                     }}/></p></div>
                          </div>
                          <div className="empty-xs-20 empty-md-20"></div>
  
                          <div className="row">
                            <div className="col-md-12"><span>Amazon associate email</span><br/><p
                              className="form-control-static">
                              <input type="text" className="form-control" name="amazon_email"
                                     placeholder="Amazon associate email"
                                     value={this.state.props.amazon_email || ''}
                                     onChange={(e) => {
                                       this.onInputChange(e, 'amazon_email')
                                     }}/></p></div>
                          </div>
                          <div className="empty-xs-20 empty-md-20"></div>
  
                          <div className="row">
                            <div className="col-md-12"><span>Stop Count</span><br/><p className="form-control-static">
                              <input
                                type="text" className="form-control" name="stop_count" placeholder="Stop Count"
                                value={this.state.props.stop_count || ''}
                                onChange={(e) => {
                                  this.onInputChange(e, 'stop_count')
                                }}/></p>
                            </div>
                          </div>
                          <div className="empty-xs-20 empty-md-20"></div>
  
                          <div className="row">
                            <div className="col-md-12"><span>DA action</span><br/><p className="form-control-static">
                              <input
                                type="text" className="form-control" name="da_action" placeholder="DA action"
                                value={this.state.props.da_action || ''}
                                onChange={(e) => {
                                  this.onInputChange(e, 'da_action')
                                }}/></p>
                            </div>
                          </div>
                          <div className="empty-xs-20 empty-md-20"></div>
  
                          <div className="row">
                            <div className="col-md-12"><span>Location</span><br/><p className="form-control-static">
                              <input
                                type="text" className="form-control" name="location" placeholder="Location"
                                value={this.state.props.location || ''}
                                onChange={(e) => {
                                  this.onInputChange(e, 'location')
                                }}/></p></div>
                          </div>
                          <div className="empty-xs-20 empty-md-20"></div>
  
                          <div className="row">
                            <div className="col-md-12">
                              <span>Tier</span><br/><select id="mainReason" name="tier" className="select2"
                                                            onChange={(event) => this.onReportChange(event, 'subReasonID6', "tier")}>

                            <option>Tier 1</option>
                              <option>Tier 2</option>
                              <option>Complaint</option>
                            </select>
                            </div>
                          </div>
                          <div className="empty-xs-20 empty-md-20"></div>
  
                          <div className="row">
                            <div className="col-md-12">
                              <span>Reason</span><br/><select id="mainReason" name="reason" className="select2"
                                                              onChange={(event) => this.onReportChange(event, 'subReasonID7', "reason")}>

                            <option>Leaving packages outside unattended</option>
                              <option>Loud music</option>
                              <option>Driving hazard on site</option>
                              <option>Leaving tote bags outside gaylord</option>
                              <option>SALT package</option>
                              <option>Urine bottle</option>
                              <option>Going off route</option>
                              <option>Marking packages missing</option>
                              <option>Uniform</option>
                              <option>Professionalism</option>
                              <option>Safety Vest</option>
                              <option>Not sorting</option>
                              <option>Inapproprite comments</option>
                              <option>Mishandling packages</option>
                              <option>Concessions</option>
                              <option>Not calling TOC</option>
                              <option>Not calling Cx</option>
                              <option>Bulk drops to Apartment</option>
                              <option>Cx confrontation</option>
                              <option>Other</option>
                            </select>
                            </div>
                          </div>
                          <div className="empty-xs-20 empty-md-20"></div>

                        </div> : ''}
            
            <div id="insertHRQuestions"></div>
            <div id="insertHRQuestions2" style={{marginTop: 20 + 'px'}}></div>
            <div id="insertHRQuestions3" style={{marginTop: 20 + 'px'}}></div>
            
            <div className="empty-xs-30 empty-md-30"></div>
            
            <div className="row">
              <div className="col-md-8"></div>
              <div className="col-md-4 text-right ">
                <a href="#"
                   onClick={
                     (event) => this.submitHrReport(event)
                   }
                   className="btn btn-yellow2">Submit</a>
              </div>
            </div>
          </div>
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
    
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getShifts, submitHRReport}, dispatch);
}

export default connect(null, mapDispatchToProps)(Reporting);
