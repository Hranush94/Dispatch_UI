import React, {Component} from 'react';
import {Button, OverlayTrigger, Row, Col, Label} from 'react-bootstrap';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {submitScheduleReport, pullDispachersReport, getShifts, schedule} from "../actions";

var user = JSON.parse(localStorage.getItem('customer_data'));
var arrayVehicle = [],
  arrayBC = [],
  arrayFDD = [],
  arrayRJ = [],
  arrayUTL = [],
  arrayUTA = [],
  arrayOODT = [],
  arrayNSL = [],
  arrayMISS = [],
  arrayDMG = [],
  array = [];

var today = new Date();
const startDate = ((today.getMonth() + 1).toString().length < 2 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' +
  (today.getDate().toString().length < 2 ? '0' + today.getDate() : today.getDate()) + '-' + today.getFullYear();
var site_id = localStorage.getItem('site_id')


class RTSModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      routes: []
    };
  }
  
  
  componentDidMount() {
    this.props.getShifts();
    this.props.schedule();
    this.props.pullDispachersReport();
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
  
  }
  submitRTS = (event) => {
    event.preventDefault();
  
    arrayVehicle = [],
      arrayBC = [],
      arrayFDD = [],
      arrayRJ = [],
      arrayUTL = [],
      arrayUTA = [],
      arrayOODT = [],
      arrayNSL = [],
      arrayMISS = [],
      arrayDMG = [],
    array = [...arrayVehicle, ...arrayBC, ...arrayFDD, ...arrayRJ,
      ...arrayUTL, ...arrayUTA, ...arrayOODT, ...arrayNSL,...arrayMISS,...arrayDMG, {name: 'site_id', value: site_id},
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
    
    // console.log(this.state.schedules)
    return (
      <form id="rtsReport">
        <table className="table routes-table text-center" id="rtsContent">
          <thead>
          <tr>
            <td>Driver</td>
            <td>VAN</td>
            <td>BC</td>
            <td>FDD</td>
            <td>RJ</td>
            <td>UTL</td>
            <td>UTA</td>
            <td>OODT</td>
            <td>NSL</td>
            <td>MISS</td>
            <td>DMG</td>
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
                      
                      vehicle: (r && r.vehicle) ? r.vehicle : '',
                      bc: (r && r.bc) ? r.bc : '',
                      fdd: (r && r.fdd) ? r.fdd : '',
                      rj: (r && r.rj) ? r.rj : '',
                      utl: (r && r.utl) ? r.utl : '',
                      uta: (r && r.uta) ? r.uta : '',
                      oodt: (r && r.oodt) ? r.oodt : '',
                      nsl: (r && r.nsl) ? r.nsl : '',
                      miss: (r && r.miss) ? r.miss : '',
                      dmg: (r && r.dmg) ? r.dmg : '',
                    }
                  }
                  
                })
              }
              
              const vehicle = (this.state.routes[index] && this.state.routes[index].vehicle);
              const bc = (this.state.routes[index] && this.state.routes[index].bc);
              const fdd = (this.state.routes[index] && this.state.routes[index].fdd);
              const rj = (this.state.routes[index] && this.state.routes[index].rj);
              const utl = (this.state.routes[index] && this.state.routes[index].utl);
              const uta = (this.state.routes[index] && this.state.routes[index].uta);
              const nsl = (this.state.routes[index] && this.state.routes[index].nsl);
              const oodt = (this.state.routes[index] && this.state.routes[index].oodt);
              const miss = (this.state.routes[index] && this.state.routes[index].miss);
              const dmg = (this.state.routes[index] && this.state.routes[index].dmg);
              var objVehicle = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof vehicle != 'undefined' ? vehicle : data.vehicle || ''
              }
              arrayVehicle[index] = objVehicle;
              var objBC = {
                name: 'user_' + value.crm_data.id + '[] ',
                value: typeof bc != 'undefined' ? bc : data.bc || ''
              }
              arrayBC[index] = objBC;
              var objFDD = {
                name: 'user_' + value.crm_data.id + '[] ',
                value:typeof fdd != 'undefined' ? fdd : data.fdd || ''
              }
              arrayFDD[index] = objFDD;
              var objRJ = {
                name: 'user_' + value.crm_data.id + '[] ',
                value:typeof rj != 'undefined' ? rj : data.rj || ''
              }
              arrayRJ[index] = objRJ;
              var objUTL = {
                name: 'user_' + value.crm_data.id + '[] ',
                value:typeof utl != 'undefined' ? utl : data.utl || ''
              }
              arrayRJ[index] = objUTL;
              var objUTA = {
                name: 'user_' + value.crm_data.id + '[] ',
                value:typeof uta != 'undefined' ? uta : data.uta || ''
              }
              arrayUTA[index] = objUTA;
              var objNSL = {
                name: 'user_' + value.crm_data.id + '[] ',
                value:typeof nsl != 'undefined' ? nsl : data.nsl || ''
              }
              arrayNSL[index] = objNSL;
              var objOODT = {
                name: 'user_' + value.crm_data.id + '[] ',
                value:typeof oodt != 'undefined' ? oodt : data.oodt || ''
              }
              arrayOODT[index] = objOODT;
              var objMISS = {
                name: 'user_' + value.crm_data.id + '[] ',
                value:typeof miss != 'undefined' ? miss : data.miss || ''
              }
              arrayMISS[index] = objMISS;
              var objDMG = {
                name: 'user_' + value.crm_data.id + '[] ',
                value:typeof dmg != 'undefined' ? dmg : data.dmg || ''
              }
              arrayDMG[index] = objDMG;
  
              return (<tr id={'remove_schedule_driver_' + value.crm_data.id} key={index}>
                <td><p>{value.crm_data.first_name + " " + value.crm_data.last_name} </p></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="VAN"
                           value={typeof vehicle != 'undefined' ? vehicle : data.vehicle || ''}
                           onChange={event => this.onInputChange(event, index, 'vehicle')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="BC"
                           value={typeof bc != 'undefined' ? bc : data.bc || ''}
                           onChange={event => this.onInputChange(event, index, 'route_id')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="FDD"
                           value={typeof fdd != 'undefined' ? fdd : data.fdd || ''}
                           onChange={event => this.onInputChange(event, index, 'fdd')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="RJ"
                           value={typeof rj != 'undefined' ? rj : data.rj || ''}
                           onChange={event => this.onInputChange(event, index, 'rj')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="UTL"
                           value={typeof utl != 'undefined' ? utl : data.utl || ''}
                           onChange={event => this.onInputChange(event, index, 'utl')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="UTA"
                           value={typeof uta != 'undefined' ? uta : data.uta || ''}
                           onChange={event => this.onInputChange(event, index, 'uta')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="OODT"
                           value={typeof oodt != 'undefined' ? oodt : data.oodt || ''}
                           onChange={event => this.onInputChange(event, index, 'oodt')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="NSL"
                           value={typeof nsl != 'undefined' ? nsl : data.nsl || ''}
                           onChange={event => this.onInputChange(event, index, 'nsl')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="MISS"
                           value={typeof miss != 'undefined' ? miss : data.miss || ''}
                           onChange={event => this.onInputChange(event, index, 'miss')}/></td>
                <td><input type="text" className="form-control" name={'user_' + value.crm_data.id + '[]'}
                           placeholder="DMG"
                           value={typeof dmg != 'undefined' ? dmg : data.dmg || ''}
                           onChange={event => this.onInputChange(event, index, 'dmg')}/></td>
              </tr>)
            }
          })}
          </tbody>
        </table>
        
        <Row style={{MarginTop: 30}}>
          <Col md={8}></Col>
          <Col md={4}>
            <input type="hidden" name="site_id" id="rtsSiteID"/>
            <input type="hidden" name="date" id="rtsDate"/>
            <a href=" " onClick={(event) => {
              this.submitRTS()
            }}
               className="btn btn-yellow2 width100">Submit RTS Assignment</a>
          </Col>
        </Row>
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
  return bindActionCreators({pullDispachersReport, submitScheduleReport, schedule, getShifts}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RTSModal);