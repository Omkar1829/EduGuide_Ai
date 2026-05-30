import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import recommendationService from "../../services/recommendationService";

export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetchRecommendations",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await recommendationService.getRecommendations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecommendationById = createAsyncThunk(
  "recommendations/fetchRecommendationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await recommendationService.getRecommendationById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptRecommendation = createAsyncThunk(
  "recommendations/acceptRecommendation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await recommendationService.acceptRecommendation(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectRecommendation = createAsyncThunk(
  "recommendations/rejectRecommendation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await recommendationService.rejectRecommendation(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  recommendations: [],
  currentRecommendation: null,
  loading: false,
  error: null,
};

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
    clearCurrentRecommendation: (state) => {
      state.currentRecommendation = null;
    },
    clearRecommendationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations =
          action.payload?.recommendations || action.payload || [];
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRecommendationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecommendation = action.payload;
      })
      .addCase(fetchRecommendationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(acceptRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.recommendations.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.recommendations[index] = action.payload;
        }
        if (state.currentRecommendation?.id === action.payload.id) {
          state.currentRecommendation = action.payload;
        }
      })
      .addCase(acceptRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(rejectRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.recommendations.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.recommendations[index] = action.payload;
        }
        if (state.currentRecommendation?.id === action.payload.id) {
          state.currentRecommendation = action.payload;
        }
      })
      .addCase(rejectRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearRecommendations,
  clearCurrentRecommendation,
  clearRecommendationError,
} = recommendationSlice.actions;
export default recommendationSlice.reducer;
