export default function (state=[],action){
  switch(action.type)
  {
    case 'GET_DRIVERS':
      return state.concat(state, ...action.payload);
  }
  return state;
}