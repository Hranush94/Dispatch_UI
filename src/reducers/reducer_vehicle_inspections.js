export default function (state=[],action){
  switch(action.type)
  {
    case 'VEHICLE_INSPECTIONS':
      return action.payload;
    case 'VEHICLE_INSPECTIONS_ERR':
      return action.payload;
  }
  return state;
}