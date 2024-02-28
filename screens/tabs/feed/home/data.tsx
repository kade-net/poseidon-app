const IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export const feed: Array<Entities.Content> = [
    {
        id: 1,
        payload: {
            content: 'Hello World!',
            tags: [],
            mentions: [],
            media: []
        },
        profile: {
            avatar: IMAGE,
            banner: '',
            bio: '',
            displayName: 'John Doe',
            username: 'johndoe',
            id: 1
        },
        stats: {
            comments: 0,
            likes: 0,
            reposts: 0
        },
        timestamp: new Date()
    },
    {
        id: 2,
        payload: {
            content: 'Hello World!',
            tags: [],
            mentions: [],
            media: []
        },
        profile: {
            avatar: IMAGE,
            banner: '',
            bio: '',
            displayName: 'John Doe',
            username: 'johndoe',
            id: 2
        },
        stats: {
            comments: 0,
            likes: 0,
            reposts: 0
        },
        timestamp: new Date()
    },
    {
        id: 3,
        payload: {
            content: 'Hello World!',
            tags: [],
            mentions: [],
            media: []
        },
        profile: {
            avatar: IMAGE,
            banner: '',
            bio: '',
            displayName: 'John Doe',
            username: 'johndoe',
            id: 3
        },
        stats: {
            comments: 0,
            likes: 0,
            reposts: 0
        },
        timestamp: new Date()
    },
    {
        id: 4,
        payload: {
            content: 'Hello World!',
            tags: [],
            mentions: [],
            media: []
        },
        profile: {
            avatar: IMAGE,
            banner: '',
            bio: '',
            displayName: 'John Doe',
            username: 'johndoe',
            id: 4
        },
        stats: {
            comments: 0,
            likes: 0,
            reposts: 0
        },
        timestamp: new Date()
    },
    {
        id: 5,
        payload: {
            content: 'Hello World!',
            tags: [],
            mentions: [],
            media: []
        },
        profile: {
            avatar: IMAGE,
            banner: '',
            bio: '',
            displayName: 'John Doe',
            username: 'johndoe',
            id: 5
        },
        stats: {
            comments: 0,
            likes: 0,
            reposts: 0
        },
        timestamp: new Date()
    }
]