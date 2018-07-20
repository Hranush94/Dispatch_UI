import React from 'react';
import {Modal} from 'react-bootstrap';
import {submitSupplies} from "../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Notification} from 'react-pnotify';


class Supplies extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false,
      title: '',
      report: '',
      showNotification:false,
      message:''
    };
  }
  
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true});
  }
  onTitleChange = (e) => {
    this.setState({title: e.target.value})
  }
  onReportChange = (e) => {
    this.setState({report: e.target.value})
  }
  submitSupplies = (event) => {
    event.preventDefault()
  this.props.submitSupplies(this.state.title,this.state.report).then(response=>
  {this.setState({showNotification:true,message:'Supply Request Sent'})
    this.handleClose()
  }).catch(error=>{
  this.setState({message: error.response.data.error.message,showNotification:true})
  
}) }
  
  render() {
    return (
      <div>
        <a href="#" onClick={(event) => this.handleShow(event)}>
          <i className="scoo-icon scoo-icon-8"></i>
          <span className="lbl">Supplies</span>
        </a>
        <Modal show={this.state.show} onHide={this.handleClose}
               id="supplies">
          <Modal.Header closeButton>
            <Modal.Title>SUPPLIES</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className="empty-xs-30 empty-md-30"></div>
            
            
            <form className="hori-form">
              <div className="form-group row d-flex align-items-center">
                <label className="col-sm-2 form-control-label">Title</label>
                <div className="col-sm-10">
                  <p className="form-control-static">
                    <input type="text" className="form-control" id="suppliesTitle"
                           value={this.state.title} onChange={event => {
                      this.onTitleChange(event)
                    }}
                           placeholder="Enter here"/></p>
                </div>
              </div>
              <div className="form-group row d-flex align-items-center">
                
                <div className="col-sm-12">
                  <textarea className="form-control" rows="8" id="suppliesDescription"
                            placeholder="Your Report Here" value={this.state.report}
                            onChange={event => {
                              this.onReportChange(event)
                            }}
                  ></textarea>
                </div>
              </div>
              
              
              <div className="empty-xs-30 empty-md-30"></div>
              
              <div className="form-group row">
                <div className="col-sm-8"></div>
                <div className="col-sm-4 text-right">
                  <a href="javascript:void(0);" onClick={(event) => this.submitSupplies(event)}
                     className="btn btn-yellow2 width100">Submit</a>
                </div>
              </div>
            </form>
            
            
            <div className="empty-xs-10 empty-md-10"></div>
          
          
          </Modal.Body>
        </Modal>
  
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
      </div>
    
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ submitSupplies}, dispatch);
}

export default connect(null, mapDispatchToProps)(Supplies);

