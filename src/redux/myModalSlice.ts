import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    show: false
}

const myModalSlice = createSlice({
    name:'myModal',
    initialState,
    reducers:{
        setShow:(state)=>{
            state.show = true
        },
        setClose:(state)=>{
            state.show = false
        }
    }
})

export const {setShow,setClose} = myModalSlice.actions
export default myModalSlice.reducer