export default function (state=[],action){
  switch(action.type)
  {
    case 'INSPECTION':
      return action.payload;
    case 'INSPECTION_ERR':
      return action.payload;
  }
  return state;
}