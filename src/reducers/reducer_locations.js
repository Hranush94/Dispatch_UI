export default function (state = [], action) {
  switch (action.type) {
    case 'LOCATIONS':
      return action.payload;
    case 'LOCATIONS_ERR':
      return action.payload;
  }
  return state;
}