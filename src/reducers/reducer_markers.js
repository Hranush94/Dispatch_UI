export default function (state , action) {
  switch (action.type){
    case 'MARKER_CLICKED':
      return  action.payload;
    default:
      return []
    
  }
}