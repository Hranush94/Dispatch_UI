export default function (state=[],action){
  switch(action.type)
  { case 'SCHEDULE':
    return action.payload;
    case 'SCHEDULE_ERR':
      return action.payload;
  }
  return state;
}