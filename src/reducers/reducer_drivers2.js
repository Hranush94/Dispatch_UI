export default function (state = [], action) {
  switch (action.type) {
    case 'DRIVERS2':
      return action.payload;
    case 'DRIVERS2_ERR':
      return action.payload;
  }
  return state;
}