import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import formService from "./dynamicformServices";

// Initial state for form slice
const initialState = {
  formList: null, // List of forms for a company
  formDetail: null, // Details of a single form
  isLoading: false, // Loading state for all operations
  isSuccess: false, // Success state for all operations
  isError: false, // Error state for all operations
  message: "", // Error message
  operation: null, // Tracks current operation (e.g., 'add', 'getAll', 'update')
};

// Reusable thunk helper with standardized error handling
const createFormThunk = (name, serviceCall) =>
  createAsyncThunk(`form/${name}`, async (data, thunkAPI) => {
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
export const addForm = createFormThunk("add", formService.addForm);
export const getForms = createFormThunk("getAll", formService.getForms);
export const getFormDetail = createFormThunk("getDetail", formService.getFormDetail);
export const updateForm = createFormThunk("update", formService.updateForm);
export const deleteForm = createFormThunk("delete", formService.deleteForm);
export const updateFormField = createFormThunk("updateField", formService.updateFormField);
export const deleteFormField = createFormThunk("deleteField", formService.deleteFormField);

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
const formSlice = createSlice({
  name: "dynamicform",
  initialState,
  reducers: {
    // Reset state to initial values
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    // CRUD Operations
    buildReducerCases(builder, addForm, "addForm", "formDetail");
    buildReducerCases(builder, getForms, "getForms", "formList");
    buildReducerCases(builder, getFormDetail, "getFormDetail", "formDetail");
    buildReducerCases(builder, updateForm, "updateForm", "formDetail");
    buildReducerCases(builder, deleteForm, "deleteForm", "formDetail");

    // Form Field Operations
    buildReducerCases(builder, updateFormField, "updateFormField", "formDetail");
    buildReducerCases(builder, deleteFormField, "deleteFormField");
  },
});

export const { resetForm } = formSlice.actions;
export default formSlice.reducer;