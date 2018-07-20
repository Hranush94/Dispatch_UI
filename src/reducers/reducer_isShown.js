  export default function (state = false, action) {
    switch (action.type) {
      case 'isShown':
        return action.payload;
          }
    return state;
  }
