import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const backendURL = 'https://xhgk38wg-3100.inc1.devtunnels.ms/'

export const userLogin = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        `${backendURL}api/admin/login`,
        { username, password },
        config
      )

      console.log(data,"data")

      // store user's token in local storage
      localStorage.setItem('userToken', data.userToken)

      return data
    } catch (error) {
      console.log(error.message, "error.message");
      console.log(error.response?.data, "error.response.data");
    
      if (error.response && error.response.data) {
        const data = error.response.data;
    
        if (data.message) {
          return rejectWithValue(data.message);
        } else if (data.error) {
          return rejectWithValue(data.error); // Handles your Joi validation
        } else {
          return rejectWithValue("Something went wrong");
        }
      } else {
        return rejectWithValue(error.message);
      }
    }
    
  }
)

export const registerUser = createAsyncThunk(
  'api/admin/signup',
  async ({ name, email, username, password, confirm_password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

     const response= await axios.post(
        `${backendURL}api/admin/signup`,
        { name, email, username, password, confirm_password },
        config
      )
      console.log(response,"response")
      return response
    } catch (error) {
      console.log(error.message, "error.message");
      console.log(error.response?.data, "error.response.data");
    
      if (error.response && error.response.data) {
        const data = error.response.data;
    
        if (data.message) {
          return rejectWithValue(data.message);
        } else if (data.error) {
          return rejectWithValue(data.error);
        } else {
          return rejectWithValue("Something went wrong");
        }
      } else {
        return rejectWithValue(error.message);
      }
    }
    
  }
)
