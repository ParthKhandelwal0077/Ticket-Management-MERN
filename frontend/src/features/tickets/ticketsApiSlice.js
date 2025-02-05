import { apiSlice } from '../../app/api/apiSlice';

export const ticketsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserTickets: builder.query({
      query: () => '/users/tickets',
      providesTags: (result) =>
        result
          ? [
              { type: 'Ticket', id: 'LIST' },
              ...result.data.map(({ _id }) => ({ type: 'Ticket', id: _id }))
            ]
          : [{ type: 'Ticket', id: 'LIST' }]
    }),
    getAssignedTickets: builder.query({
      query: () => '/users/agent/tickets/assigned',
      providesTags: ['Tickets']
    }),
    getAllTickets: builder.query({
      query: () => '/users/agent/tickets/all',
      providesTags: ['Tickets']
    }),
    getEscalatedTickets: builder.query({
      query: () => '/users/admin/tickets/escalated',
      providesTags: ['Tickets']
    }),
    getTicket: builder.query({
      query: (ticketId) => `/users/tickets/${ticketId}`,
      providesTags: (result, error, id) => [{ type: 'Ticket', id }]
    }),
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: '/users/tickets',
        method: 'POST',
        body: ticketData
      }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }]
    }),
    updateTicket: builder.mutation({
      query: ({ ticketId, ...ticketData }) => ({
        url: `/users/tickets/${ticketId}`,
        method: 'PATCH',
        body: ticketData
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: 'Ticket', id: ticketId },
        { type: 'Ticket', id: 'LIST' }
      ]
    }),
    escalateTicket: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/users/tickets/${id}/escalate`,
        method: 'POST',
        body: { reason }
      }),
      invalidatesTags: ['Tickets']
    }),
    addComment: builder.mutation({
      query: ({ ticketId, content, userId }) => ({
        url: `/users/tickets/${ticketId}/comments`,
        method: 'POST',
        body: { 
          content,
          user: userId,
          isInternal: false
        }
      }),
      async onQueryStarted({ ticketId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate the specific ticket to refetch with new comment
          dispatch(
            ticketsApiSlice.util.invalidatesTags([{ type: 'Ticket', id: ticketId }])
          );
        } catch (err) {
          console.error('Failed to add comment:', err);
        }
      }
    }),
    
  })
});

export const {
  useGetUserTicketsQuery,
  useGetAssignedTicketsQuery,
  useGetAllTicketsQuery,
  useGetEscalatedTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useEscalateTicketMutation,
  useAddCommentMutation,

} = ticketsApiSlice; 