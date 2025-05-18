import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import formService from "./dynamicformServices";

// Başlangıç durumu
const initialState = {
  formList: null,
  formDetail: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Reusable thunk helper
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

// Thunks
export const addForm = createFormThunk("add", formService.addForm);
export const getForms = createFormThunk("getAll", formService.getForms);
export const getFormDetail = createFormThunk("getDetail", formService.getFormDetail);
export const updateForm = createFormThunk("update", ({ formid, data }) => formService.updateForm(formid, data));
export const deleteForm = createFormThunk("delete", formService.deleteForm);
export const updateFormField = createFormThunk("updateField", ({ formid, fieldid, data }) =>
  formService.updateFormField(formid, fieldid, data)
);
export const deleteFormField = createFormThunk("deleteField", ({ formid, fieldid }) =>
  formService.deleteFormField(formid, fieldid)
);

// Slice
const formSlice = createSlice({
  name: "dynamicform",
  initialState,
  reducers: {
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.formDetail = action.payload.data;
      })
      .addCase(addForm.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getForms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getForms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.formList = action.payload.data;
      })
      .addCase(getForms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getFormDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFormDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.formDetail = action.payload.data;
      })
      .addCase(getFormDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(updateForm.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.formDetail = action.payload.data;
      })

      .addCase(deleteForm.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.formDetail = null;
      })

      .addCase(updateFormField.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.formDetail = action.payload.data;
      })

      .addCase(deleteFormField.fulfilled, (state, action) => {
        state.isSuccess = true;
      });
  },
});

export const { resetForm } = formSlice.actions;
export default formSlice.reducer;