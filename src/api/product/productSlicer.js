import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productServices from "./productServices"

const initialState = {
    data: null,
    productData: null,
    updateData: null,
    productList: null,
    isProductError: false,
    isProcudtSuccess: false,
    isProductLoading: false,
    isUpdateError: false,
    isUpdateSuccess: false,
    isUpdateLoading: false,
    message: '',
}

// Standart hata işleme ile async thunk oluşturma yardımcısı
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
export const getProducts = createProductThunk("get", productServices.getProducts);
export const getProductBase = createProductThunk("get/base", productServices.getProductBase);
export const getProductPrice = createProductThunk("get/price", productServices.getProductPrice);
export const getProductGallery = createProductThunk("get/gallery", productServices.getProductGallery);
export const getProductVariants = createProductThunk("get/variants", productServices.getProductVariants);

export const productSlicer = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetProduct: () => initialState, // Durumu başlangıç değerine sıfırla
    },
    extraReducers: (builder) => {

        builder
            .addCase(addFavorite.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = action.payload
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.data = null
            })

            .addCase(getProductDetail.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductDetail.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProcudtSuccess = true
                state.isProductError = false
                state.productData = action.payload.data
            })
            .addCase(getProductDetail.rejected, (state, action) => {
                state.isLoading = false
                state.isProcudtSuccess = false
                state.isProductError = true
                state.productData = null
            })

            .addCase(addProduct.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProcudtSuccess = true
                state.isProductError = false
                state.productData = action.payload.data
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isLoading = false
                state.isProcudtSuccess = false
                state.isProductError = true
                state.productData = null
            })

            .addCase(getProducts.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProcudtSuccess = true
                state.isProductError = false
                state.productList = action.payload.data
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false
                state.isProcudtSuccess = false
                state.isProductError = true
                state.productList = null
            })

            .addCase(getProductBase.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductBase.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProcudtSuccess = true
                state.isProductError = false
                state.updateData = action.payload.data
            })
            .addCase(getProductBase.rejected, (state, action) => {
                state.isLoading = false
                state.isProcudtSuccess = false
                state.isProductError = true
                state.updateData = null
            })
            .addCase(getProductPrice.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductPrice.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProcudtSuccess = true
                state.isProductError = false
                state.updateData = action.payload.data
            })
            .addCase(getProductPrice.rejected, (state, action) => {
                state.isLoading = false
                state.isProcudtSuccess = false
                state.isProductError = true
                state.updateData = null
            })

            .addCase(getProductGallery.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductGallery.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProcudtSuccess = true
                state.isProductError = false
                state.updateData = action.payload.data
            })
            .addCase(getProductGallery.rejected, (state, action) => {
                state.isLoading = false
                state.isProcudtSuccess = false
                state.isProductError = true
                state.updateData = null
            })

            .addCase(getProductVariants.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductVariants.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProcudtSuccess = true
                state.isProductError = false
                state.updateData = action.payload.data
            })
            .addCase(getProductVariants.rejected, (state, action) => {
                state.isLoading = false
                state.isProcudtSuccess = false
                state.isProductError = true
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
            })
    }
})
export const { resetProduct } = productSlicer.actions
export default productSlicer.reducer

