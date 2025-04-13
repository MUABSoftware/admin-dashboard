import { createSlice, PayloadAction } from '@reduxjs/toolkit';
 
 import Product from '../digital-products/ProductsTable';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const businessProductSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setDigitalProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    updateProductStatus: (state, action: PayloadAction<{ productId: string; status: string }>) => {
      const { productId, status } = action.payload;
      const product = state.products.find(p => p._id === productId);
      if (product) {
        product.status = status as "active" | "rejected" | "stopped";
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setDigitalProducts, updateProductStatus, setLoading, setError } = businessProductSlice.actions;
export default businessProductSlice.reducer; 