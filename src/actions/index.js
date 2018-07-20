import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Constants from "../constants";
import Moment from 'react-moment';
import 'moment-timezone';

const API_KEY = 'qNpala4OG$6m8oxK2qRpgR6B$npdxWgXGF5$QaNt9UQhfl$hMQH$FNBE7!SFU6Ax';
const DOMAIN = 'https://imsba.com/';
const API_VERSION = 'api/v2/';
const ROOT_URL_SITES = `${DOMAIN}api/workforce/sites?key=${API_KEY}`;
const ROOT_URL_ORDERS = `${DOMAIN}api/dispatch/orders?key=${API_KEY}`;
const ROOT_URL_SHIFTS = `${DOMAIN}api/workforce/all_shifts?key=${API_KEY}`;
const ROOT_URL_HISTORY = `${DOMAIN}api/dispatch/location_history?key=${API_KEY}`;
const ROOT_URL_USER_LOCATIONS = `${DOMAIN}api/dispatch/pull_location?key=${API_KEY}`;

export function onMarkerCLick(driver) {
  const dataHistory = new FormData();
  const markers = [];
  dataHistory.append('crm_account_id', driver.id);
  
  return function (dispatch) {
    axios.post(ROOT_URL_HISTORY, dataHistory)
      .then(function (response) {
        if (response.data) {
          response.data.map((driverLocations, index) => {
            markers.push({
              id: index, lat: driverLocations.lat,
              lng: driverLocations.lng, driverId: driver.id, rotation: driverLocations.rotation
            })
          });
        }
        dispatch({
          type: 'MARKER_CLICKED',
          payload: markers,
          
        })
      });
  }
}

export function getDrivers() {
  const today = new Date();
  const startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' +
    today.getDate() + ' 0:00:00 -0800';
  const endDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' +
    today.getDate() + ' 23:59:59 -0800';
  let site_id = '0';
  const cookies = new Cookies();
  if (Number(cookies.get('site_id'))) {
    site_id = Number(cookies.get('site_id'));
  }
  else {
    site_id = '0';
  }
  const dataUsers = new FormData();
  dataUsers.append('start', startDate);
  dataUsers.append('end', endDate);
  dataUsers.append('site_id', '0');
  
  const drivers = [];
  
  return function (dispatch) {
    axios.post(ROOT_URL_USER_LOCATIONS, dataUsers)
      .then(function (response) {
        response.data.map((driver, index) => {
          drivers.push(driver)
        });
        dispatch({
          type: 'GET_DRIVERS',
          payload: drivers,
          
        })
      });
  }
  
  
}

export function getOrders(driver) {
  const dataOrders = new FormData();
  dataOrders.append('crm_account_id', driver.id);
  
  return function (dispatch) {
    axios.post(ROOT_URL_ORDERS, dataOrders)
      .then(function (response) {
        dispatch({
          type: 'ORDERS',
          payload: response.data,
          
        })
      });
  }
}

export function login(username, password) {
//  loading.show();
  const dispatcherData = new FormData();
  dispatcherData.append("username", username);
  dispatcherData.append("password", password);
  dispatcherData.append("login_type", '2');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${DOMAIN}${API_VERSION}admin/login?key=${API_KEY}`, dispatcherData)
        .then(function (response) {
          // localStorage.setItem('customer_id', response.data.id);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('customer_data', JSON.stringify(response.data));
          dispatch({
            type: 'LOGIN',
            payload: response.data,
            
          })
          resolve(response.data);
        })
        .catch((error) => {
          dispatch({
            type: 'LOGIN_ERR',
            payload: error,
            
          })
          reject(error)
        });
    })
  }
}

export function resetPassword(phone) {
  const err = [];
  const dispatcherData = new FormData();
  dispatcherData.append('phone', phone);
  dispatcherData.append("digits", '6');
  return function (dispatch) {
    //axios.post y promisa.karam return anem,vorpes promise u comonentum ogtagorcem,kanchelov ira then y kam catchy
    return new Promise((resolve, reject) => {
      axios.post(`${DOMAIN}${API_VERSION}admin/password_reset?key=${API_KEY}`, dispatcherData)
        .then(function (response) {
          localStorage.setItem('phone', phone);
          
          dispatch({
            type: 'RESET',
            payload: response.data,
            
          })
          resolve(response.data)
          
        })
        .catch(error => {
          //vorpes code kvercni error.response.data.error-i code,mnacacy nuyn dzev
          const {code, status, message, info} = error.response.data.error;
          err.push({
            code,
            status,
            message,
            info,
          });
          dispatch({
            type: 'RESET_ERR',
            payload: err,
            
          })
          reject(error)
          
        });
    })
  }
}

export function verifyPassword(code) {
  var phone = localStorage.getItem('phone');
  const dispatcherData = new FormData();
  dispatcherData.append('phone', phone);
  dispatcherData.append('code', code);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}admin/verify?key=${API_KEY}`, dispatcherData)
        .then(function (response) {
          localStorage.setItem('code', code);
          
          dispatch({
            type: 'VERIFY',
            payload: response.data,
            
          })
          resolve(response.data)
        })
        .catch((error) => {
          dispatch({
            type: 'VERIFY_ERR',
            payload: error.response.data.error,
            
          })
          reject(error)
          
        });
    })
    
  }
}

export function newPassword(new_password_1, new_password_2) {
  var phone = localStorage.getItem("phone");
  var code = localStorage.getItem("code");
  const dispatcherData = new FormData();
  dispatcherData.append('phone', phone);
  dispatcherData.append('code', code);
  dispatcherData.append('password', new_password_1);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${DOMAIN}${API_VERSION}admin/password?key=${API_KEY}`, dispatcherData)
        .then(function (response) {
          
          dispatch({
            type: 'PASSWORD',
            payload: response,
            
          })
          resolve(response)
        })
        .catch((error) => {
          
          dispatch({
            type: 'PASSWORD_ERR',
            payload: error.response.data,
            
          })
          reject(error)
        });
    })
    
  }
}

export function submitDispachersReport(dispatcherData) {
  var date = today().props.children;
  dispatcherData.append("date", date)
  const token = localStorage.getItem('token');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/dispatcher_report?key=${API_KEY}`, dispatcherData,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'SUBMIT_DISPATCHERS_REPORT',
            payload: response.data,
            
          })
          resolve(response.data);
          
        })
        .catch((error) => {
          dispatch({
            type: 'SUBMIT_DISPATCHERS_REPORTERR',
            payload: error,
            
          })
          reject(error)
        });
      ;
    })
  }
}

export function pullDispachersReport(dispatcherData) {
  var date = today().props.children;
  var site_id = localStorage.getItem('site_id');
  const token = localStorage.getItem('token');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.get(`${Constants.DOMAIN}${Constants.API_VERSION}dispatch/dispatcher_report?date=${date}&site_id=${site_id}&key=${Constants.API_KEY}`,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'PULL_DISPATCHERS_REPORT',
            payload: response.data,
            
          })
          resolve(response.data);
          
        })
        .catch((error) => {
          dispatch({
            type: 'PULL_DISPATCHERS_REPORT_ERR',
            payload: error,
            
          })
          reject(error)
        });
      ;
    })
  }
}

export function schedule_route() {
  const token = localStorage.getItem('token');
  const date = localStorage.getItem('date');
  const site_id = localStorage.getItem('site_id');
  return function (dispatch) {
    axios.get(`${DOMAIN}${API_VERSION}dispatch/schedule?date=${date}&site_id=${site_id}&key=${API_KEY}`,
      {
        headers: {
          'token': token
        }
      })
      .then(function (response) {
        dispatch({
          type: 'SCHEDULE_ROUTE',
          payload: response.data,
          
        })
      })
      .catch(function (error) {
      });
  }
  
  
}

export function allRescues() {
  const token = localStorage.getItem('token');
  const date = localStorage.getItem('date');
  const site_id = localStorage.getItem('site_id');
  return function (dispatch) {
    axios.get(`${DOMAIN}${API_VERSION}dispatch/rescue?date=${date}&site_id=${site_id}&key=${API_KEY}`,
      {
        headers: {
          'token': token
        }
      })
      .then(function (response) {
        dispatch({
          type: 'ALL_RESCUES',
          payload: response.data,
          
        })
      })
      .catch(function (error) {
      });
  }
  
}

export function submitScheduleReport(data) {
  
  const token = localStorage.getItem('token');

  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/schedule?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'SUBMIT_SCHEDULE_REPORTS',
            payload: response.data,
            
          })
          resolve(response.data);
          
        })
        .catch(function (error) {
          dispatch({
            type: 'SUBMIT_SCHEDULE_REPORTS_ERR',
            payload: error,
    
          })
          reject(error)
          
        })
    });
  }
}

export function submitRouteAssignment(data) {
  const token = localStorage.getItem('token');
  
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/routes?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'SUBMIT_ROUTE',
            payload: response.data,
            
          })
          resolve(response.data);
          
        })
        .catch(function (error) {
          dispatch({
            type: 'SUBMIT_ROUTE_ERR',
            payload: error,
    
          })
          reject(error)
          
        })
    });
  }
}

export function progress_statics() {
  const token = localStorage.getItem('token');
  const date = today().props.children;
  const site_id = localStorage.getItem('site_id');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.get(`${DOMAIN}${API_VERSION}dispatch/progress_report?date=${date}&site_id=${site_id}&key=${API_KEY}`,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'DAILY_REPORT',
            payload: response.data,
            
          })
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error)
        })
    });
  }
}

export function getLocations() {
  
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      var token = localStorage.getItem('token');
      axios.get(`${DOMAIN}${API_VERSION}workforce/permission?key=${API_KEY}`,
        {
          headers:
            {
              'token':
              token
              
            }
        }
      ).then(function (response) {
        dispatch({
          type: 'LOCATIONS',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'LOCATIONS_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
  
  
}

export function settings() {
  return function (dispatch) {
    return new Promise((resolve, reject) => {
        axios.get(`${DOMAIN}${API_VERSION}website/settings?key=${API_KEY}`).then(response => {
          if (document.getElementById('main_icon')) {
            document.getElementById('main_icon').setAttribute('src', DOMAIN + response.data.icon)
          }
          dispatch({
            type: 'SETTINGS',
            payload: response.data,
            
          })
          resolve(response.data);
        })
          .catch((error) => {
            dispatch({
              type: 'SETTINGS_ERR',
              payload: error,
              
            })
            reject(error)
            //
            //   if (response.data.hr != 1) {
            //     this.hideHR();
            //   }
            //   this.pull_info();
            //
            // })
            // .catch(error => {
            //   this.setState({isError: true, message: error.response.data.error.message})
          })
      }
    )
  }
  
}

function today() {
  var site_info;
  var siteId = localStorage.getItem('site_id')
  var token = localStorage.getItem('token');
  axios.get(`${DOMAIN}${API_VERSION}workforce/permission?key=${API_KEY}`,
    {
      headers:
        {
          'token':
          token
          
        }
    }
  ).then(function (response) {
    response.data.map((location, index) => {
      if (site_info) {
        return false;
      } else {
        location.sites.map((site, index) => {
          if (site.id == siteId) {
            site_info = site;
          }
        });
      }
    });
  })
  
  
  var state = (site_info ? site_info.state : 'CA');
  var today = new Date();
  const startDate = ((today.getMonth() + 1).toString().length<2 ? '0'+(today.getMonth() + 1):(today.getMonth() + 1) )+ '-' +
    ( today.getDate().toString().length<2 ? '0'+ today.getDate():  today.getDate())+ '-' + today.getFullYear();
  if (state == "CA" || state == 'ca') {
    return <Moment unix tz="America/Los_Angeles" format="mm-dd-yyyy">
      {startDate}
    </Moment>
  } else {
    return <Moment unix tz="America/Chicago" format="mm-dd-yyyy">
      {startDate}
    </Moment>
  }
}

function todaySearch() {
  var site_info;
  var siteId = localStorage.getItem('site_id')
  var token = localStorage.getItem('token');
  axios.get(`${DOMAIN}${API_VERSION}workforce/permission?key=${API_KEY}`,
    {
      headers:
        {
          'token':
          token
          
        }
    }
  ).then(function (response) {
    response.data.map((location, index) => {
      if (site_info) {
        return false;
      } else {
        location.sites.map((site, index) => {
          if (site.id == siteId) {
            site_info = site;
          }
        });
      }
    });
  })
  var state = (site_info ? site_info.state : 'CA');
  var today = new Date();
  const startDate = today.getFullYear() + '-' +((today.getMonth() + 1).toString().length<2 ?'0'+(today.getMonth() + 1):(today.getMonth() + 1)) + '-'
    + (today.getDate().toString().length<2 ?'0'+ today.getDate() :today.getDate());
  if (state.toUpperCase() == "CA") {
    return <Moment unix tz="America/Los_Angeles" format="YYYY-MM-DD">
      {startDate}
    </Moment>
  } else {
    return <Moment unix tz="America/Chicago" format="YYYY-MM-DD">
      {startDate}
    </Moment>
  }
}

export function getShifts() {
  var start = todaySearch().props.children + ' 00:00:00';
  var site_id = localStorage.getItem('site_id');
  var end = todaySearch().props.children + ' 23:59:59';
  var date = today().props.children;
  var token = localStorage.getItem('token');
  var dispatchData = new FormData();
  dispatchData.set('start', start);
  dispatchData.set('end', end);
  dispatchData.set('site_id', site_id);
  dispatchData.set('date', date);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${DOMAIN}${API_VERSION}workforce/all_shifts?key=${API_KEY}`, dispatchData,
        {
          headers: {"token": token}
        }).then(function (response) {
        dispatch({
          type: 'SHIFTS',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'SHIFTS_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
  
  
}

export function getDrivers2() {
  //it calls when website_data.hr!=1,this is not drivers which is shown on map;
  var token = localStorage.getItem('token');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.get(`${DOMAIN}${API_VERSION}dispatch/drivers?key=${API_KEY}`,
        {
          headers: {"token": token}
        }).then(function (response) {
        dispatch({
          type: 'DRIVERS2',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'DRIVERS2_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
}

export function changeIsShown(isShown) {
  return ({
    type: 'isShown',
    payload: !isShown,
  })
}

export function hourly() {
  var token = localStorage.getItem('token');
  var date = localStorage.getItem("date");
  var site_id = localStorage.getItem('site_id');
  var dispatchData = new FormData;
  dispatchData.append('date', date);
  dispatchData.append('site_id', site_id);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${DOMAIN}${API_VERSION}dispatch/hourly?key=${API_KEY}`, dispatchData,
        {
          headers: {"token": token}
        }).then(function (response) {
        dispatch({
          type: 'HOURLY',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'HOURLY_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
  
}

export function schedule() {
  var site_id = localStorage.getItem('site_id')
  var date = today().props.children;
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.get(`${Constants.DOMAIN}${Constants.API_VERSION}dispatch/schedule?date=${date}&site_id=${site_id}&key=${Constants.API_KEY}`,
        
        {
          headers: {
            "token": Constants.TOKEN
          }
        }).then(function (response) {
        dispatch({
          type: 'SCHEDULE',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'SCHEDULE_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
}

export function removeReport(crm_account_id) {
  
  var date = today().props.children;
  var site_id = localStorage.getItem('site_id');
  var dispatchData = new FormData();
  dispatchData.set('site_id', site_id);
  dispatchData.set('date', date);
  dispatchData.set('crm_account_id', crm_account_id);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${Constants.DOMAIN}${Constants.API_VERSION}dispatch/remove_driver?key=${Constants.API_KEY}`, dispatchData,
        {
          headers: {
            "token": Constants.TOKEN
          }
        }).then(function (response) {
        dispatch({
          type: 'REMOVE_REPORT',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'REMOVE_REPORT_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
  
}

export function submitRescue(packages, time, rescuer, rescuer_id) {
  
  var date = today().props.children;
  var site_id = localStorage.getItem('site_id');
  var dispatchData = new FormData();
  dispatchData.set('site_id', site_id);
  dispatchData.set('date', date);
  dispatchData.set('crm_account_id', (JSON.parse(localStorage.getItem("customer_data"))).id);
  dispatchData.set('packages', packages);
  dispatchData.set('time', time);
  dispatchData.set('rescuer', rescuer);
  dispatchData.set('rescuer_id', rescuer_id);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${Constants.DOMAIN}${Constants.API_VERSION}dispatch/rescue?key=${Constants.API_KEY}`, dispatchData,
        {
          headers: {
            "token": Constants.TOKEN
          }
        }).then(function (response) {
        dispatch({
          type: 'SUBMIT_RESCUE',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'SUBMIT_RESCUE_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
  
}

export function submitHRReport(dispatchData) {
 
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${Constants.DOMAIN}${Constants.API_VERSION}dispatch/hr_report?key=${Constants.API_KEY}`, dispatchData,
        {
          headers: {
            "token": Constants.TOKEN
          }
        }).then(function (response) {
        dispatch({
          type: 'SUBMIT_HRREPORT',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'SUBMIT_HRREPORT_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
  
}

export function submitSupplies (title,description){
  var date = today().props.children;
  var site_id = localStorage.getItem('site_id');
  var dispatchData = new FormData();
  dispatchData.set('date', date);
  dispatchData.set('site_id', site_id);
  dispatchData.set('title', title);
  dispatchData.set('description', description);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${Constants.DOMAIN}${Constants.API_VERSION}dispatch/supplies?key=${Constants.API_KEY}`, dispatchData,
        {
          headers: {
            "token": Constants.TOKEN
          }
        }).then(function (response) {
        dispatch({
          type: 'SUPPLY',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'SUPPLY_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
}

export function getVehicleInspections(){
  var date = today().props.children;
  var site_id = localStorage.getItem('site_id');
  var dispatchData = new FormData();
  dispatchData.set('date', date);
  dispatchData.set('site_id', site_id);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${Constants.DOMAIN}${Constants.API_VERSION}dispatch/inspections?key=${Constants.API_KEY}`, dispatchData,
        {
          headers: {
            "token": Constants.TOKEN
          }
        }).then(function (response) {
        dispatch({
          type: 'VEHICLE_INSPECTIONS',
          payload: response.data,
                  })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'VEHICLE_INSPECTIONS_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
  
  
}

export function inspectionView(id){
  var date = today().props.children;
  var site_id = localStorage.getItem('site_id');
  var dispatchData = new FormData();
  dispatchData.set('date', date);
  dispatchData.set('id', id);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios.post(`${Constants.DOMAIN}${Constants.API_VERSION}dispatch/inspection?key=${Constants.API_KEY}`, dispatchData,
        {
          headers: {
            "token": Constants.TOKEN
          }
        }).then(function (response) {
        dispatch({
          type: 'INSPECTION',
          payload: response.data,
        })
        resolve(response.data);
        
      })
        .catch((error) => {
          dispatch({
            type: 'INSPECTION_ERR',
            payload: error,
            
          });
          reject(error);
          
        })
    })
  }
  
}

export function submitInspection(data) {
  var date = today().props.children;
  var site_id = localStorage.getItem('site_id');
  const token = localStorage.getItem('token');
  data.set('date', date);
  data.set('site_id', site_id);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/update_inspection?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'SUBMIT_SCHEDULE_REPORTS',
            payload: response.data,
            
          })
          resolve(response.data);
          
        })
        .catch(function (error) {
          dispatch({
            type: 'SUBMIT_SCHEDULE_REPORTS_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
}

export function inventory( ) {
  var date = today().props.children;
  var site_id = localStorage.getItem('site_id');
  const token = localStorage.getItem('token');
   var dispatchData = new FormData();
  dispatchData.set('date', date);
  dispatchData.set('site_id', site_id);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/inventory?key=${API_KEY}`, dispatchData,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'INVENTORY',
            payload: response.data,
            
          })
          resolve(response.data);
          
        })
        .catch(function (error) {
          dispatch({
            type: 'INVENTORY_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
}

export function insertVehicleNote (data){
  
  const token = localStorage.getItem('token');
    return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/vehicle_note?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'INSERT_VEHICLE_NOTE',
            payload: response.data,
            
          })
          resolve(response.data);
          
        })
        .catch(function (error) {
          dispatch({
            type: 'INSERT_VEHICLE_NOTE_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
}

export function updateInventory (data){
  
  const token = localStorage.getItem('token');
return function (dispatch) {
  return new Promise((resolve, reject) => {
    
    axios.post(`${DOMAIN}${API_VERSION}dispatch/update_vehicle?key=${API_KEY}`, data,
      {
        headers: {
          'token': token
        }
      })
      .then(function (response) {
        dispatch({
          type: 'UPDATE_VEHICLE',
          payload: response.data,
          
        })
        resolve(response.data);
        
      })
      .catch(function (error) {
        dispatch({
          type: 'UPDATE_VEHICLE_ERR',
          payload: error,
          
        })
        reject(error)
        
      })
  });
}
}

export function submitInventory(data){
    const token = localStorage.getItem('token');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/vehicle?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'UPDATE_VEHICLE',
            payload: response.data,
            
          })
          resolve(response.data);
          
        })
        .catch(function (error) {
          dispatch({
            type: 'UPDATE_VEHICLE_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
}

export function updTotals(){
  const token = localStorage.getItem('token');
  var site_id = localStorage.getItem('site_id')
  var date = today().props.children;
  var dispatchData = new FormData();
  dispatchData.set('date', date);
  dispatchData.set('site_id', site_id);
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/comments?key=${API_KEY}`, dispatchData,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'UPD',
            payload: response.data,
            
          })
          resolve(response.data);
        })
        .catch(function (error) {
          dispatch({
            type: 'UPD_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
  
}
export function submitDay(data){
  const token = localStorage.getItem('token');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/send_comments?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'SEND_COMMENTS',
            payload: response.data,
            
          })
          resolve(response.data);
        })
        .catch(function (error) {
          dispatch({
            type: 'SEND_COMMENTS_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
}
export function submitHour(data){
  const token = localStorage.getItem('token');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/report?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'SUBMIT_HOUR',
            payload: response.data,
            
          })
          resolve(response.data);
        })
        .catch(function (error) {
          dispatch({
            type: 'SUBMIT_HOUR_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
}
export function check_track(data){
  const token = localStorage.getItem('token');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/last_hour?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'CHECK_TRACK',
            payload: response.data,
            
          })
          resolve(response.data);
        })
        .catch(function (error) {
          dispatch({
            type: 'CHECK_TRACK_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
}

export function spr_report(data) {
  const token = localStorage.getItem('token');
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      
      axios.post(`${DOMAIN}${API_VERSION}dispatch/spr_report?key=${API_KEY}`, data,
        {
          headers: {
            'token': token
          }
        })
        .then(function (response) {
          dispatch({
            type: 'SPR',
            payload: response.data,
            
          })
          resolve(response.data);
        })
        .catch(function (error) {
          dispatch({
            type: 'SPR_ERR',
            payload: error,
            
          })
          reject(error)
          
        })
    });
  }
}