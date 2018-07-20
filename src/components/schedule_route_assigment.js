import React from 'react';
import { Row, Col} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import ScheduleModal from './schedule_modal';
import RouteAssignmentModal from './route_assignment_modal';
import RTSModal from './rts_modal';
class ScheduleRouteAssigment extends React.Component {
  constructor(props, context) {
    super(props, context);
    
 
    this.state = {
      show: false
    };
  }
  
  handleClose=()=> {
    this.setState({show: false});
  }
  
  handleShow=(e)=> {
    e.preventDefault();
    this.setState({show: true});
  }
  
  render() {
    return (
      <div>
        <a  href="" className="clicked" onClick={(e)=>this.handleShow(e)}>
          <i className="scoo-icon scoo-icon-3"></i>
          <span className="lbl">Schedule / Route Assigment</span>
        </a>
        
        <Modal show={this.state.show} onHide={this.handleClose}
               id="schedule_route" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"
               aria-hidden="true">
          <Modal.Header closeButton>
            <Modal.Title>Schedule / Route Assigment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className="empty-xs-30 empty-md-30"></div>
            
            <Row>
              
              <Col md={12}>
                
                <section className="tabs-section">
                  <div className="tabs-section-nav tabs-section-nav-icons">
                    <div className="tbl">
                      <ul className="nav" role="tablist">
                        <li className="nav-item">
                          <a className="nav-link active" href="#tabs-1-tab-1" role="tab"
                             data-toggle="tab">
													<span className="nav-link-in">
														Schedule
													</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#tabs-1-tab-2" role="tab" data-toggle="tab">
													<span className="nav-link-in">
													Route Assigment
													</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#tabs-1-tab-3" role="tab" data-toggle="tab">
													<span className="nav-link-in">
													RTS
													</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="tab-content">
                    <div role="tabpanel" className="tab-pane fade in active show" id="tabs-1-tab-1">
                      <Row className="row">
                        <Col md={12}>
                            <ScheduleModal/>
                        </Col>
                      </Row>
                    
                    
                    </div>
                    <Row role="tabpanel" className="tab-pane fade" id="tabs-1-tab-2" style={{opacity:1}}>
                      <Row className="row">
                        <Col md={12}>
                          <RouteAssignmentModal/>
                        </Col>
                      </Row>
                    </Row>
                    <Row role="tabpanel" className="tab-pane fade" id="tabs-1-tab-3" style={{opacity:1}}>
                      <Row className="row">
                        <Row className="col-md-12">
                          <RTSModal/>
                        </Row>
                      </Row>
                    </Row>
                    
                  </div>
                
                </section>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      
      </div>
    
    );
  }
}

export default ScheduleRouteAssigment;