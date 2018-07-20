import React from 'react';
import {Modal} from 'react-bootstrap';
import {updTotals, submitDay} from "../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";


var drivers = []
var time_lost = 0;

class UPDTotals extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false,
      date: new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear(),
      
    };
    this.props.shifts.map((shift, index) => {
      if (shift.crm_data) {
        drivers.push(shift);
        
      }
    })
  }
  
  componentDidMount() {
    this.props.updTotals()
  }
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true});
  }
  submitDay = (event) => {
    event.preventDefault()
    var html = document.getElementById('send_comment_content');
    this.props.submitDay(html).then(response => {
      this.setState({message: "Sent", showNotification: true})
      this.handleClose()
    }).catch(error => {
      this.setState({message: error.response.data.error.message, showNotification: true})
      this.handleClose()
    })
    
  }
  
  render() {
    return (
      <div>
        <a href="#"
           onClick={(event) => this.handleShow(event)}
           className="btn btn-yellow2 width100">UPD Totals</a>
        <Modal show={this.state.show} onHide={this.handleClose}
               id="complete_day">
          <Modal.Header closeButton>
            <Modal.Title>UPD Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row" style={{marginTop: 15 + 'px'}}>
              <div className="col-md-12" id="send_comment_content">
                <h3 style={{Color: '#000', fontSize: 20 + 'px', marginTop: 0, marginBottom: 15 + 'px'}}>UPD</h3>
                <p>Team, </p>
                <p>Dispatch: Use the following summary to input UPD in the Amazon UPD submission Portal. </p>
                <p>Total combined time requested: <span id="combined_time_report">{time_lost + ' min'}
                
                </span></p>
                <table style={{marginBottom: 30 + 'px', width: 90 + '%', margin: 20 + 'px auto'}}>
                  <tbody id="end_of_day_summary">
                  <tr>
                    <td><span style={{fontWeight: 'bold'}}>Route ID</span></td>
                    <td>
                      <span style={{fontWeight: 'bold'}}>Driver</span></td>
                    <td><span style={{Color: '#000', fontWeight: 'bold'}}>
                    Time Lost</span></td>
                    <td><span style={{Color: '#000', fontWeight: 'bold'}}>Reason</span></td>
                    <td style={{Width: 40 + '%'}}><span style={{Color: '#000', fontWeight: 'bold'}}>Description</span>
                    </td>
                  </tr>
                  {
                    this.props.comment_obj.map((route, index) => {
                      drivers.map((user, index) => {
                        if (route.crm_account_id == user.id) {
                          if (route.comments) {
                            
                            var count = 0;
                            var LateDeparture = 0;
                            var LateDeparturec = '';
                            var LateSortation = 0;
                            var LateSortationc = '';
                            var LateLineHaul = 0;
                            var LateLineHaulc = '';
                            var SafetyRelatedDelay = 0;
                            var SafetyRelatedDelayc = '';
                            var DeliveryAddressNotOnRoute = 0;
                            var DeliveryAddressNotOnRoutec = '';
                            var CustomerReattempts = 0;
                            var CustomerReattemptsc = '';
                            var StationDebrief = 0;
                            var StationDebriefc = '';
                            var DeviceIssues = 0;
                            var DeviceIssuesc = '';
                            
                            var total_comment_time_lost = 0;
                            
                            route.comments.map((index, comment) => {
                              if (comment.reason == "amazon" || comment.reason == "Amazon") {
                                if (comment.explanation == 'Late Departure') {
                                  LateDeparture += parseInt(comment.time_lost);
                                  LateDeparturec += comment.amzl_cancelation + ', ';
                                  time_lost += parseInt(comment.time_lost);
                                  total_comment_time_lost += parseInt(comment.time_lost);
                                }
                                if (comment.explanation == 'Late Sortation') {
                                  LateSortation += parseInt(comment.time_lost);
                                  LateSortationc += comment.amzl_cancelation + ', ';
                                  time_lost += parseInt(comment.time_lost);
                                  total_comment_time_lost += parseInt(comment.time_lost);
                                }
                                if (comment.explanation == 'Late Line Haul') {
                                  LateLineHaul += parseInt(comment.time_lost);
                                  LateLineHaulc += comment.amzl_cancelation + ', ';
                                  time_lost += parseInt(comment.time_lost);
                                  total_comment_time_lost += parseInt(comment.time_lost);
                                }
                                if (comment.explanation == 'Safety Related Delay') {
                                  SafetyRelatedDelay += parseInt(comment.time_lost);
                                  SafetyRelatedDelayc += comment.amzl_cancelation + ', ';
                                  time_lost += parseInt(comment.time_lost);
                                  total_comment_time_lost += parseInt(comment.time_lost);
                                }
                                if (comment.explanation == 'Delivery Address Not On Route') {
                                  DeliveryAddressNotOnRoute += parseInt(comment.time_lost);
                                  DeliveryAddressNotOnRoutec += comment.amzl_cancelation + ', ';
                                  time_lost += parseInt(comment.time_lost);
                                  total_comment_time_lost += parseInt(comment.time_lost);
                                }
                                if (comment.explanation == 'Customer Reattempts') {
                                  CustomerReattempts += parseInt(comment.time_lost);
                                  CustomerReattemptsc += comment.amzl_cancelation + ', ';
                                  time_lost += parseInt(comment.time_lost);
                                  total_comment_time_lost += parseInt(comment.time_lost);
                                }
                                if (comment.explanation == 'Station Debrief') {
                                  StationDebrief += parseInt(comment.time_lost);
                                  StationDebriefc += comment.amzl_cancelation + ', ';
                                  time_lost += parseInt(comment.time_lost);
                                  total_comment_time_lost += parseInt(comment.time_lost);
                                }
                                if (comment.explanation == 'Device Issues') {
                                  DeviceIssues += parseInt(comment.time_lost);
                                  DeviceIssuesc += comment.amzl_cancelation + ', ';
                                  time_lost += parseInt(comment.time_lost);
                                  total_comment_time_lost += parseInt(comment.time_lost);
                                }
                              }
                            });
                            if (LateDeparture > 0) {
                              if (count == 0) {
                                var route_id = route.route_id;
                                var driversName = user.first_name + ' ' + user.last_name
                              } else {
                                var route_id = '';
                                var driversName = '';
                              }
                              return (<tr>
                                <td><span style={{Color: '#000'}}>{route_id} </span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{driversName}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{LateDeparture + ' min'} </span></td>
                                <td>
                                  <span style={{Color: '#000'}}>Late Departure</span></td>
                                <td style={{width: 40 + '%'}}>
                                  <span style={{Color: '#000'}}>{LateDeparturec}</span></td>
                              </tr>)
                              count++;
                            }
                            if (LateSortation > 0) {
                              if (count == 0) {
                                var route_id = route.route_id;
                                var driversName = user.first_name + ' ' + user.last_name
                              } else {
                                var route_id = '';
                                var driversName = '';
                              }
                              return (<tr>
                                <td><span
                                  style={{Color: '#000'}}>{route_id}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{driversName}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{LateSortation + ' min'}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>Late Sortation</span></td>
                                <td style={{width: 40 + '%'}}>
                                  <span style={{Color: '#000'}}>{LateSortationc}</span></td>
                              </tr>)
                              
                              count++;
                            }
                            if (LateLineHaul > 0) {
                              if (count == 0) {
                                var route_id = route.route_id;
                                var driversName = user.first_name + ' ' + user.last_name
                              } else {
                                var route_id = '';
                                var driversName = '';
                              }
                              return (<tr>
                                <td><span style={{Color: '#000'}}>{route_id}</span></td>
                                <td><span style={{Color: '#000'}}>{driversName}</span></td>
                                <td><span style={{Color: '#000'}}>{LateLineHaul + ' min'}</span></td>
                                <td><span style={{Color: '#000'}}>Late Line Haul</span></td>
                                <td style={{width: 40 + '%'}}>
                                  <span style={{Color: '#000'}}>{LateLineHaulc}</span></td>
                              </tr>)
                              count++;
                            }
                            if (SafetyRelatedDelay > 0) {
                              if (count == 0) {
                                var route_id = route.route_id;
                                var driversName = user.first_name + ' ' + user.last_name
                              } else {
                                var route_id = '';
                                var driversName = '';
                              }
                              return (
                                <tr>
                                  <td><span style={{Color: '#000'}}>{route_id}</span></td>
                                  <td><span style={{Color: '#000'}}>{driversName}</span></td>
                                  <td><span style={{Color: '#000'}}>{SafetyRelatedDelay + ' min'}</span></td>
                                  <td><span style={{Color: '#000'}}>Safety Related Delay</span></td>
                                  <td style={{width: 40 + '%'}}><span
                                    style={{Color: '#000'}}>{SafetyRelatedDelayc}</span>
                                  </td>
                                </tr>
                              )
                              count++;
                            }
                            if (DeliveryAddressNotOnRoute > 0) {
                              if (count == 0) {
                                var route_id = route.route_id;
                                var driversName = user.first_name + ' ' + user.last_name
                              } else {
                                var route_id = '';
                                var driversName = '';
                              }
                              return (<tr>
                                <td><span style={{Color: '#000'}}>{route_id}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{driversName}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{DeliveryAddressNotOnRoute + ' min'}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>Delivery Address Not On Route</span></td>
                                <td style={{width: 40 + '%'}}>
                                  <span style={{Color: '#000'}}>{DeliveryAddressNotOnRoutec}</span></td>
                              </tr>)
                              count++;
                            }
                            if (CustomerReattempts > 0) {
                              if (count == 0) {
                                var route_id = route.route_id;
                                var driversName = user.first_name + ' ' + user.last_name
                              } else {
                                var route_id = '';
                                var driversName = '';
                              }
                              return (<tr>
                                <td><span style={{Color: '#000'}}>{route_id}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{driversName}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{CustomerReattempts + ' min'}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>Customer Reattempts</span></td>
                                <td style={{width: 40 + '%'}}>
                                  <span style={{Color: '#000'}}>{CustomerReattemptsc}</span></td>
                              </tr>)
                              count++;
                            }
                            if (StationDebrief > 0) {
                              if (count == 0) {
                                var route_id = route.route_id;
                                var driversName = user.first_name + ' ' + user.last_name
                              } else {
                                var route_id = '';
                                var driversName = '';
                              }
                              return (<tr>
                                <td><span style={{Color: '#000'}}>{route_id}</span></td>
                                <td><span style={{Color: '#000'}}>{driversName}</span></td>
                                <td><span style={{Color: '#000'}}>{StationDebrief + ' min'}</span></td>
                                <td><span style={{Color: '#000'}}>Station Debrief</span></td>
                                <td style={{width: 40 + '%'}}><span style={{Color: '#000'}}>{StationDebriefc}</span>
                                </td>
                              </tr>)
                              count++;
                            }
                            if (DeviceIssues > 0) {
                              if (count == 0) {
                                var route_id = route.route_id;
                                var driversName = user.first_name + ' ' + user.last_name
                              } else {
                                var route_id = '';
                                var driversName = '';
                              }
                              return (<tr>
                                <td>
                                  <span style={{Color: '#000'}}>{route_id}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{driversName}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>{DeviceIssues + ' min'}</span></td>
                                <td>
                                  <span style={{Color: '#000'}}>Device Issues</span></td>
                                <td style={{width: 40 + '%'}}>
                                  <span style={{Color: '#000'}}>{DeviceIssuesc}</span></td>
                              </tr>)
                              count++;
                            }
                            
                            if (total_comment_time_lost > 0 &&
                              (LateDeparture > 0 || LateSortation > 0 || LateLineHaul > 0 || SafetyRelatedDelay > 0
                                || DeliveryAddressNotOnRoute > 0 || CustomerReattempts > 0 ||
                                StationDebrief > 0 || DeviceIssues > 0)) {
                              return (<tr>
                                  <td><span style={{Color: '#000'}}>TOTAL:</span></td>
                                  <td></td>
                                  <td><span style={{Color: '#000'}}>{total_comment_time_lost + ' min'}</span></td>
                                  <td></td>
                                </tr>
                                // <tr style={{height: 30 + 'px'}}>
                                //   <td></td>
                                //   <td></td>
                                //   <td></td>
                                //   <td>
                                //     <td></td>
                                // </tr>
                              )
                            }
                          }
                          return false;
                        }
                      })
                    })
                    
                    
                  }
                  
                  </tbody>
                </table>
                
                <br/><br/>
              </div>
            </div>
            <a href="#"
               onClick={(event) => this.submitDay(event)}
               className="btn btn-yellow2 " style={{width: 40 + '%'}}>Complete Day</a>
          </Modal.Body>
        </Modal>
      
      </div>
    
    );
  }
}

function mapStateToProps(state) {
  return {
    comment_obj: state.comment,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({updTotals, submitDay}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UPDTotals);
