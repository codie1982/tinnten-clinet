import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contentService from "./contentServices";

const initialState = {
  documents: [],
  collections: [],
  currentDocument: null,
  mediaFiles: [],
  availableTags: [],
  count: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

const extractError = (error) =>
  error.response?.data?.message || error.message || error.toString();

// Documents
export const fetchDocuments = createAsyncThunk(
  "content/fetchDocuments",
  async (params, { rejectWithValue }) => {
    try {
      return await contentService.listDocuments(params);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const fetchDocumentDetail = createAsyncThunk(
  "content/fetchDocumentDetail",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      return await contentService.getDocumentDetail(id, params);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const updateDocument = createAsyncThunk(
  "content/updateDocument",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await contentService.updateDocument(id, data);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const uploadDocuments = createAsyncThunk(
  "content/uploadDocuments",
  async (formData, { rejectWithValue }) => {
    try {
      return await contentService.uploadDocuments(formData);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const importDocumentUrl = createAsyncThunk(
  "content/importDocumentUrl",
  async (data, { rejectWithValue }) => {
    try {
      return await contentService.importDocumentFromUrl(data);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

// Bulk operations
export const bulkIndexDocs = createAsyncThunk(
  "content/bulkIndex",
  async (data, { rejectWithValue }) => {
    try {
      return await contentService.bulkIndexDocuments(data);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const bulkDeleteDocs = createAsyncThunk(
  "content/bulkDelete",
  async (data, { rejectWithValue }) => {
    try {
      return await contentService.bulkDeleteDocuments(data);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

// Collections
export const fetchCollections = createAsyncThunk(
  "content/fetchCollections",
  async (params, { rejectWithValue }) => {
    try {
      return await contentService.listCollections(params);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const createCollection = createAsyncThunk(
  "content/createCollection",
  async (data, { rejectWithValue }) => {
    try {
      return await contentService.createCollection(data);
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    resetContent: () => initialState,
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDocuments
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = action.payload?.data?.items || [];
        state.mediaFiles = action.payload?.data?.mediaFiles || [];
        state.availableTags = action.payload?.data?.availableTags || [];
        state.count = action.payload?.data?.count || 0;
        state.page = action.payload?.data?.page || 1;
        state.limit = action.payload?.data?.limit || 20;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // fetchDocumentDetail
      .addCase(fetchDocumentDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDocumentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentDocument = action.payload?.data?.item || null;
      })
      .addCase(fetchDocumentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // uploadDocuments
      .addCase(uploadDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newDocs = action.payload?.data?.successfullUploads || [];
        state.documents = [...newDocs, ...state.documents];
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // updateDocument
      .addCase(updateDocument.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated?.id) {
          state.documents = state.documents.map((d) =>
            d.id === updated.id ? { ...d, ...updated } : d
          );
          if (state.currentDocument?.id === updated.id) {
            state.currentDocument = { ...state.currentDocument, ...updated };
          }
        }
      })

      // bulkDeleteDocs
      .addCase(bulkDeleteDocs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })

      // fetchCollections
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.collections = action.payload?.data?.items || [];
      })

      // createCollection
      .addCase(createCollection.fulfilled, (state, action) => {
        const newCol = action.payload?.data;
        if (newCol) state.collections = [newCol, ...state.collections];
      });
  },
});

export const { resetContent, clearCurrentDocument } = contentSlice.actions;
export default contentSlice.reducer;
