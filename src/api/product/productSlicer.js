import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productServices from "./productServices"

const initialState = {
    data: null,
    productData: null,
    updateData: null,
    productList: null,
    isProductError: false,
    isProductSuccess: false,
    isProductLoading: false,
    isUpdateError: false,
    isUpdateSuccess: false,
    isUpdateLoading: false,
    isDeleteError: false,
    isDeleteSuccess: false,
    isDeleteLoading: false,
    message: '',
}

// Standard error handling for async thunk creation helper
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


/*
export const productSlicer = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetProduct: () => initialState, // Reset state to initial values
    },
    extraReducers: (builder) => {
        builder
            .addCase(addFavorite.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = true
                state.isProductError = false
                state.data = action.payload
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = false
                state.isProductError = true
                state.message = action.payload
                state.data = null
            })

            .addCase(getProductDetail.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductDetail.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = true
                state.isProductError = false
                state.productData = action.payload
            })
            .addCase(getProductDetail.rejected, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = false
                state.isProductError = true
                state.message = action.payload
                state.productData = null
            })

            .addCase(addProduct.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = true
                state.isProductError = false
                state.productData = action.payload
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = false
                state.isProductError = true
                state.message = action.payload
                state.productData = null
            })

            .addCase(getProducts.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = true
                state.isProductError = false
                state.productList = action.payload
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = false
                state.isProductError = true
                state.message = action.payload
                state.productList = null
            })

            .addCase(getProductBase.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductBase.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = true
                state.isProductError = false
                state.updateData = action.payload
            })
            .addCase(getProductBase.rejected, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = false
                state.isProductError = true
                state.message = action.payload
                state.updateData = null
            })

            .addCase(getProductPrice.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductPrice.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = true
                state.isProductError = false
                state.updateData = action.payload
            })
            .addCase(getProductPrice.rejected, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = false
                state.isProductError = true
                state.message = action.payload
                state.updateData = null
            })

            .addCase(getProductGallery.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductGallery.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = true
                state.isProductError = false
                state.updateData = action.payload
            })
            .addCase(getProductGallery.rejected, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = false
                state.isProductError = true
                state.message = action.payload
                state.updateData = null
            })

            .addCase(getProductVariants.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductVariants.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = true
                state.isProductError = false
                state.updateData = action.payload
            })
            .addCase(getProductVariants.rejected, (state, action) => {
                state.isProductLoading = false
                state.isProductSuccess = false
                state.isProductError = true
                state.message = action.payload
                state.updateData = null
            })

            .addCase(updateProduct.pending, (state) => {
                state.isUpdateLoading = true
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = true
                state.isUpdateError = false
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = false
                state.isUpdateError = true
                state.message = action.payload
            })

            .addCase(updateProductPrice.pending, (state) => {
                state.isUpdateLoading = true
            })
            .addCase(updateProductPrice.fulfilled, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = true
                state.isUpdateError = false
            })
            .addCase(updateProductPrice.rejected, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = false
                state.isUpdateError = true
                state.message = action.payload
            })

            .addCase(updateProductGallery.pending, (state) => {
                state.isUpdateLoading = true
            })
            .addCase(updateProductGallery.fulfilled, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = true
                state.isUpdateError = false
            })
            .addCase(updateProductGallery.rejected, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = false
                state.isUpdateError = true
                state.message = action.payload
            })

            .addCase(updateProductVariants.pending, (state) => {
                state.isUpdateLoading = true
            })
            .addCase(updateProductVariants.fulfilled, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = true
                state.isUpdateError = false
            })
            .addCase(updateProductVariants.rejected, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = false
                state.isUpdateError = true
                state.message = action.payload
            })

            .addCase(updateProductRequestForm.pending, (state) => {
                state.isUpdateLoading = true
            })
            .addCase(updateProductRequestForm.fulfilled, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = true
                state.isUpdateError = false
            })
            .addCase(updateProductRequestForm.rejected, (state, action) => {
                state.isUpdateLoading = false
                state.isUpdateSuccess = false
                state.isUpdateError = true
                state.message = action.payload
            })

            .addCase(deleteProduct.pending, (state) => {
                state.isDeleteLoading = true
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = true
                state.isDeleteError = false
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = false
                state.isDeleteError = true
                state.message = action.payload
            })

            .addCase(deleteProductVariants.pending, (state) => {
                state.isDeleteLoading = true
            })
            .addCase(deleteProductVariants.fulfilled, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = true
                state.isDeleteError = false
            })
            .addCase(deleteProductVariants.rejected, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = false
                state.isDeleteError = true
                state.message = action.payload
            })

            .addCase(deleteProductGallery.pending, (state) => {
                state.isDeleteLoading = true
            })
            .addCase(deleteProductGallery.fulfilled, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = true
                state.isDeleteError = false
            })
            .addCase(deleteProductGallery.rejected, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = false
                state.isDeleteError = true
                state.message = action.payload
            })

            .addCase(deleteProductRequestForm.pending, (state) => {
                state.isDeleteLoading = true
            })
            .addCase(deleteProductRequestForm.fulfilled, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = true
                state.isDeleteError = false
            })
            .addCase(deleteProductRequestForm.rejected, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = false
                state.isDeleteError = true
                state.message = action.payload
            })

            .addCase(deleteProductBasePrice.pending, (state) => {
                state.isDeleteLoading = true
            })
            .addCase(deleteProductBasePrice.fulfilled, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = true
                state.isDeleteError = false
            })
            .addCase(deleteProductBasePrice.rejected, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = false
                state.isDeleteError = true
                state.message = action.payload
            })

            .addCase(deleteImageFromGallery.pending, (state) => {
                state.isDeleteLoading = true
            })
            .addCase(deleteImageFromGallery.fulfilled, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = true
                state.isDeleteError = false
            })
            .addCase(deleteImageFromGallery.rejected, (state, action) => {
                state.isDeleteLoading = false
                state.isDeleteSuccess = false
                state.isDeleteError = true
                state.message = action.payload
            })
    }
})

export const { resetProduct } = productSlicer.actions
export default productSlicer.reducer
*/