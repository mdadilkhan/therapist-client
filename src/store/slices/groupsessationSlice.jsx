import {createSlice} from '@reduxjs/toolkit'



const groupsessationSlice=createSlice({
    name:"groupsessationDetails",
    initialState:{},
    reducers:{
        groupsessationDetails(state,action){
            Object.assign(state, action.payload);
        },
        resetState: () => initialState,
    }
})

export default  groupsessationSlice.reducer 
export const{groupsessationDetails,resetState} = groupsessationSlice.actions