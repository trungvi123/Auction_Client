import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    show: false
}

const searchModalSlice = createSlice({
    name:'myModal',
    initialState,
    reducers:{
        setShowSearch:(state)=>{
            state.show = true
        },
        setCloseSearch:(state)=>{
            state.show = false
        }
    }
})

export const {setShowSearch,setCloseSearch} = searchModalSlice.actions
export default searchModalSlice.reducer