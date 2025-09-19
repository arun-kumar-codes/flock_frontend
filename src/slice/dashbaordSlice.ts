import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface FilterState {
  activeFilter: string | null
}

const initialState: FilterState = {
  activeFilter: null,
}

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setActiveFilter: (state, action: PayloadAction<string | null>) => {
      state.activeFilter = action.payload
    },
    clearFilter: (state) => {
      state.activeFilter = null
    },
  },
})

export const { setActiveFilter, clearFilter } = filterSlice.actions
export default filterSlice.reducer
