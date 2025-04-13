import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessSpace, BusinessSpacesState } from '@src/types';


const initialState: BusinessSpacesState = {
  businessSpaces: [],
};

const businessSpacesSlice = createSlice({
  name: 'businessSpaces',
  initialState,
  reducers: {
    setBusinessSpaces: (state, action: PayloadAction<BusinessSpace[]>) => {
      state.businessSpaces = action.payload;
    },
    updateBusinessStatus: (state, action: PayloadAction<{ id: string; status: "PENDING" | "ACTIVE" | "INACTIVE" }>) => {
      const { id, status } = action.payload;
      const business = state.businessSpaces.find((b) => b._id === id);
      if (business) {
        business.status = status;
      }
    },
  },
});

export const { setBusinessSpaces, updateBusinessStatus } = businessSpacesSlice.actions;
export default businessSpacesSlice.reducer;
