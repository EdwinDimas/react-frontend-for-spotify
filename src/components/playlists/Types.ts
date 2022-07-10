export interface ExternalUrls {
    spotify: string
}

export interface imageItem {
    url: string
    width: number | null
    height: number | null
}

export interface Owner {
    display_name: string
    external_urls: ExternalUrls
    href: string
    id: string
    type: string
    uri: string
}

export interface Tracks {
    href: string
    total: number
}

export interface PlayListItem {
    collaborative: boolean
    description: string
    external_urls: ExternalUrls
    href: string
    id: string
    images: imageItem[]
    name: string
    owner: Owner
    primary_color: null | string
    public: boolean
    snapshot_id: string
    tracks: Tracks
    type: string
    uri: string
}

export interface Album {
    album_type: string
    artists: Artist[]
    available_markets: string[]
    external_urls: ExternalUrls
    href: string
    id: string
    images: imageItem[],
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
}

export interface Artist {
    external_urls: ExternalUrls
    href: string
    id: string
    name: string
    type: string
    uri: string
}

export interface Track {
    album: Album,
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: { isrc: string }
    external_urls: ExternalUrls
    href: string
    id: string
    is_local: boolean
    name: string
    popularity: number
    preview_url: string | null
    track_number: number
    type: string
    uri: string
}

export interface LikedSongsItem {
    added_at: string
    track: Track
}

export interface PlayListsInt {
    href: string
    items: PlayListItem[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
}

export interface LikedSongsInt {
    href: string
    items: LikedSongsItem[]
}