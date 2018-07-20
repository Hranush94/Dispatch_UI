import { combineReducers } from 'redux';
import DispatcherReports from './reduser_dispathers_report';
import CustomerData from './reducer_customer_data';
import ResetPassword from './reducer_reset_password';
import DriversReducer from './reducer_drivers';
import MarkersReducer from './reducer_markers';
import OrdersReducer from './reducer_orders';
import LocationsReducer from './reducer_locations';
import WebsiteDataReducer from './reducer_settings';
import ShiftsReducer from './reducer_shifts';
import Drivers2Reducer from './reducer_drivers2';
import IsShown from './reducer_isShown';
import HourlyReducer from './reducer_hourly_report';
import ScheduleReducer from './reducer_schedule';
import DailyReport from './reducer_daily_report';
import VehicleInspections from './reducer_vehicle_inspections';
import Inspection from './reducer_inspection';
import Vehicles from './reducer_vehicles';
import Comments from './reducer_upd_totals';
import SPR_REPORT from './reducer_spr_report';
const rootReducer = combineReducers({
  dispatcher_reports: DispatcherReports,
  customer_data:CustomerData,
  reset_password_variable:ResetPassword,
  drivers: DriversReducer,
  markers:MarkersReducer,
  orders:OrdersReducer,
  locationSites:LocationsReducer,
  websiteData:WebsiteDataReducer,
  shifts:ShiftsReducer,
  drivers2:Drivers2Reducer,
  isShown:IsShown,
  hourly_report:HourlyReducer,
  schedules:ScheduleReducer,
  dailyReport:DailyReport,
  vehicleInspections:VehicleInspections,
  inspection:Inspection,
  vehicles:Vehicles,
  comment:Comments,
  sprReport:SPR_REPORT,
});

export default rootReducer;

