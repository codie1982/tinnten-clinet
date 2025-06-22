import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bidService from "./bidServices";

// Initial state for form slice
const initialState = {
  bidResult: null, // Details of a single form
  isLoading: false, // Loading state for all operations
  isSuccess: false, // Success state for all operations
  isError: false, // Error state for all operations
  message: "", // Error message
  operation: null, // Tracks current operation (e.g., 'add', 'getAll', 'update')
};

// Reusable thunk helper with standardized error handling
const createFormThunk = (name, serviceCall) =>
  createAsyncThunk(`bid/${name}`, async (data, thunkAPI) => {
    try {
      const response = await serviceCall(data);
      return response;
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  });

// Thunks aligned with formServices.js
export const expand = createFormThunk("expand", bidService.expand);
export const searchProductsBySemanticMatch = createFormThunk("search", bidService.search);

// Helper to build reducer cases for each thunk
const buildReducerCases = (builder, action, operation, stateField = null) => {
  builder
    .addCase(action.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.operation = operation;
    })
    .addCase(action.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.operation = operation;
      if (stateField) {
        state[stateField] = action.payload.data;
      }
    })
    .addCase(action.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.message = action.payload.message;
      state.operation = operation;
      if (stateField) {
        state[stateField] = null;
      }
    });
};

// Slice
const bidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    // Reset state to initial values
    resetBid: () => initialState,
  },
  extraReducers: (builder) => {
    // CRUD Operations
    buildReducerCases(builder, expand, "expand", "llmDescription");
    buildReducerCases(builder, searchProductsBySemanticMatch, "search", "results");

  },
});

export const { resetBid } = bidSlice.actions;
export default bidSlice.reducer;