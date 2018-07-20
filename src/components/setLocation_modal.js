import React, {Component} from 'react';
import {connect} from "react-redux";
import {getLocations, changeIsShown,getShifts} from "../actions";
import {bindActionCreators} from "redux";
import {Notification} from 'react-pnotify';
import {Modal} from 'react-bootstrap';
import Reports from "./reports";

class LocationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
      show: true,
    }
  }
  
  componentDidMount() {
 //  this.props.getLocations();
  }
  
  handleClose = () => {
    this.setState({show: false});
    this.props.changeIsShown(this.props.isShown);
  }
  pullSites = (event) => {
    var locationSelected = event.target.value;
    var sites = '<option>Please Select Job Site</option>';
    this.props.locationSites.map((value, index) => {
      
      if (locationSelected == value.id || locationSelected == value.name) {
        this.setState({sites: value.sites})
      }
      ;
    });
    
  }
  handleShow = (event) => {
    event.preventDefault()
    this.setState({show: true})
  }
  confirmSite = () => {
    this.props.setSite();
    this.props.getShifts();
    this.handleClose();
    
  }
  
  render() {
    return (
      <div id="location_sites" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"
      >
        <Modal show={this.state.show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton style={{paddingTop: 0}}>
            <Modal.Title>Please Select a Location and Site</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className="empty-xs-30 empty-md-30"></div>
            <form className="hori-form">
              <div className="form-group row">
                
                <div className="col-sm-12">
                
                </div>
              </div>
              
              
              <div className="form-group row">
                <div className="col-sm-12">
                  <select
                    className="select2"
                    id="setLocation"
                    defaultValue="Please Select Location"
                    onChange={(event) => this.pullSites(event)}
                  >
                    <option>Please Select Location</option>
                    {this.props.locationSites.map((v, k) => (
                      <option key={k} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                  <div className="empty-md-10 empty-md-10"></div>
  
                  <select
                    className="select2"
                    id="setSite"
                    defaultValue="Please Select Job Site"
                    onChange={(event) => this.props.onSiteChange(event)}
                  >
                    <option>Please Select Job Site</option>
                    {this.state.sites.map((v, k) => (
                      <option key={k} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              
              <div className="empty-xs-30 empty-md-30"></div>
              
              <div className="form-group row">
                <div className="col-sm-8"></div>
                <div className="col-sm-4 text-right">
                  <a href="javascript:void(0);"
                     onClick={() => this.confirmSite()}
                     className="btn btn-yellow2 width100">Confirm</a>
                </div>
              </div>
            </form>
            
            <div className="empty-xs-10 empty-md-10"></div>
          </Modal.Body>
        </Modal>
        {this.state.isError ?
          this.notify(this.state.message) : ''}
        <Reports/>
      </div>
    
    )
  }
}

function mapStateToProps(state) {
  return {
    locationSites: state.locationSites,
    isShown: state.isShown
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getLocations, changeIsShown,getShifts}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationDropdown);