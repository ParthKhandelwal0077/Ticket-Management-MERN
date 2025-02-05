import { apiSlice } from '../../app/api/apiSlice';

export const articlesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: () => '/articles',
      providesTags: ['Articles']
    }),
    getArticle: builder.query({
      query: (id) => `/articles/${id}`,
      providesTags: ['Articles']
    }),
    createArticle: builder.mutation({
      query: (articleData) => ({
        url: '/articles',
        method: 'POST',
        body: articleData
      }),
      invalidatesTags: ['Articles']
    }),
    updateArticle: builder.mutation({
      query: ({ id, ...articleData }) => ({
        url: `/articles/${id}`,
        method: 'PUT',
        body: articleData
      }),
      invalidatesTags: ['Articles']
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Articles']
    }),
    toggleLikeArticle: builder.mutation({
      query: (id) => ({
        url: `/articles/${id}/like`,
        method: 'POST'
      }),
      invalidatesTags: ['Articles']
    }),
    addComment: builder.mutation({
      query: ({ articleId, content }) => ({
        url: `/articles/${articleId}/comments`,
        method: 'POST',
        body: { content }
      }),
      invalidatesTags: ['Articles']
    })
  })
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useToggleLikeArticleMutation,
  useAddCommentMutation
} = articlesApiSlice; 