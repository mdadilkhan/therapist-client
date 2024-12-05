import {createSlice} from '@reduxjs/toolkit'



const groupsessationSlice=createSlice({
    name:"groupsessationDetails",
    initialState:{},
    reducers:{
        groupsessationDetails(state,action){
            Object.assign(state, action.payload);
        },
    }
})

export default  groupsessationSlice.reducer 
export const{groupsessationDetails} = groupsessationSlice.actions