import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL, LOGIN_SERVER_URL } from './config';
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
  } from '@reduxjs/toolkit/query'
  import { Mutex } from 'async-mutex'


// create a new mutex
const mutex = new Mutex()
const baseQuery = fetchBaseQuery({ 
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem('token')
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers;
    },
})

const baseAuthQuery = fetchBaseQuery({ baseUrl: LOGIN_SERVER_URL })

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      const refresh_token = localStorage.getItem('refresh_token');
      try {
        const refreshResult = await baseAuthQuery(
          ({
            url: '/refresh_token',
            params: {refresh_token}
          }),
          api,
          extraOptions
        )
        if (refreshResult.data) {
            const { data } : any = refreshResult
            const token : any = data.access_token;
            const refresh_token = data.refresh_token;
            localStorage.setItem('token', token);
            if(refresh_token){
                localStorage.setItem('refresh_token', refresh_token);
            }
            
          // retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
            console.log({refreshResult})
          // LOGOUT
        }
      } catch(e) {
        console.log(e)
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const usuariosApi = createApi({
    reducerPath: 'usuariosApi',
    baseQuery: baseQueryWithReauth,
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
            query: ({ offset, device_id, context_uri, uris, position_ms }) => {
                return {
                    method: "PUT",
                    url: `/me/player/play`,
                    body: {
                        uris,
                        offset,
                        position_ms
                    },
                    params: {
                        device_id: device_id
                    }
                }
            }
        }),
        pause: builder.mutation({
            query: ({ device_id }) => {
                return {
                    method: "PUT",
                    url: `/me/player/pause`,
                    params: {
                         device_id
                    }
                }
            }
        }),
        currentlyPlaying: builder.query({
            query: () => {
                return {
                    url: `/me/player/currently-playing`,
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
    usePlayResumeMutation,
    usePauseMutation,
    useCurrentlyPlayingQuery
} = usuariosApi;