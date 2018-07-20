import React, {Component} from 'react';
import DispatcherReports from './dispatcher_reports';
import ScheduleRouteAssigment from './schedule_route_assigment';
import Drivers from './drivers'
import Color from "color";
import Map from '../containers/map';
import 'moment-timezone';
import Reports from "./reports";
import {bindActionCreators, changeFieldValue} from "redux";
import {getLocations, getDrivers2, getShifts, changeIsShown} from "../actions";
import {connect} from "react-redux";
import SetLocation from "./setLocation"
import SearchMap from "./search_nav";
import ProgressStatistics from "./progress_statistics"
import Rescues from "./rescues";
import IncidentReports from "./incident_reports";
import Supplies from "./supplies_modal";
import VehicleInspections from "./vehicle_inspections"
import Inventory from "./inventory";

var shown = {
  display: "block"
};
var hidden = {
  display: "none"
};

class Main extends Component {
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      style: hidden,
      siteId: localStorage.getItem('site_id'),
      siteName: localStorage.getItem('siteName'),
      show: false,
      showSideBar: true,
      toggle:false
    };
  }
  
  componentDidMount() {
    this.props.getShifts();
  }
  
  toggleSideBar = () => {
    this.setState({showSideBar: !this.state.showSideBar})
  }
  toggle=()=>{
    this.setState({toggle: !this.state.toggle})
    }
  componentWillMount() {
    if (localStorage.getItem('site_id') && localStorage.getItem('site_name')) {
      this.setState({style: shown});
      this.setState({siteName: localStorage.getItem('site_name')});
    }
    
    
  }
  
  changeSiteId = (event) => {
    event.preventDefault();
    this.props.changeIsShown(this.props.isShown);
  }
  
  
  render() {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/')
    }
    
    return (
      <div>
        <div className="with-side-menu" style={{height: 100 + '%'}}>
          <div id="loading"
               style={{
                 width: 100 + "%", position: "fixed", height: 100 + "%", backgroundColor: Color('rgba(0,0,0,.7)'),
                 zIndex: 9999999999, display: 'none'
               }}
          >
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          </div>
          <div className="mobile-menu-left-overlay"></div>
          <button id="show-hide-sidebar-toggle" className="toggle-fixed"
                  onClick={() => this.toggleSideBar()} style={!this.state.showSideBar ? {left:0 +'px',
          WebkitTransition:"all .2s ease-in-out",transition:"all .2s ease-in-out" }:{}}>
            <img src="img/ic_back2.png" width="8"/>
          </button>
          <button className={"hamburger hamburger--htla "+ (this.state.toggle ? " is-active":"")}
                  onClick={() => this.toggle()}>
            <span>toggle menu</span>
          </button>
          
          {(this.state.showSideBar && !this.state.toggle) || (!this.state.showSideBar && this.state.toggle)?
            <nav className="side-menu"
                 // style={this.state.toggle ? {display:"block"} :{display:'none'}}
            >

            <div className="panel-pic">
              <article className="friends-list-item">
                <div className="user-card-row">
                  <div className="tbl-row">
                    <div className="tbl-cell tbl-cell-photo">
                      <a href="#">
                        <img id="main_icon" src="img/avatar.png" alt=""/>
                      </a>
                    </div>
                    <div className="tbl-cell">
                      <p className="user-card-row-name">Location/ Site:
                        <a href="#" onClick={() => this.props.getShifts()}
                           className="glyphicon glyphicon-refresh">
                        </a></p> <br/>
                      <div className="dropdown dropdown-typical">
                        <a className="dropdown-toggle" data-toggle="modal" data-target="#location_sites"
                           onClick={(event) => this.changeSiteId(event)}
                        >
                        <span className="user-card-row-location" id="location_set">
                          {!this.state.siteName ? 'Please Select Location' : this.state.siteName}
                        </span>
                        </a>
                      
                      
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            
            <div className="empty-xs-50 empty-md-50"></div>
            <ul className="side-menu-list" id="left_menu_content" style={this.state.style}>
              <li id="menu_item_drivers">
                <Drivers customerData={this.customerData} drivers={this.props.drivers2}/>
              </li>
              
              
              <li id="menu_item_dispatcher">
                <DispatcherReports/>
              </li>
              
              <li id="menu_item_assignment">
                <ScheduleRouteAssigment/>
              </li>
              
              <li id="menu_item_statistics">
                <ProgressStatistics/>
              </li>
              
              
              <li id="menu_item_rescue">
                <Rescues/>
              </li>
              
              <li id="menu_item_inspection">
                <VehicleInspections/>
              </li>
              
              <li id="menu_item_incident_reports">
                <IncidentReports/>
              </li>
              
              <li id="menu_item_inventory">
                <Inventory/>
              </li>
              
              <li id="menu_item_supplies">
                <Supplies/>
              </li>
            
            </ul>
          </nav> : ''}

            <div className="page-content">
                <div className="container-fluid p-x-0 p-mobile">
                    <SearchMap/>

                </div>
            </div>

            <Map/>
        
        
        </div>
         {
          !this.state.siteId || !this.state.siteName ||
          this.props.isShown
          || !localStorage.getItem('site_id')
            ?
            <SetLocation/>
            : ''
        }
        <Reports  locations={this.props.locationSites}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locationSites: state.locationSites,
    websiteData: state.websiteData,
    drivers2: state.drivers2,
    isShown: state.isShown,
    customer_data: state.customer_data
    
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getLocations, getDrivers2, getShifts, changeIsShown}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);