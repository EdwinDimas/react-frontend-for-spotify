import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from './config';

export const usuariosApi = createApi({
    reducerPath: 'usuariosApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getUsuario: builder.query({
            query: () => "/me"
        }),
        getLikedSongs: builder.query({
            query: ({limit, offset}) =>{
                return {
                    url: "/me/tracks",
                    params: {
                        limit,
                        offset
                    }
                }
            } 
        }),
        getPlayLists: builder.query({
            query: ({ user_id }) => {
                return {
                    url: `/users/${user_id}/playlists`,
                }
            }
        }),
        getTrack: builder.query({
            query: ({ track_id }) => {
                return {
                    url: `/tracks/${track_id}`,
                }
            }
        }),
        addSongToQueue: builder.mutation({
            query: ({ uri, device_id }) => {
                return {
                    method: "POST",
                    url: `/me/player/queue`,
                    params: {
                        uri: uri,
                        device_id: device_id
                    }
                }
            }
        }),
        transferPlayback: builder.mutation({
            query: ({ play, device_id }) => {
                return {
                    method: "PUT",
                    url: `/me/player/`,
                    body: {
                        play: play,
                        device_ids:[device_id]
                    }
                }
            }
        }),
        playResume: builder.mutation({
            query: ({ offset_uri, device_id, context_uri, uris }) => {
                return {
                    method: "PUT",
                    url: `/me/player/play`,
                    body: {
                        "uris": uris
                    },
                    params: {
                        device_id: device_id
                    }
                }
            }
        }),
    })
});

export const {
    useGetUsuarioQuery,
    useGetLikedSongsQuery,
    useGetPlayListsQuery,
    useGetTrackQuery,
    useTransferPlaybackMutation,
    usePlayResumeMutation
} = usuariosApi;