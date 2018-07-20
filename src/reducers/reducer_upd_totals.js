export default function (state=[],action){
  switch(action.type)
  {
    case 'UPD':
      return action.payload;
    case 'UPD_ERR':
      return action.payload;
  }
  return state;
}