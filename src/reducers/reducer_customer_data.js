export default function (state=[],action){
  switch(action.type)
  {
    case 'LOGIN':
      return action.payload;
    case 'LOGIN_ERR':
      return action.payload;
  }
  return state;
}