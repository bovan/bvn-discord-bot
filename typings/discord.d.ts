declare module 'discord.js' {
  interface Author {
    username: string
    discriminator: string
    id: string
    avatar: string
  }

  interface MessageId {}

  export interface Message {
    nonce: string
    attachments: any[]
    tts: boolean
    embeds: any[]
    timestamp: string
    mention_everyone: boolean
    id: MessageId
    edited_timestamp: string,
    author: Author
    content: string
    channel: Channel
    mentions: any[]
    reply(message: string): any;
  }

  interface Role {
    managed: boolean
    name: string
    color: number,
    hoist: boolean,
    position: number,
    id: string
    permissions: number
  }

  interface ServerId {}

  export interface Server {
    features: any[]
    afk_timeout: number
    joined_at: string
    afk_channel_id: string
    id: ServerId
    icon: string
    name: string
    roles: Role[],
    region: string
    embed_channel_id: string
    embed_enabled: boolean
    splash: any
    emojis: any[]
    owner_id: string
    member_count: number
  }

  interface ChannelId {}

  export interface Channel {
    guild_id: ServerId
    name: string
    permission_overwrites: any[]
    topic: string
    position: number
    last_message_id: MessageId
    type: string
    id: ChannelId
    is_private: boolean
  }

  interface ClientOptions {
    autoReconnect: boolean;
  }

  export class Client {
    constructor(opts: ClientOptions);
    loginWithToken(token: string): void
    on(event: string, action: (message: Message) => void): void
    sendMessage(channeId: ChannelId, message: string): void
  }
}