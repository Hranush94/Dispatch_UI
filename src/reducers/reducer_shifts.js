export default function (state=[],action){
  switch(action.type)
  {
    case 'SHIFTS':
      return action.payload;
    case 'SHIFTS_ERR':
      return action.payload;
  }
  return state;
}