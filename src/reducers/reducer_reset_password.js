export default function (state=[],action){
  switch(action.type)
  {
    case 'RESET':
     // console.log(action.payload)
      return action.payload;
    case 'RESET_ERR':
        console.log('reducer',[...action.payload, ...state][0].status)
      return [...action.payload] ;
    case 'VERIFY':
     return [...state,...action.payload] ;
    case 'VERIFY':
     return [...state,...action.payload];
  }
  return state;
}