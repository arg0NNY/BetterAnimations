import { sfc32 } from '@utils/prng'

export const messages = {
  main: () => ({ rng: sfc32(450181629, 238323892, 206681137, 215170589), count: 8 }),
  alt: () => ({ rng: sfc32(3849863118, 865888779, 2963917516, 814392167), count: 5 }),
  animatable: () => ({ rng: sfc32(4228586405, 3866631402, 2889972076, 3985208143), count: 8 })
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
    chat: messages.main(),
    memberList: memberList.main()
  }),
  alt: () => ({
    header: { name: 182, description: 176 },
    chat: messages.alt(),
    memberList: memberList.alt()
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
    ]
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
    ]
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
