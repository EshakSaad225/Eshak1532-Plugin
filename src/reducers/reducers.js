import * as actions from '../actions/actions';
const INITIAL_STATE={
  features:[],
};

const reducer=(state=INITIAL_STATE,action)=>{
  switch(action.type){
    case actions.SET_FEATURES:
      return{
        ...state,
        features:[...action.payload],
      };
      default:
        return{...state };
  }
};
export default reducer;