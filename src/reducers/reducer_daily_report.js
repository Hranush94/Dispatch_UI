export default function (state=[],action){
  switch(action.type)
  {
    case 'DAILY_REPORT':
      return action.payload;
  }
  return state;
}