import React, {Component} from 'react';
import {Notification} from 'react-pnotify';
import {Modal} from 'react-bootstrap';
import Moment from 'react-moment';
import {hourly, schedule, settings, getLocations, getShifts} from "../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import UPDTotals from "./upd_totals";
import HourSubmit from "./hour_submit_modal";

import dateFormat from "dateformat";

var token = localStorage.getItem('token');
var date = dateFormat(new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear(), "mm/dd/yyyy")
var site_id = localStorage.getItem('site_id');
var list = [];
let completed_hourly_report, report_by_hour, removedHours, hour_count, display_hours;
let count = 8;
let exists = 0;
let user_count = 0;
let user_removed = [];
var dt;

class Reports extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      message: '',
      isError: false,
      list: [],
      value:''
    };
  }
  
  handleShow = (event) => {
    event.preventDefault();
   // if (this.state.list.length > 0) {
      this.setState({show: true});
   // }
    
  }
  
  handleClose = () => {
    this.setState({show: false});
    
  }
  
  componentDidMount() {
    // if (site_id ) {
    this.schedule();
    this.props.getLocations(9)
    this.props.getShifts().then(response=>{
        response.map((value, index) => {
          if (value.crm_data) {
        
            if (value.crm_data.removed == 0) {
              user_count++;
            } else {
              user_removed.push(value.crm_account_id);
            }
          }
      
        });
    }) ;
    // }
    
    this.props.settings().then(response => {
      if (this.props.websiteData.hr == 1) {
        this.track();
      }
      
    })
  }
  
  
  track = () => {
    var site_info;
    this.props.locationSites && this.props.locationSites.map((location, index) => {
      if (site_info) {
        return false;
      } else {
        location.sites.map((site, index) => {
          if (site.id == site_id) {
            site_info = site;
          }
        });
      }
    });
    var state = (site_info ? site_info.state : 'CA');
    if (state == "CA" || state == 'ca') {
      dt = <Moment unix tz="America/Los_Angeles" format="YYYY-MM-DDTHH:mm:ss">
        {new Date()}
      </Moment>
    } else {
      dt = <Moment unix tz="America/Chicago" format="YYYY-MM-DDTHH:mm:ss">
        {new Date()}
      </Moment>
      
    }
  }
  
  notify(text) {
    return <Notification
      type='notice'
      text={text}
      delay={2000}
      shadow={false}
      hide={true}
      nonblock={true}
      desktop={true}
    />
  }
  
  schedule = () => {
    this.props.schedule().then(response => {
      localStorage.setItem('routes', JSON.stringify(response.routes));
      localStorage.setItem('schedules', JSON.stringify(response.schedules));
      this.hourly();
    }).catch(error => {
      //loading.hide();
      // this.setState({isError: true, message: error.response.data.error.message})
      
    });
  }
  hourly = () => {
    this.props.hourly().then(response => {
      completed_hourly_report = response.hourly;
      removedHours = response.removedHours;
      while (count < 24) {
        exists = 0;
        removedHours.map((value, index) => {
          if (count == value.hour) {
            exists = 1;
            return false;
          }
        });
       
        
        if (exists != 1) {
          hour_count = 0;
          completed_hourly_report.map((value, index) => {
            
            if (value.hour == count && value.spr && user_removed.indexOf(value.crm_account_id) == -1) {
              hour_count++;
            }
          });
          if (count > 12) {
            display_hours = count - 12 + 'pm';
            
          }
          else if (count == 12) {
            
            display_hours = 12 + 'pm';
          } else {
            
            display_hours = count + 'am';
          }
          if (hour_count >= user_count) {
            this.setState({value:'Complete'})
            
          } else {
            this.setState({value:'Incomplete'})}
  
            var item = <tr key={count}>
              <td className=""><a href="#" className="t-icon"> <img src="img/clock.png"
                                                                    width="16"/> {display_hours}</a></td>
              <td className="">
             {/*<HourSubmit value={this.state.value} hour={display_hours}*/}
                         {/*count={count} shifts={this.props.shifts}/>*/}
              </td>
              <td className=""><a href="#;" onClick={this.removeHour(count)} className="t-icon"><img
                src="img/tras.png" width="15"/></a></td>
            </tr>;
            this.setState({list: [...this.state.list, item]})
          
          //loading.hide();
        }
        if (count < dt.props.children.getHours()) {
          count++;
        } else {
          break;
        }
        
      }
    }).catch(error => {
      //loading.hide();
      //this.setState({isError: true, message: error.response.data.error.message})
      
    })
  }
  
  hourlyReport = () => {
    //  console.log('hours')
  }
  removeHour = () => {
    //   console.log('remove')
  }
  completeDay = () => {
  
  }
  
  render() {
    return (
      <div className="bottom-b">
        <div id="menu_item_hour_report">
          <a href="" onClick={(event) => this.handleShow(event)}>
            <img src="/img/warning.png" width="45" style={{float: 'right'}}/></a>
        </div>
        <div id="bottom_reports" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"
             aria-hidden="true">
          <Modal show={this.state.show} onHide={() => this.handleClose()} id="hourly_report">
            <Modal.Header closeButton style={{paddingTop: 0}}>
              <Modal.Title>Reports</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-md">
              <div className="empty-xs-30 empty-md-30"></div>
              <div className="row reports">
                <div className="col-md-12 table-responsive">
                  <table className="table table-reports  table-responsive" style={{display: 'initial!important'}}
                         id="hourlyReport">
                    <tbody>
                    {this.state.list}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="empty-xs-30 empty-xs-30"></div>
              
              <div className="row" style={{marginTop: 30 + 'px'}}>
                <div className="col-md-2"></div>
                <div className="col-md-5"><a
                  href={`http://dispatch.scoobeez.com/api/testing/eos?site_id=${site_id}&date=${date}`}
                  id="todayEOSLink" target="_blank"
                  className="btn btn-yellow2 width100">Today's
                  EOS</a></div>
                <div className="col-md-5">
                  <UPDTotals shifts={this.props.shifts}/>
                </div>
              </div>
            
            </Modal.Body>
          </Modal>
        </div>
        {this.state.isError ?
          this.notify(this.state.message) : ''}
      </div>
    )
  }
  
  
}


function mapStateToProps(state) {
  return {
    hourly_report: state.hourly_report,
    drivers2: state.drivers2,
    websiteData: state.websiteData,
    shifts: state.shifts,
    locationSites: state.locationSites,
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({hourly, schedule, settings, getLocations, getShifts}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);