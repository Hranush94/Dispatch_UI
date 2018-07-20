import React from 'react';
import {appendReactDOM} from 'append-react-dom';
import {Row, Col} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import {connect} from "react-redux";
import {submitDispachersReport,pullDispachersReport} from '../actions/index'
import {bindActionCreators} from "redux";
import {Notification} from 'react-pnotify';

var content = [];

class DispatcherReports extends React.Component {
  
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false,
      value: 1,
      content: [],
      dispatcherReportID: '',
      routesConfirmed: '',
      routesAssigned: '',
      quickCoverages: '',
      dspLateCancelations: '',
      amzlLateCancelations: '',
      vehicleCount: '',
      showNotification: false,
      waves: [],
      message:''
    };
  }
  componentDidMount(){
    this.props.pullDispachersReport().then(response=>{
      if (response.wave2){
        this.addWave();
      }
    }).catch(error=>{
      this.setState({message: error.response.data.error.message,showNotification:true})
  
    })
    
    }
  
  handleClose=()=> {
    this.setState({show: false});
  }
  
  handleShow=(event)=> {
    event.preventDefault();
    this.setState({show: true});
  }
  
  submitDispachersReport = () => {
    const customerId = (JSON.parse(localStorage.getItem("customer_data"))).id;
    const dispatcherData = new FormData();
    dispatcherData.append("type", 'dispatcher_report');
    dispatcherData.append("user_id", customerId);
    dispatcherData.append("site_id", localStorage.getItem('site_id'));
    dispatcherData.append("id", this.state.dispatcherReportID);
    dispatcherData.append("routes_confirmed", this.state.routesConfirmed);
    dispatcherData.append("routes_assigned", this.state.routesAssigned);
    dispatcherData.append("quick_coverages", this.state.quickCoverages);
    dispatcherData.append("dsp_late_cancelations", this.state.dspLateCancelations);
    dispatcherData.append("amzl_late_cancelations", this.state.amzlLateCancelations);
    dispatcherData.append("vehicle_count", this.state.vehicleCount);
    if (this.state.waves) {
      for (var i = 1; i <= Object.keys(this.state.waves).length; i++) {
        dispatcherData.append("wave" + i, (this.state.waves[i] && this.state.waves[i].wave) || '');
        dispatcherData.append("wave" + i + "_actual_start", (this.state.waves[i] && this.state.waves[i].waveActualStart) || '');
        dispatcherData.append("wave" + i + "_actual_end", (this.state.waves[i] && this.state.waves[i].waveActualEnd) || '');
      }
    }
    
    this.props.submitDispachersReport(dispatcherData).then(response => {
      this.setState({showNotification: true,message:'Updated'})
      this.handleClose();
    }).catch(error => {
      this.setState({message: error.response.data.error.message,showNotification:true})
      this.handleClose();
  
    })
    
    
  }
  onInputRoutesConfirmedChange = (event) => {
    this.setState({routesConfirmed: event.target.value, showNotification: false})
  }
  onInputRoutesAssignedChange = (event) => {
    this.setState({routesAssigned: event.target.value, showNotification: false})
  }
  onInputquickCoveragesChange = (event) => {
    this.setState({quickCoverages: event.target.value, showNotification: false})
  }
  onInputdspLateCancelationsChange = (event) => {
    this.setState({dspLateCancelations: event.target.value, showNotification: false})
  }
  onInputamzlLateCancelationsChange = (event) => {
    this.setState({amzlLateCancelations: event.target.value, showNotification: false})
  }
  onInputvehicleCountChange = (event) => {
    this.setState({vehicleCount: event.target.value, showNotification: false})
  }
  onInputChange = (event, id, keyName) => {
    let wave = this.state.waves[id] || {};
    wave[keyName] = event.target.value;
    this.setState({
      waves: {
        ...this.state.waves,
        [id]: wave
      }
    })
  }
  addWave() {
    let newCount = this.state.value + 1;
    this.setState({value: newCount});
    const wave=(this.state.waves[newCount] && this.state.waves[newCount].wave);
    const start=this.state.waves[newCount] && this.state.waves[newCount].waveActualStart;
    const end=this.state.waves[newCount] &&  this.state.waves[newCount].waveActualEnd;
    const s3='wave'+ newCount+'_actual_end';
    const s2='wave'+newCount+'_actual_start';
    const s1='wave'+ newCount;
    var waveContent =
      <div key={newCount}>
        <div className="form-group row d-flex align-items-center">
          <label className="col-sm-4 form-control-label">{'Wave ' + newCount + ' Scheduled Start'}</label>
          <div className="col-sm-8"><p className="form-control-static">
            <input type="text" className="form-control" id={'wave' + newCount}
                   onChange={(event) => this.onInputChange(event, newCount, 'wave')}
                   value={(typeof wave !='undefined'?wave :this.props.dispatcher_reports.s1) ||''}
            /></p>
          </div>
        </div>
        <div className="empty-xs-40 empty-md-0"></div>
        <div className="form-group row d-flex align-items-center">
          <label className="col-sm-4 form-control-label">{'Wave ' + newCount + ' Actual Start'}</label>
          <div className="col-sm-8"><p className="form-control-static">
            <input type="text" className="form-control" id={'wave' + newCount + '_actual_start'}
                   onChange={(event) => this.onInputChange(event, newCount, 'waveActualStart')}
                   value={typeof start !='undefined'?start :this.props.dispatcher_reports.s2 ||''}
            /></p>
          </div>
        </div>
        <div className="empty-xs-40 empty-md-0"></div>
        <div className="form-group  row d-flex align-items-center">
          <label className="col-sm-4 form-control-label">{'Wave ' + newCount + ' Actual End'}</label>
          <div className="col-sm-8"><p className="form-control-static">
            <input type="text" className="form-control" id={'wave' + newCount + '_actual_end'}
                   onChange={(event) => this.onInputChange(event, newCount, 'waveActualEnd')}
                   value={typeof end !='undefined' ? end :this.props.dispatcher_reports.s3 ||''}
            /></p>
          </div>
        </div>
        <div className="empty-xs-40 empty-md-0"></div>
      </div>
    content.push(waveContent);
    this.setState({content: content});
  }
  
  render() {
    return (
      <div>
        <a href='#' className="clicked" onClick={(event) => {
          this.handleShow(event)
        }}>
          <i className="scoo-icon scoo-icon-2"></i>
          <span className="lbl">Dispatcher Reports</span></a>
        <Modal id="dispatcher_report" show={this.state.show} onHide={this.handleClose} >
          <Modal.Header closeButton>
            <Modal.Title>Dispatcher Reports</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="empty-xs-30 empty-md-30"></div>
            
            <Row>
              <Col md={12}>
                <form className="hori-form">
                  
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      Routes Confirmed
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static">
                        <input type="text" className="form-control"
                               id="routes_confirmed" onChange={(event) => this.onInputRoutesConfirmedChange(event)}
                               value={this.state.routesConfirmed || this.props.dispatcher_reports.routes_confirmed}
                        /></p>
                    </Col>
                  
                  </Row>
                  
                  <div className="empty-xs-40 empty-md-0"></div>
                  
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      Routes Assigned
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static"><input type="text" className="form-control"
                                                                id="routes_assigned"
                                                                onChange={(event) => this.onInputRoutesAssignedChange(event)}
                                                                value={this.state.routesAssigned || this.props.dispatcher_reports.routes_assigned}
                      /></p>
                    </Col>
                  
                  </Row>
                  <div className="empty-xs-40 empty-md-0"></div>
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      Quick Coverage
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static"><input type="text" className="form-control"
                                                                id="quick_coverages"
                                                                onChange={(event) => this.onInputquickCoveragesChange(event)}
                                                                value={this.state.quickCoverages || this.props.dispatcher_reports.quick_coverages}
                      /></p>
                    </Col>
                  
                  </Row>
                  <div className="empty-xs-40 empty-md-0"></div>
                  
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      DSP Late Cancellation
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static"><input type="text" className="form-control"
                                                                id="dsp_late_cancelations"
                                                                onChange={(event) => this.onInputdspLateCancelationsChange(event)}
                                                                value={this.state.dspLateCancelations || this.props.dispatcher_reports.dsp_late_cancelations }
                      /></p>
                    </Col>
                  
                  </Row>
                  <div className="empty-xs-40 empty-md-0"></div>
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      AMZL Late Cancelation
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static"><input type="text" className="form-control"
                                                                id="amzl_late_cancelations"
                                                                onChange={(event) => this.onInputamzlLateCancelationsChange(event)}
                                                                value={this.state.amzlLateCancelations || this.props.dispatcher_reports.amzl_late_cancelations}
                      /></p>
                    </Col>
                  
                  </Row>
                  <div className="empty-xs-40 empty-md-0"></div>
                  
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      Vehicle Count
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static"><input type="text" className="form-control"
                                                                id="vehicle_count"
                                                                onChange={(event) => this.onInputvehicleCountChange(event)}
                                                                value={this.state.vehicleCount || this.props.dispatcher_reports.vehicle_count }
                      /></p>
                    </Col>
                  
                  </Row>
                  <div className="empty-xs-40 empty-md-0"></div>
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      Wave 1 Scheduled Start
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static"><input type="text" className="form-control"
                                                                id="wave1"
                                                                onChange={(event) => this.onInputChange(event, 1, 'wave')}
                                                                value={(this.state.waves[1] && this.state.waves[1].wave) || this.props.dispatcher_reports.wave1}
                      /></p>
                    </Col>
                  
                  </Row>
                  <div className="empty-xs-40 empty-md-0"></div>
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      Wave 1 Actual Start
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static"><input type="text" className="form-control"
                                                                id="wave1_actual_start"
                                                                onChange={(event) => this.onInputChange(event, 1, 'waveActualStart')}
                                                                value={(this.state.waves[1] && this.state.waves[1].waveActualStart) || this.props.dispatcher_reports.wave1_actual_start}
                      /></p>
                    </Col>
                  
                  </Row>
                  <div className="empty-xs-40 empty-md-0"></div>
                  
                  <Row className="form-group  d-flex align-items-center">
                    <label
                      className="col-sm-4 form-control-label">
                      Wave 1 Actual End
                    </label>
                    <Col sm={8}>
                      <p className="form-control-static"><input type="text" className="form-control"
                                                                id="wave1_actual_end"
                                                                onChange={(event) => this.onInputChange(event, 1, 'waveActualEnd')}
                                                                value={(this.state.waves[1] && this.state.waves[1].waveActualEnd) || this.props.dispatcher_reports.wave1_actual_end}
                      /></p>
                    </Col>
                  
                  </Row>
                  <div className="empty-xs-40 empty-md-0"></div>
                  <input type="hidden" id="waveCount" value={this.state.value}/>
                  
                  <div id="insertWave">
                    {this.state.content}
                  </div>
                  
                  <Row className="form-group  d-flex align-items-center">
                    <Col sm={8}></Col>
                    <Col sm={4} className="text-right">
                      <a href="#" className="black" onClick={() => this.addWave()}>Add Wave <img src="img/ic_add.png"
                                                                                                 width="40"/></a>
                    </Col>
                  </Row>
                  
                  <div className="empty-xs-40 empty-md-20"></div>
                  <Row className="form-group ">
                    <Col sm={8}/>
                    <Col sm={4} className="text-right">
                      <input type="hidden" id="dispatcherReportID" value={this.state.id}/>
                      
                      <a href="#" className="btn btn-yellow2 width100" onClick={(event) => {
                        this.submitDispachersReport(event);
                       
                      }}>Submit</a>
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
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
    dispatcher_reports: state.dispatcher_reports,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({submitDispachersReport,pullDispachersReport}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DispatcherReports);

