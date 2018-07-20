import React from 'react';
import {Button, OverlayTrigger, Row, Col, Label} from 'react-bootstrap';

class WaveContent extends React.Component{
  render (){
    let newCount = this.props.value + 1;
  
    return(
      <div>
        <Row className="form-group  d-flex align-items-center"><label className="col-sm-4 form-control-label">
          Wave ${newCount} Scheduled Start</label> <div class="col-sm-8"> <p class="form-control-static">
          <input type="text" class="form-control" id="wave${newCount}"/></p> </div> </Row> <div class="empty-xs-40 empty-md-0">
      </div>
        <Row class="form-group  d-flex align-items-center"> <label class="col-sm-4 form-control-label">
          Wave ${newCount} Actual Start</label> <div class="col-sm-8"> <p class="form-control-static">
          <input type="text" class="form-control" id="wave${newCount}_actual_start"/></p> </div> </Row>
        <div class="empty-xs-40 empty-md-0"></div>
        <Row class="form-group  d-flex align-items-center"> <label class="col-sm-4 form-control-label">
          Wave ${newCount} Actual End</label> <div class="col-sm-8"> <p class="form-control-static">
          <input type="text" class="form-control" id="wave${newCount}_actual_end"/></p> </div> </Row>
        <div class="empty-xs-40 empty-md-0"></div>
      </div>
    )
  }
}
export default WaveContent;