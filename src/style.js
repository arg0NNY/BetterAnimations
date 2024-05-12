import { DiscordSelectors } from '@/modules/DiscordSelectors'

const css = String.raw

const style = () => css`
    ${DiscordSelectors.AppMount.appMount} {
        overflow: clip;
    }
    
    [data-animation-container][data-animation-type] { /* Container while animation is running */
        position: relative;
        background: none;
    }
    
    [data-animation] > * {
        position: absolute;
    }
    
    [data-animation-type="exit"] {
        pointer-events: none;
    }
    
    [data-animation-container][data-animation-switch] { /* Temporary while overflow is not a setting */
        overflow: clip;
    }
    [data-animation-container][data-animation-switch] > :not([data-animation]) { /* Animating switch element */
        contain: layout;
    }
    [data-animation-container][data-animation-switch][data-animation-type="exit"] { /* Exiting switch container */
        position: absolute !important;
        inset: 0;
    }
    
    /* channel, server, settings */
    ${DiscordSelectors.AppView.container} {
        overflow: clip; /* Fix whole app jumping with sidebar animations */
    }
    ${DiscordSelectors.AppView.base} {
        min-width: 0;
        min-height: 0;
        overflow: visible;
    }
    ${DiscordSelectors.AppView.content}:has(> [data-animation-type]) {
        position: relative;
    }
    
    /* modal */
    ${DiscordSelectors.Modal.focusLock}:is(:has(> [data-animation-type]), :has(> [data-animation])) {
        position: relative;
    }
    
    /* settings */
    ${DiscordSelectors.StandardSidebarView.contentRegion} > ${DiscordSelectors.StandardSidebarView.contentRegion} {
        height: 100%;
    }
    
    /* lists */
    ${DiscordSelectors.ChannelItem.containerDefault}, ${DiscordSelectors.ChannelItem.containerDragBefore},
    ${DiscordSelectors.ChannelItem.containerUserOver}, ${DiscordSelectors.ChannelItem.containerDragAfter} {
        transition: none;
    }
    
    /* layers */
    .platform-win ${DiscordSelectors.Layers.layer} {
        top: -22px !important;
    }
    ${DiscordSelectors.Layers.layers} > ${DiscordSelectors.Layers.layer} {
        contain: strict;
    }
    
    /* sidebars */
    ${DiscordSelectors.ChannelView.chat} {
        overflow: clip;
        isolation: isolate;
    }
    ${DiscordSelectors.ChatSidebar.chatLayerWrapper} {
        background-color: var(--background-tertiary) !important;
    }
`

export default style
