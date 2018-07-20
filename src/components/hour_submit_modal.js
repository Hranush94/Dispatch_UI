import React from 'react';
import {Modal} from 'react-bootstrap';
import {submitHour, check_track, spr_report, getShifts} from "../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import dateFormat from "dateformat";

var date = dateFormat(new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear(), "mm-dd-yyyy")
var site_id = localStorage.getItem('site_id');
class HourSubmit extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      show: false,
      value: this.props.value,
      props: {},
      delivered: [],
      commentTime: [],
      deliveries_per_hour: [],
      new_spr: [],
      routes: [],
      sprReports: [],
      drivers:[]
      
    }
  }
  
  componentDidMount() {
    this.props.getShifts().then(response => {
      response.map((shift, index) => {
        if (shift.crm_data) {
         this.setState({
           drivers:{
             ...this.state.drivers,
             [shift.crm_data.id]:{id:shift.crm_data.id,first_name:shift.crm_data.first_name,
               last_name:shift.crm_data.last_name,removed:shift.removed}
           }
         })
        }
      })
  
    })
  
    var dispatchData = new FormData();
    dispatchData.set('date', date);
    dispatchData.set('site_id', site_id);
    dispatchData.set('hour', this.props.count);
  
    this.props.spr_report(dispatchData).then(response => {
      response && response.map((value, index) => {
        this.setState({
          sprReports: {
            ...this.state.sprReports,
            ['driver_' + value.crm_account_id]: value
          }
        })
        this.check_track(value.crm_account_id);
      });
    })
  }
  
  handleClose = () => {
    this.setState({show: false});
  }
  
  handleShow = (e) => {
    e.preventDefault();
    this.setState({show: true});
   
  }
  
  onInputChange = (event, id, keyName) => {
    event.preventDefault();
    //let prop = this.state.props[id] || {};
    // prop[keyName] = event.target.value;
    this.setState({
      props: {
        ...this.state.props,
        [keyName + '_' + id]: event.target.value
      }
    })
    this.check_track(id)
  }
   compare=(a, b) =>{
    if(a.route) {
      // var aA = a.route.replace(reA, "");
      // var bA = b.route.replace(reA, "");
      if (a.route ===  b.route) {
        return 0;
      } else {
        return a.route > b.route ? 1 : -1;
      }
    }
  }
  check_track = (id) => {
    var hour = this.props.count;
    var last_hour = hour - 1;
    var track_info;
    var timePerPackage;
    var original_spr = 0;
    var route_info;
    var dispatchData = new FormData();
    dispatchData.set('date', date);
    dispatchData.set('site_id', site_id);
    dispatchData.set('hour', last_hour);
    dispatchData.set('crm_account_id', id);
  
    var routesfromLocal = JSON.parse(localStorage.getItem('routes')).sort(this.compare)
    routesfromLocal.map((route, index) => {
      this.setState({
        routes: {
          ...this.state.routes,
          ['driver_' + route.crm_account_id]: route
        }
      })
    })
    original_spr = typeof this.state.props['track_spr_' + id] != 'undefined' ?
      this.state.props['track_spr_' + id] : this.state.routes['driver_' + id] && this.state.routes['driver_' + id].spr || 0;
    route_info = this.state.routes['driver_' + id];
    
    if (route_info) {
      var routeLength = route_info.route_length;
    } else {
      var routeLength = '00:00';
    }
    if (this.state.sprReports && typeof this.state.sprReports["driver_"+id] != 'undefined') {
    // this.setState({new_spr:value.spr})
    this.setState({
      new_spr: {
        ...this.state.new_spr, [id]:
          typeof this.state.props['track_spr_' + id] != 'undefined' ?
            this.state.props['track_spr_' +id] :
            typeof this.state.sprReports['driver_' + id] !='undefined' ?
              this.state.sprReports['driver_' + id].spr : ''      }
    })
    }
    var route_length = this.conv_duration(routeLength);
    
    this.setState({deliveries_per_hour: {...this.state.deliveries_per_hour, [id]: original_spr / route_length}})
    
    this.props.check_track(dispatchData).then(response => {
      track_info = response;
      if (track_info && track_info != 0) {
        var last_hour_spr = track_info.spr;
        this.setState({
          delivered: {
            ...this.state.delivered,
            [id]: (typeof this.state.props['track_spr_' + id] != 'undefined' ?
              this.state.props['track_spr_' + id] : this.state.new_spr[id]) - last_hour_spr
          }
        });
          timePerPackage = 60 / this.state.deliveries_per_hour[id];
          this.setState({
            commentTime: {
              ...this.state.commentTime,
              [id]: (this.state.delivered[id] < this.state.deliveries_per_hour[id])?
                (this.state.deliveries_per_hour[id] - this.state.delivered[id]) * timePerPackage : 0
            }
          })
        
      } else {
        this.setState({
          delivered: {
            ...this.state.delivered,
            [id]: (typeof this.state.props['track_spr_' + id] != 'undefined' ? this.state.props['track_spr_' + id] : this.state.new_spr[id])
          }
        });
        timePerPackage = 60 / this.state.deliveries_per_hour[id];
        this.setState({
          commentTime: {
            ...this.state.commentTime,
            [id]: (this.state.delivered[id] < this.state.deliveries_per_hour[id])?
              (this.state.deliveries_per_hour[id] - this.state.delivered[id]) * timePerPackage : 0
          }
        })
      }
    })
    
  }
  conv_duration = (current_length) => {
    var split = current_length.split(':');
    var new_length = parseInt(split[0]) + (parseInt(split[1]) / 60);
    return new_length;
    
  }
  submitHour = (event) => {
    event.preventDefault();
    var array = [];
    // this.state.props.map((prop,index)=>{
    //   // array=[...array,prop]
    // })
    // this.props.submitHour()
  }
  
  render() {
    return (
      <div>
        <a href="#" onClick={(event) => this.handleShow(event)}
           className="btn btn-report"> {this.state.value}</a>
        <Modal show={this.state.show} onHide={this.handleClose}
               id="reports_complete">
          <Modal.Header closeButton id="hourTitle">
            <h5 className="modal-title col-md-6" id="hourTitle" style={{width: 75 + '%'}}>{this.props.hour}</h5>
            <a href="http://scoobeez.com/dispatch/guide.pdf" target="_blank" style={{width: 20 + '%'}}>Open
              Guide</a>
          </Modal.Header>
          <Modal.Body>
            <form id="hourSubmit">
              <div className="row reports">
                <div className="col-md-12">
                  <table className="table table-reports-2 text-center" id="hourlyRouteReport">
                    <thead>
                    <tr>
                      <td width="35%"></td>
                      <td>Route</td>
                      <td>PKGs Delivered</td>
                      <td>UPD Update</td>
                    </tr>
                    </thead>
                    <tbody>
                    {/*{drivers.map((driver, index) => {*/}
                      {/*if (driver.removed != 1) {*/}
                        {/*//var hour = this.props.count;*/}
                        {/*// this.state.routes.length > 0 && this.state.routes.map((value, index) => {*/}
                        {/*//   if (value.crm_account_id == driver.crm_data.id) {*/}
                        {/*//     if (value) {*/}
                        {/*//       spr = value.route*/}
                        {/*//     } else {*/}
                        {/*//       spr = ""*/}
                        {/*//     }*/}
                        {/*//   }*/}
                        {/*// });*/}
                        {/**/}
                        {/*return (<tr key={index}>*/}
                          {/*<td>*/}
                            {/*<div className="row route-driver m-b-0 text-left">*/}
                              {/*<div className="col-md-12">*/}
                                {/*<p>{driver.crm_data.first_name + ' ' + driver.crm_data.last_name}</p></div>*/}
                            {/*</div>*/}
                          {/*</td>*/}
                          {/*<td>*/}
                            {/*<input disabled name={"user_" + driver.crm_data.id + "[]"} className="form-control"*/}
                                   {/*type="text"*/}
                                   {/*value={this.state.routes['driver_' + driver.crm_data.id] ?*/}
                                     {/*this.state.routes['driver_' + driver.crm_data.id].route : ''}/>*/}
                          {/*</td>*/}
                          {/*{*/}
                            {/*this.state.sprReports.length == 0 ?*/}
                              {/*<td><input name={"user_" + driver.crm_data.id + "[]"} className="form-control" type="text"*/}
                                         {/*id={"on_track_spr_" + driver.crm_data.id}*/}
                                         {/*value={*/}
                                           {/*this.state.props['track_spr_' + driver.crm_data.id] ||*/}
                                           {/*''}*/}
                                         {/*onChange={event => this.onInputChange(event, driver.crm_data.id, 'track_spr')}/>*/}
                              {/*</td> :*/}
                              {/*<td><input name={"user_" + driver.crm_data.id + "[]"}*/}
                                         {/*className="form-control"*/}
                                         {/*type="text"*/}
                                         {/*id={"on_track_spr_" + driver.crm_data.id}*/}
                                         {/*value={*/}
                                           {/*typeof this.state.props['track_spr_' + driver.crm_data.id] != 'undefined' ?*/}
                                           {/*this.state.props['track_spr_' + driver.crm_data.id] :*/}
                                          {/*typeof this.state.sprReports['driver_' + driver.crm_data.id] !='undefined' ?*/}
                                             {/*this.state.sprReports['driver_' + driver.crm_data.id].spr : ''*/}
                                         {/*}*/}
                                         {/*onChange={event => this.onInputChange(event, driver.crm_data.id, 'track_spr')}/>*/}
                              {/*</td>*/}
                          {/*}*/}
                          {/**/}
                          {/*{*/}
                            {/*(this.state.new_spr[driver.crm_data.id] == 0*/}
                              {/*|| this.state.props['track_spr_' + driver.crm_data.id] === ''*/}
                              {/*|| this.state.props['track_spr_' + driver.crm_data.id] == 0*/}
                            {/*) ?*/}
                              {/*<td>*/}
                                {/*<div id={"on_track_" + driver.crm_data.id}></div>*/}
                              {/*</td>*/}
                              {/*: (this.state.delivered[driver.crm_data.id] >= this.state.deliveries_per_hour[driver.crm_data.id]) ?*/}
                              {/*<td>*/}
                                {/*<div id={"on_track_" + driver.crm_data.id}>*/}
                                  {/*<span className="on_track">On Track</span></div>*/}
                              {/*</td>*/}
                              {/*: (  this.state.commentTime[driver.crm_data.id] < 6 ?*/}
                                {/*<td>*/}
                                  {/*<div id={"on_track_" + driver.crm_data.id}>*/}
                                    {/*<span*/}
                                      {/*className="off_track">{"Off Track by " + Math.ceil(this.state.commentTime[driver.crm_data.id]) + " mins"}</span>*/}
                                  {/*</div>*/}
                                {/*</td> :*/}
                                {/*<td>*/}
                                  {/*<div id={"on_track_" + driver.crm_data.id}><select*/}
                                    {/*// onchange="submitComment(' + id + ',' + hour + ',' + Math.ceil(commentTime) + ')"*/}
                                    {/*id="select_comment_' + id + '" className="select2">*/}
                                    {/*<option>Reason for Off Track</option>*/}
                                    {/*<option>Late Departure</option>*/}
                                    {/*<option>Late Sortation</option>*/}
                                    {/*<option>Late Line Haul</option>*/}
                                    {/*<option>Safety Related Delay</option>*/}
                                    {/*<option>Delivery Address Not On Route</option>*/}
                                    {/*<option>Customer Reattempts</option>*/}
                                    {/*<option>Station Debrief</option>*/}
                                    {/*<option>Device Issues</option>*/}
                                    {/*<option>DA Poor Performance</option>*/}
                                    {/*<option>Detour</option>*/}
                                    {/*<option>Long Lunch</option>*/}
                                    {/*<option>Long Break</option>*/}
                                  {/*</select></div>*/}
                                {/*</td>)*/}
                          {/*}*/}
                        {/*</tr>)*/}
                      {/*}*/}
                    {/*})}*/}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="empty-xs-20 empty-md-20"></div>
              <div className="row">
                <div className="col-md-8"></div>
                <div className="col-md-4">
                  <input type="hidden" name="hour" id="hourHour"/>
                  <input type="hidden" name="site_id" id="hourSiteID"/>
                  <input type="hidden" name="date" id="hourDate"/>
                  
                  
                  <a href="#"
                     onClick={(e) => {
                       this.submitHour(e)
                     }}
                     className="btn btn-yellow2 width100">Submit</a>
                </div>
              </div>
            </form>
          
          </Modal.Body>
        </Modal>
      
      </div>
    
    );
  }
}

function mapStateToProps(state) {
  return {
    comment_obj: state.comment,
    sprReport: state.sprReport,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({submitHour, check_track, spr_report, getShifts}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HourSubmit);
