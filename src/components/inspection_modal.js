import React from 'react';
import {Modal} from 'react-bootstrap';
import {getShifts, inspectionView, submitInspection} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Notification from 'react-pnotify'

var site_id = localStorage.getItem('site_id');

class Inspection extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false,
      props:{},
      showNotification: false,
      message: '',
      
    };
  }
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true});
    this.props.inspectionView(this.props.inspectionID)
    
  }
  onInputChange = (event, name) => {
    this.setState({props: {...this.state.props,[name]:event.target.value}});
  }
  
  submitInspection = () => {
    var data = new FormData();
    data.set('mileage', this.state.props.mileage);
    data.set('notes', this.state.props.notes);
    data.set('id', this.props.inspectionID);
    data.set('fpd', this.state.props.fpd);
    data.set('lpd', this.state.props.lpd);
    data.set('lpa', this.state.props.lpa);
    data.set('bc', this.state.props.bc);
    data.set('fdd', this.state.props.fdd);
    data.set('rj', this.state.props.rj);
    data.set('utl', this.state.props.utl);
    data.set('uta', this.state.props.uta);
    data.set('oodt', this.state.props.oodt);
    data.set('nsl', this.state.props.nsl);
    data.set('miss', this.state.props.miss);
    data.set('dmg', this.state.props.dmg);
    
    this.props.submitInspection(data).then(response => {
      this.setState({message: 'Updated Inspection', showNotification: true})
      this.handleClose();
  
    }).catch(error=>{
      this.setState({message: error.response.data.error.message,showNotification:true})
      this.handleClose()
  
    })
  }
  
  render() {
    var route_report = typeof this.props.inspection.route_report !== 'undefined' ? this.props.inspection.route_report : '';
    var user_info = typeof this.props.inspection.driver !== 'undefined' ? this.props.inspection.driver : '';
    
    
    if (this.props.inspection.tank == 0) {
      var tank = "Empty";
    } else if (this.props.inspection.tank == 1) {
      var tank = "Full";
    } else {
      var tank = this.props.inspection.tank;
    }
    
    return (
      <div>
        <a href="#"
           onClick={(event) => this.handleShow(event)}
           className="btn btn-report">View Inspections</a>
        <Modal show={this.state.show} onHide={this.handleClose}
               id="inspections_view">
          <Modal.Header closeButton>
            <h5 className="modal-title">INSPECTION</h5>
          </Modal.Header>
          <Modal.Body id="inspection_content">
            <div className="row table-responsive" style={{overflowX: "inherit !important"}}>
              <div className="col-md-6 ">
                <div className="row" style={{border: 1 + "px solid #e9ecef", borderBottom: "none"}}>
                  <div className="col-md-8"><h1 className="text-center yellow">Scoobeez</h1></div>
                  <div className="col-md-4 text-center"><img src="img/logo.jpg" width="60" alt=""/></div>
                  
                  <div className="row car-info">
                    <table className="table table-bordered" style={{marginBottom: 0}}>
                      <tbody>
                      <tr>
                        <td colSpan="1" className="bold" style={{borderRight: "none"}}>DA\'S NNAME</td>
                        <td colSpan="3" className="bold"
                            style={{borderLeft: "none"}}>{this.props.inspection.driver && this.props.inspection.driver.first_name + ' ' + this.props.inspection.driver.last_name}</td>
                      </tr>
                      <tr>
                        <td colSpan="1" className="bold" style={{borderRight: "none"}}>License Plate #</td>
                        <td colSpan="3" className="bold"
                            style={{borderRight: "none"}}>{this.props.inspection.license} </td>
                      </tr>
                      <tr>
                        <td colSpan="1" className="text-center bold">Beginning Fuel Tank</td>
                        <td colSpan="3" className="text-center bold"> {tank}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" rowSpan="" headers=""
                            className="text-center font-13 bold"> {"Please note Yes/No All of the Following"}</td>
                      </tr>
                      <tr>
                        <td colSpan="" rowSpan="" headers=""></td>
                        <td colSpan="" rowSpan="" headers="" className="text-center font-13 bold">YES</td>
                        <td colSpan="" rowSpan="" headers="" className="text-center font-13 bold">NO</td>
                      </tr>
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15">DA\'s Side Body Dents</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.driver_side_body_dents == 1 ? 'YES' : ''}</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.driver_side_body_dents == 0 ? 'NO' : ''}</td>
                      </tr>
                      
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15">DA\'s Side Mirror Damage</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{(this.props.inspection.driver_side_mirror_damage == 1 ? 'YES' : '')}</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{(this.props.inspection.driver_side_mirror_damage == 0 ? 'NO' : '')}</td>
                      </tr>
                      
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15">Rear End Body Dents</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.rear_end_body_dents == 1 ? 'YES' : ''}</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.rear_end_body_dents == 0 ? 'NO' : ''}</td>
                      </tr>
                      
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15">Pass Side Body Dents</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.pass_side_body_dents == 1 ? 'YES' : ''}</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.pass_side_body_dents == 0 ? 'NO' : ''}</td>
                      </tr>
                      
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15">Pass Side Mirror Dents</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.pass_side_mirror_damage == 1 ? 'YES' : ''}</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.pass_side_mirror_damage == 0 ? 'NO' : ''}</td>
                      </tr>
                      
                      
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15">Front Dents</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.frontend_dents == 1 ? 'YES' : ''}</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.frontend_dents == 0 ? 'NO' : ''}</td>
                      </tr>
                      
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15">Proper Tire Pressure</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.tire_pressure == 1 ?
                          'YES' : ''}
                        </td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.tire_pressure == 0 ?
                          'NO' : ''}
                        </td>
                      </tr>
                      
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15">Clean Outside</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.clean == 1 ? 'YES' : ''} </td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.clean == 0 ? 'NO' : ''}  </td>
                      </tr>
                      </tbody>
                    </table>
                    
                    <table className="table table-bordered tablenoborder">
                      <tbody>
                      <tr>
                        <td colSpan="3" rowSpan="" headers="" className="text-center bold" style={{borderTop: "none"}}>
                          TC55 Yes No Questions
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15 red">Is there a cradle and a charger?
                        </td>
                        <td colSpan="" rowSpan="" headers="" className="text-center font-13"
                            style={{width: 15 + "%"}}>{this.props.inspection.cradle_charger == 1 ? 'YES' : 'NO'} </td>
                        <td colSpan="1" rowSpan="4" headers="" className="text-center"><img
                          src="http://23.250.125.234/~juantest/Scoobeez/img/phone.jpg" width="50%" className="imgmobile"
                          alt=""/></td>
                      </tr>
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15 red">Are there any damages to the
                          screen?
                        </td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.screen_damage == 1 ? 'YES' : 'NO'}</td>
                      </tr>
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15 red">Any damages to the shell?</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.shell_damage == 1 ? 'YES' : 'NO'}</td>
                      </tr>
                      <tr>
                        <td colSpan="" rowSpan="" headers="" className="font-15 red">Is the scanner working?</td>
                        <td colSpan="" rowSpan="" headers=""
                            className="text-center font-13">{this.props.inspection.scanner == 1 ? 'YES' : 'NO'}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              
              </div>
              <div className="col-md-6" style={{border: "1px solid #e9ecef", borderLeft: "none"}}>
                <div className="row">
                  <div className="col-md-12">
                    <h1 className="rabbit left">Rabbit #: {this.props.inspection.rabbit_number}</h1>
                    <h1 className="rabbit left">Route #: {this.props.inspection.route_number}</h1>
                  </div>
                </div>
                
                <div className="row">
                  <div className="row">
                    <div className="col-md-12">
                      <p className="titlemargin" style={{textAlign: "center"}}><strong>Smoking Is Prohibited Inside the
                        Vehicle</strong></p>
                    </div>
                    <div className="col-md-12 text-center">
                      <img src={"data:image/png;base64," + this.props.inspection.picture !== 'undefined'
                        ? this.props.inspection.picture : ''} width="70%" alt=""/>
                    </div>
                  </div>
                </div>
              </div>
            
            </div>
            <table className="table">
              <tbody>
                <tr>
                  
                  <td style={{textAlign: "center"}}><span>FPD</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control" id="inspection_fpd"
                             value={this.state.props.fpd || route_report.fpd || ''}
                             onChange={e => this.onInputChange(e, 'fpd')}
                             name={"user_" + user_info.id + "[]"}
                             style={{background: "#f5f6f7", color: "#adaeae"}}/></div>
                  </td>
                  <td style={{textAlign: "center"}}><span>LPD</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_lpd"
                             value={this.state.props.lpd || route_report.lpd || ''}
                             onChange={e => this.onInputChange(e, 'lpd')}
                             name={"user_" + user_info.id + "[]"}
                             style={{background: "#f5f6f7", color: "#adaeae"}}/></div>
                  </td>
                  <td style={{textAlign: "center"}}><span>LPA</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_lpa"
                             value={this.state.props.lpa || route_report.lpa || ''}
                             onChange={e => this.onInputChange(e, 'lpa')}
                             name={"user_" + user_info.id + "[]"}
                             style={{background: "#f5f6f7", color: "#adaeae"}}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>BC</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_bc"
                             value={this.state.props.bc || route_report.bc || ''}
                             onChange={e => this.onInputChange(e, 'bc')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>FDD</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_fdd"
                             value={this.state.props.fdd || route_report.fdd || ''}
                             onChange={e => this.onInputChange(e, 'fdd')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>RJ</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_rj"
                             value={this.state.props.rj || route_report.rj || ''}
                             onChange={e => this.onInputChange(e, 'rj')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>UTL</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_utl"
                             value={ this.state.props.utl || route_report.utl || ''}
                             onChange={e => this.onInputChange(e, 'utl')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>UTA</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_uta"
                             value={this.state.props.uta || route_report.uta || ''}
                             onChange={e => this.onInputChange(e, 'uta')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>OODT</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_oodt"
                             value={this.state.props.oodt  || route_report.oodt || ''}
                             onChange={e => this.onInputChange(e, 'oodt')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>NSL</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_nsl"
                             value={ this.state.props.nsl || route_report.nsl || ''}
                             onChange={e => this.onInputChange(e, 'nsl')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>MISS</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_miss"
                             value={ this.state.props.miss || route_report.miss || ''}
                             onChange={e => this.onInputChange(e, 'miss')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                  <td style={{textAlign: "center"}}><span>DMG</span> <br/>
                    <div className="form-group" style={{marginBottom: 0}}>
                      <input type="text" className="form-control"
                             id="inspection_dmg"
                             value={this.state.props.dmg || route_report.dmg || ''}
                             onChange={e => this.onInputChange(e, 'dmg')}
                             name={"user_" + user_info.id + "[]"}
                             style={{
                               background: "#f5f6f7",
                               color: "#adaeae"
                             }}/>
                    </div>
                  </td>
                </tr>
             
              </tbody>
            </table>
            <div className="empty-xs-30 empty-md-30"></div>
            
            <form id="inspectionForm">
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Ending Milage</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <input id="inspection_milage" className="form-control" type="text"
                           value={this.state.props.mileage || this.props.inspection.mileage || ''}
                           onChange={(e) => {
                             this.onInputChange(e, 'mileage')
                           }}
                    
                    />
                  </p>
                </div>
              </div>
              <div className="empty-xs-40 empty-md-0"></div>
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-4 form-control-label">Notes</label>
                <div className="col-sm-8">
                  <p className="form-control-static">
                    <textarea id="inspection_notes" className="form-control"
                              value={this.state.props.notes || this.props.inspection.notes || ''}
                              onChange={(e) => {
                                this.onInputChange(e, 'notes')
                              }}
                              rows="6"></textarea></p>
                </div>
              </div>
              <div className="form-group row d-flex align-items-center">
                <div className="col-sm-8"></div>
                <div className="col-sm-4">
                  <input id="inspection_id" type="hidden" value={this.props.inspectionID}/>
                  <a href="#"
                     onClick={() => this.submitInspection()}
                     className="btn btn-yellow2 width100">Submit</a>
                </div>
              </div>
            
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
    vehicleInspections: state.vehicleInspections,
    shifts: state.shifts,
    inspection: state.inspection,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getShifts, inspectionView, submitInspection}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspection);
