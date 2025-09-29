import { MOCK_DATA } from "@/util/mockData";
import type { User } from "@/util/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



const initialState: User = MOCK_DATA.user;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { setUserName } = userSlice.actions;
export default userSlice.reducer;
