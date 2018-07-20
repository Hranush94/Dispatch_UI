export default function (state=[],action){
  switch(action.type)
  {
    case 'INVENTORY':
      return action.payload;
    case 'INVENTORY_ERR':
      return action.payload;
  }
  return state;
}