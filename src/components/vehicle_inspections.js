import React from 'react';
import {Modal} from 'react-bootstrap';
import {getVehicleInspections, getShifts} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Inspection from './inspection_modal'
class VehicleInspections extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false,
    };
  }
  
  componentDidMount() {
    this.props.getShifts();
    this.props.getVehicleInspections();
  
  }
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true});
  }
 
  render() {
    return (
      <div>
        <a href="#" onClick={(event) => this.handleShow(event)}>
          <i className="scoo-icon scoo-icon-6"></i>
          <span className="lbl">Vehicle Inspections</span>
        </a>
        <Modal show={this.state.show} onHide={this.handleClose}
               id="vehicle_inspections">
          <Modal.Header closeButton>
            <h5 className="modal-title">INSPECTIONS</h5>
          </Modal.Header>
          <Modal.Body id="vehicleInspectionContent">
            {this.props.shifts.map((value, index) => {
              if (value.crm_data) {
                var user_data;
                if(this.props.vehicleInspections.length>0 ) {
                  this.props.vehicleInspections.map((item, index) => {
                    if (value.crm_data.id === item.crm_account_id) {
                    user_data=item;
                    }
                  })
                }
                if (user_data) {
                  return (<div className="row" key={index}>
                      <div className="col-md-8">
                        <div className="row route-driver">
                          <div className="col-md-10">
                            <p>{value.crm_data.first_name + " " + value.crm_data.last_name}</p></div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <Inspection inspectionID={user_data.id}/>
                      </div>
                      <div className="empty-xs-40 empty-md-10"></div>
  
                    </div>
                  )
                } else {
                  return (<div className="row" key={index}>
                    <div className="col-md-8">
                      <div className="row route-driver">
                        <div className="col-md-10">
                          <p>{value.crm_data.first_name + " " + value.crm_data.last_name}</p></div>
                      </div>
                    </div>
                    <div className="col-md-4"><a href="#"
                                                 className="btn btn-report">No Inspections</a></div>
                    <div className="empty-xs-40 empty-md-10"></div>

                  </div>)
                }
              }
              
            })}
          
          </Modal.Body>
        </Modal>
      
      </div>
    
    );
  }
}

function mapStateToProps(state) {
  return {
    vehicleInspections: state.vehicleInspections,
    shifts: state.shifts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getVehicleInspections, getShifts}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VehicleInspections);
