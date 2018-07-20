export default function (state=[],action){
  switch(action.type)
  {
    case 'SPR':
      return action.payload;
    case 'SPR_ERR':
      return action.payload;
  }
  return state;
}