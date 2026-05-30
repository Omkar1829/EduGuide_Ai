import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import courseService from "../../services/courseService";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await courseService.getAllCourses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourseById(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  "courses/fetchEnrolledCourses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await courseService.getEnrolledCourses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  "courses/enrollInCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await courseService.enrollInCourse(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCourseProgress = createAsyncThunk(
  "courses/updateCourseProgress",
  async ({ courseId, progress }, { rejectWithValue }) => {
    try {
      const response = await courseService.updateCourseProgress(courseId, progress);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unenrollFromCourse = createAsyncThunk(
  "courses/unenrollFromCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await courseService.unenrollFromCourse(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourses: (state) => {
      state.courses = [];
      state.pagination = initialState.pagination;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearCourseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload?.courses || action.payload || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload?.courses || action.payload || [];
        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses.push(action.payload);
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.enrolledCourses.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.enrolledCourses[index] = action.payload;
        }
      })
      .addCase(updateCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(unenrollFromCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unenrollFromCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = state.enrolledCourses.filter(
          (c) => c.courseId !== action.payload && c.id !== action.payload
        );
      })
      .addCase(unenrollFromCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourses, clearCurrentCourse, clearCourseError } =
  courseSlice.actions;
export default courseSlice.reducer;
