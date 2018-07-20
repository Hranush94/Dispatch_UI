export default function (state=[],action){
  switch(action.type)
  {
    case 'PULL_DISPATCHERS_REPORT':
      return action.payload;
    case 'PULL_DISPATCHERS_REPORT_ERR':
      return action.payload;
  }
  return state;
}