export default function (state=[],action){
  switch(action.type)
  {
    case 'SETTINGS':
      return action.payload;
    case 'SETTINGS_ERR':
      return action.payload;
  }
  return state;
}