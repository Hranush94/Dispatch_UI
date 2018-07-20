export default function (state = [], action) {
  switch (action.type) {
    case 'HOURLY':
      return action.payload;
    case 'HOURLY_ERR':
      return action.payload;
  }
  return state;
}