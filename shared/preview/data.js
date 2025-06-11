import { sfc32 } from '@utils/prng'
import { generateMessageStream } from '@preview/components/main/Chat'

export const chat = {
  main: () => {
    const rng = sfc32(450181629, 238323892, 206681137, 215170589)
    return { rng, messages: generateMessageStream(rng, 8) }
  },
  alt: () => {
    const rng = sfc32(3849863118, 865888779, 2963917516, 814392167)
    return { rng, messages: generateMessageStream(rng, 5) }
  },
  tertiary: () => {
    const rng = sfc32(243164468, 1892646852, 3229717884, 3028721673)
    return { rng, messages: generateMessageStream(rng, 5) }
  }
}

export const memberList = {
  main: () => ({
    sections: [
      {
        length: 55,
        items: [
          { length: 150 },
          { length: 92 },
          { length: 122 }
        ]
      },
      {
        length: 130,
        items: [
          { length: 102 },
          { length: 92 },
          { length: 122 },
          { length: 58 },
          { length: 138 }
        ]
      },
      {
        length: 96,
        items: [
          { length: 70 },
          { length: 135 },
          { length: 122 },
          { length: 144 },
          { length: 130 }
        ]
      }
    ]
  }),
  alt: () => ({
    sections: [
      {
        length: 115,
        items: [
          { length: 61 },
          { length: 91 },
          { length: 75 },
          { length: 137 },
          { length: 109 }
        ]
      },
      {
        length: 90,
        items: [
          { length: 98 },
          { length: 114 },
          { length: 86 },
          { length: 126 },
          { length: 133 },
          { length: 120 },
          { length: 54 },
          { length: 98 },
          { length: 126 }
        ]
      }
    ]
  })
}

export const channel = {
  main: () => ({
    header: { name: 60, description: 282 },
    chat: chat.main(),
    memberList: memberList.main()
  }),
  alt: () => ({
    header: { name: 182, description: 176 },
    chat: chat.alt(),
    memberList: memberList.alt()
  })
}

export const thread = {
  main: () => ({
    header: { name: 103 },
    chat: chat.alt()
  }),
  alt: () => ({
    header: { name: 143 },
    chat: chat.tertiary()
  })
}

export const channelList = {
  main: () => ({
    name: 140,
    items: [
      { type: 'channel', length: 126 },
      { type: 'channel', length: 63 },
      { type: 'section', length: 77 },
      { type: 'channel', length: 37 },
      { type: 'channel', length: 124 },
      { type: 'channel', length: 83 },
      { type: 'channel', length: 111 },
      { type: 'section', length: 136 },
      { type: 'channel', length: 143 },
      { type: 'channel', length: 111 },
      { type: 'channel', length: 123 },
      { type: 'channel', length: 162 },
      { type: 'channel', length: 83 },
      { type: 'channel', length: 103 }
    ],
    active: 4
  }),
  alt: () => ({
    name: 67,
    items: [
      { type: 'channel', length: 37 },
      { type: 'channel', length: 111 },
      { type: 'channel', length: 63 },
      { type: 'section', length: 54 },
      { type: 'channel', length: 58 },
      { type: 'channel', length: 159 },
      { type: 'channel', length: 87 },
      { type: 'channel', length: 72 },
      { type: 'channel', length: 125 },
      { type: 'section', length: 127 },
      { type: 'channel', length: 82 },
      { type: 'channel', length: 154 },
      { type: 'channel', length: 100 },
      { type: 'section', length: 77 },
      { type: 'channel', length: 125 },
      { type: 'channel', length: 72 }
    ],
    active: 7
  })
}

export const server = {
  main: () => ({
    channelList: channelList.main(),
    channel: channel.main()
  }),
  alt: () => ({
    channelList: channelList.alt(),
    channel: channel.alt()
  })
}
