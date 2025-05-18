import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productServices from "./productServices"

// Initial state for product slice
const initialState = {
    data: null, // General data (e.g., for addFavorite)
    productData: null, // Single product details
    updateData: null, // Data for sub-domain fetches (base, price, gallery, variants)
    productList: null, // List of products
    isError: false, // Error state for all operations
    isSuccess: false, // Success state for all operations
    isLoading: false, // Loading state for all operations
    message: '', // Error message
    operation: null, // Tracks current operation (e.g., 'add', 'update', 'delete')
}

// Helper to create async thunks with standardized error handling
const createProductThunk = (name, serviceCall) =>
    createAsyncThunk(`product/${name}`, async (data, thunkAPI) => {
        try {
            const response = await serviceCall(data);
            return response;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    });

// Define all product-related thunks
export const addFavorite = createProductThunk("addFavorite", productServices.addFavorite);
export const getProductDetail = createProductThunk("detail", productServices.getProductDetail);
export const addProduct = createProductThunk("add", productServices.addProduct);
export const updateProduct = createProductThunk("update", productServices.updateProduct);
export const updateProductPrice = createProductThunk("update/price", productServices.updateProductPrice);
export const updateProductGallery = createProductThunk("update/gallery", productServices.updateProductGallery);
export const updateProductVariants = createProductThunk("update/variants", productServices.updateProductVariants);
export const updateProductRequestForm = createProductThunk("update/request-form", productServices.updateProductRequestForm);
export const getProducts = createProductThunk("get", productServices.getProducts);
export const getProductBase = createProductThunk("get/base", productServices.getProductBase);
export const getProductPrice = createProductThunk("get/price", productServices.getProductPrice);
export const getProductGallery = createProductThunk("get/gallery", productServices.getProductGallery);
export const getProductVariants = createProductThunk("get/variants", productServices.getProductVariants);
export const deleteProduct = createProductThunk("delete", productServices.deleteProduct);
export const deleteProductVariants = createProductThunk("delete/variants", productServices.deleteProductVariants);
export const deleteProductGallery = createProductThunk("delete/gallery", productServices.deleteProductGallery);
export const deleteProductRequestForm = createProductThunk("delete/request-form", productServices.deleteProductRequestForm);
export const deleteProductBasePrice = createProductThunk("delete/base-price", productServices.deleteProductBasePrice);
export const deleteImageFromGallery = createProductThunk("delete/gallery/image", productServices.deleteImageFromGallery);

// Helper to build reducer cases for each thunk
const buildReducerCases = (builder, action, operation, stateField = null) => {
    builder
        .addCase(action.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            state.operation = operation;
        })
        .addCase(action.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.operation = operation;
            if (stateField) {
                state[stateField] = action.payload;
            }
        })
        .addCase(action.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = action.payload;
            state.operation = operation;
            if (stateField) {
                state[stateField] = null;
            }
        });
};

export const productSlicer = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // Reset state to initial values
        resetProduct: () => initialState,
    },
    extraReducers: (builder) => {
        // CRUD Operations
        buildReducerCases(builder, addFavorite, 'addFavorite', 'data');
        buildReducerCases(builder, getProductDetail, 'getDetail', 'productData');
        buildReducerCases(builder, addProduct, 'addProduct', 'productData');
        buildReducerCases(builder, getProducts, 'getProducts', 'productList');

        // Sub-domain Fetch Operations
        buildReducerCases(builder, getProductBase, 'getBase', 'updateData');
        buildReducerCases(builder, getProductPrice, 'getPrice', 'updateData');
        buildReducerCases(builder, getProductGallery, 'getGallery', 'updateData');
        buildReducerCases(builder, getProductVariants, 'getVariants', 'updateData');

        // Update Operations
        buildReducerCases(builder, updateProduct, 'updateProduct');
        buildReducerCases(builder, updateProductPrice, 'updatePrice');
        buildReducerCases(builder, updateProductGallery, 'updateGallery');
        buildReducerCases(builder, updateProductVariants, 'updateVariants');
        buildReducerCases(builder, updateProductRequestForm, 'updateRequestForm');

        // Delete Operations
        buildReducerCases(builder, deleteProduct, 'deleteProduct');
        buildReducerCases(builder, deleteProductVariants, 'deleteVariants');
        buildReducerCases(builder, deleteProductGallery, 'deleteGallery');
        buildReducerCases(builder, deleteProductRequestForm, 'deleteRequestForm');
        buildReducerCases(builder, deleteProductBasePrice, 'deleteBasePrice');
        buildReducerCases(builder, deleteImageFromGallery, 'deleteImageFromGallery');
    }
});

export const { resetProduct } = productSlicer.actions;
export default productSlicer.reducer;