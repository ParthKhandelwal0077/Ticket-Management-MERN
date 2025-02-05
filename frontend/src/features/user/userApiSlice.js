import { apiSlice } from '../../app/api/apiSlice'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['Profile']
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: userData
      }),
      invalidatesTags: ['Profile']
    }),getAllUsers: builder.query({
        query: () => '/users',
        providesTags: ['Users']
      }),
      getUser: builder.query({
        query: (id) => `/users/${id}`,
        providesTags: ['Users']
      }),
      createUser: builder.mutation({
        query: (userData) => ({
          url: '/users',
          method: 'POST',
          body: userData
        }),
        invalidatesTags: ['Users']
      }),
      updateUser: builder.mutation({
        query: ({ id, ...userData }) => ({
          url: `/users/${id}`,
          method: 'PUT',
          body: userData
        }),
        invalidatesTags: ['Users']
      }),
      deleteUser: builder.mutation({
        query: (id) => ({
          url: `/users/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['Users']
      })

  })
})

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,

  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
 
} = userApiSlice
