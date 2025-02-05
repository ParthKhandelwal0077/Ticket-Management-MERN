import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null },
    reducers: {
        setCredentials: (state, action) => {
            console.log('Setting credentials:', action.payload)
            // Handle both nested and flat data structures
            const payload = action.payload.data || action.payload
            const { user, accessToken } = payload
            state.user = user
            state.token = accessToken
        },
        logOut: (state) => {
            state.user = null
            state.token = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
// Only access user.id if user exists
export const selectCurrentUserId = (state) => state.auth.user?.id