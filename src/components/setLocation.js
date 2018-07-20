import React, {Component} from 'react';
import {Notification} from 'react-pnotify';
import Moment from 'react-moment';
import 'moment-timezone';
import LocationDropdown from "./setLocation_modal";
import {bindActionCreators} from "redux";
import {getLocations,settings,getShifts,getDrivers2} from "../actions";
import {connect} from "react-redux";
var shown = {
  display: "block"
};
var hidden = {
  display: "none"
};
const API_KEY = 'qNpala4OG$6m8oxK2qRpgR6B$npdxWgXGF5$QaNt9UQhfl$hMQH$FNBE7!SFU6Ax';
const DOMAIN = 'https://imsba.com/';
const API_VERSION = 'api/v2/';
var token = localStorage.getItem('token');
var site_id = localStorage.getItem('site_id');
var dt;

class SetLocation extends React.Component {
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      siteId: '',
      siteName: '',
      isError: false,
      message: '',
      sites: [],
      show:true,
      run_by_hour:false,
    };
    this.drivers2=[]
  }
  componentWillMount(){
    this.props.settings();
  }
  componentDidMount(){
    this.pull_info();
    this.props.getShifts();
  }
  onSiteChange = (event) => {
    var index = event.nativeEvent.target.selectedIndex;
    var name = event.nativeEvent.target[index].text;
    var siteId = event.nativeEvent.target[index].value
    this.setState({siteName: name, siteId: siteId});
  }
  
  hideHR = () => {
    document.getElementById('menu_item_dispatcher').setAttribute('style', hidden);
    document.getElementById('menu_item_assignment').setAttribute('style', hidden);
    // document.getElementById('menu_item_statistics').setAttribute('style', hidden);
    // document.getElementById('menu_item_rescue').setAttribute('style', hidden);
    // document.getElementById('menu_item_inspection').setAttribute('style', hidden);
    // document.getElementById('menu_item_inventory').setAttribute('style', hidden);
    // document.getElementById('menu_item_supplies').setAttribute('style', hidden);
    // document.getElementById('profileRescue').setAttribute('style', hidden);
    // document.getElementById('menu_item_delivery_report').setAttribute('style', hidden);
    // document.getElementById('menu_item_new_order').setAttribute('style', hidden);
    // document.getElementById('menu_item_hour_report').setAttribute('style', hidden);
    
  }

  // today = () => {
  //   var site_info;
  //   this.props.locationSites.map((location, index) => {
  //     if (site_info) {
  //       return false;
  //     } else {
  //       location.sites.map((site, index) => {
  //         if (site.id == site_id) {
  //           site_info = site;
  //         }
  //       });
  //     }
  //   });
  //
  //   var state = (site_info ? site_info.state : 'CA');
  //   var today = new Date();
  //   const startDate = (today.getMonth() + 1) + '-' +
  //     today.getDate() + '-' + today.getFullYear();
  //   if (state == "CA" || state == 'ca') {
  //     return <Moment unix tz="America/Los_Angeles" format="MM-DD-YYYY">
  //       {startDate}
  //     </Moment>
  //   } else {
  //     return <Moment unix tz="America/Chicago" format="MM-DD-YYYY">
  //       {startDate}
  //     </Moment>
  //   }
  // }
  // todaySearch = () => {
  //   var site_info;
  //
  //   this.props.locationSites.map((location, index) => {
  //
  //     if (site_info) {
  //       return false;
  //     } else {
  //       location.sites.map((site, index) => {
  //         if (site.id == site_id) {
  //           site_info = site;
  //         }
  //       });
  //     }
  //   });
  //
  //   var state = (site_info ? site_info.state : 'CA');
  //   var today = new Date();
  //   const startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  //   if ( state.toUpperCase() == "CA" ) {
  //     return <Moment unix tz="America/Los_Angeles" format="YYYY-MM-DD">
  //       {startDate}
  //     </Moment>
  //   } else {
  //     return <Moment unix tz="America/Chicago" format="YYYY-MM-DD">
  //       {startDate}
  //     </Moment>
  //   }
  // }
  //
  setSite = () => {
    localStorage.setItem('site_id',this.state.siteId);
    localStorage.setItem('site_name',this.state.siteName);
    this.pull_info();
    document.getElementById('left_menu_content').setAttribute('style', shown);
    document.getElementById('location_set').innerHTML = this.state.siteName;
  
    // var site_info;
    // var locationSites = JSON.parse(localStorage.getItem('location_sites'));
    //   locationSites.data.map((location,index) => {
    //
    //   if (site_info) {
    //     return false;
    //   } else {
    //     location.sites.map((site,index) => {
    //       if (site.id == this.state.setSite) {
    //         site_info = site;
    //         //this.initialize();
    //         // setTimeout(function () {
    //         //   this.find_address(site.address + ' ' + site.city + ' ' + site.state + ', ' + site.zip);
    //         // }, 500);
    //         return false;
    //       }
    //     })
    //   }
    // })
  }
  
  pull_info = () => {
    // Set Permissions
    if (this.props.websiteData) {
      document.getElementById('main_icon').setAttribute('src', DOMAIN + this.props.websiteData.icon)
      if (this.props.websiteData.hr != 1) {
        this.hideHR();
      }
    } else {
      this.props.settings().then(response=>{
        if (response.hr != 1) {
              this.hideHR();
            }
      }).catch(error=>{
        if(error.response){
        this.setState({isError: true, message: error.response.data.error.message})}
      });
    }
   
    // if (this.props.websiteData.hr == 1) {
    //    this.track();
    //
    // }
    
  }
  
  notify(text) {
    return <Notification
      type='notice'
      text={text}
      delay={2000}
      shadow={false}
      hide={true}
      nonblock={true}
      desktop={true}
    />
  }
  
  
  
  render() {
    return (
      <div>
      <LocationDropdown setSite={this.setSite}
                        onSiteChange={this.onSiteChange}/>
  
      </div>
    
    )
  }
  
}

function mapStateToProps(state) {
  return {
    locationSites: state.locationSites,
    websiteData:state.websiteData,
    shifts:state.shifts,
    drivers2:state.drivers2
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getLocations,settings,getShifts,getDrivers2}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(SetLocation);