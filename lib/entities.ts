namespace Entities {

    export interface Profile {
        banner: string;
        avatar: string;
        username: string;
        displayName: string;
        bio: string
        id: number
    }

    export interface Media {
        type: 'image' | 'video' | 'audio' | 'document';
        url: string
    }

    export interface ContentPayload {
        content: string;
        tags: string[];
        mentions: string[];
        media: Media[]
    }

    export interface Content {
        id: number;
        profile: Profile;
        payload: ContentPayload;
        timestamp: Date,
        stats: {
            likes: number;
            comments: number;
            reposts: number
        }
    }

}