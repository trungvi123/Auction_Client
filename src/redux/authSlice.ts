import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    email: ''
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setEmail: ()=>{

        }
    }
})

export const {setEmail} = authSlice.actions

export default authSlice.reducer