export {}

declare global {
   export interface MetaTag {
      title?: string
      google?: string
      charset?: string
      googlebot?: string
      description?: string
      keywords?: string
      viewport?: string
      rating?: string
      robots?: string
      og?: MetaTagOG
   }
   
   export interface MetaTagOG extends MetaTag {
      url: string
      image: string
      title: string
      video?: string
      audio?: string
      locale?: string
      locales?: string
      decription?: string
      determiner?: string
      site_name?: string
      type: MetaTagOGType
   }
   
   export interface ImageMetaTagOG extends MetaTagOG {
      alt?: string
      width?: string
      height?: string
      secure_url?: string
   }
   
   export interface MusicMetaTagOG extends MetaTagOG {
      disc?: string
      track?: string
   }
   
   export interface MusicSongMetaTagOG extends MusicMetaTagOG {
      musician?: string
      duration?: string
   }
   
   export interface MusicAlbumMetaTagOG extends MusicMetaTagOG {
      song?: string
      music: string
      musician?: string
   }
   
   export interface MusicPlaylistMetaTagOG extends MusicMetaTagOG {
      song?: string
      creator?: string
   }
   
   export interface VideoMetaTagOG {
      actor?: string
      role?: string
      director?: string
      writer?: string
      duration?: string
      release_date?: string
      tag?: string
   }
   
   export interface VideoEpisodeMetaTagOG extends VideoMetaTagOG {
      series?: string
   }
   
   export interface ArticleMetaTagOG {
      tag?: string
      author?: string
      section?: string
      modified_time?: string
      published_time?: string
      expiration_time?: string
   }
   
   export interface BookMetaTagOG {
      tag?: string
      isbn?: string
      author?: string
      release_date?: string
   }
   
   export interface ProfileMetaTagOG {
      first_name?: string
      last_name?: string
      username?: string
      gender?: string
   }
   
   type MetaTagOGType = 'website'
      | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'
      | 'image' | 'profile' | 'book' | 'music.playlist' | 'music.album'
      | 'music.song' | 'image'
}