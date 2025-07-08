---
outline: deep
---

# Compatibility: For theme developers

Most of the [Modules](./modules) of _BetterAnimations_ introduce changes into Discord's layout
to set up the animation flow, which may interfere with the custom styles of your theme.

This section describes in detail what layout changes each of the [Modules](./modules) introduces so that you can
make your theme compatible with _BetterAnimations_.

## Detecting Enabled Modules

To make it easy for you to detect which of the [Modules](./modules) are currently enabled so you can make
the required overrides, each Module adds a class to the root `html` element of the Discord app when enabled: `BA__module_{key}`,
where `{key}` is the unique ID of the module.

For example, to make an override when the [Servers](./modules#servers) module is enabled, you can define the following selector:
```css
.BA__module_servers .yourClass {
    /* ... */
}
```

## [Servers](./modules#servers)

- **Key:** `servers`
- **Class:** `BA__module_servers`

When this Module is enabled, it wraps the `content` element with two additional containers:
```html
<div class="base_c48ade" data-fullscreen="false">
  <div class="bar_c38106 theme-dark theme-darker images-dark"><!-- ... --></div>
  <div class="BA__content"> <!-- [!code ++] -->
    <div data-ba-container class="BA__content"> <!-- [!code ++] -->
      <div class="content_c48ade">
        <div data-collapsed="false" class="sidebar_c48ade theme-dark theme-darker images-dark"><!-- ... --></div>
        <div class="page_c48ade" data-collapsed="false"><!-- ... --></div>
      </div>
    </div> <!-- [!code ++] -->
  </div> <!-- [!code ++] -->
</div>
```

### Enhance layout

The [Servers](./modules#servers) module has an optional setting named **Enhance layout**, which is enabled by default.
See [Modules](./modules#enhance-layout) to learn more about the purpose of this setting.

When **Enhance layout** is enabled, it moves the **Server (Guild) List** (`wrapper guilds`) and **User Panel** (`panels`)
from the `sidebar` element to the `base` element:
```html
<div class="base_c48ade BA__baseEnhancedLayout" data-fullscreen="false"> <!-- [!code highlight] -->
  <div class="bar_c38106 theme-dark theme-darker images-dark"><!-- ... --></div>
  <nav class="wrapper_ef3116 guilds_c48ade theme-dark theme-darker images-dark" aria-label="Servers sidebar"><!-- ... --></nav> <!-- [!code ++] -->
  <div class="BA__content">
    <div data-ba-container class="BA__content">
      <div class="content_c48ade">
        <div data-collapsed="false" class="sidebar_c48ade theme-dark theme-darker images-dark">
          <nav class="wrapper_ef3116 guilds_c48ade theme-dark theme-darker images-dark" aria-label="Servers sidebar"><!-- ... --></nav> <!-- [!code --] -->
          <div class="sidebarList_c48ade sidebarListRounded_c48ade"><!-- ... --></div>
          <div class="sidebarResizeHandle_c48ade" aria-label="Resize Sidebar" role="button" tabindex="0"></div>
          <section class="panels_c48ade" aria-label="User area"><!-- ... --></section> <!-- [!code --] -->
        </div>
        <div class="page_c48ade" data-collapsed="false"><!-- ... --></div>
      </div>
    </div>
  </div>
  <section class="panels_c48ade" aria-label="User area"><!-- ... --></section> <!-- [!code ++] -->
</div>
```

To detect if **Enhance layout** is enabled, use class `BA__baseEnhancedLayout`, which is added to the `base` element
when this setting is enabled (see the example above).

Alongside the layout change, **Enhance layout** also adds the following styles:
```css
.BA__baseEnhancedLayout :is(.BA__content, .content_c48ade) {
    grid-column: -3 / end;
    grid-row: -2 / end;
}
.BA__baseEnhancedLayout .sidebar_c48ade {
    grid-area: channelsList;
}
.BA__baseEnhancedLayout .panels_c48ade {
    width: calc(var(--custom-guild-sidebar-width) - var(--space-xs)*2);
    z-index: 100;
}

/* Hide the moved elements in the fullscreen voice call */
.BA__baseEnhancedLayout[data-fullscreen="true"] :is(.guilds_c48ade, .panels_c48ade) {
    display: none;
}
```

## [Channels](./modules#channels)

- **Key:** `channels`
- **Class:** `BA__module_channels`

When this Module is enabled, it wraps the `page` element with two additional containers:
```html
<div class="base_c48ade" data-fullscreen="false">
  <div class="bar_c38106 theme-dark theme-darker images-dark"><!-- ... --></div>
  <div class="content_c48ade">
    <div data-collapsed="false" class="sidebar_c48ade theme-dark theme-darker images-dark"><!-- ... --></div>
    <div class="BA__page"> <!-- [!code ++] -->
      <div data-ba-container class="BA__page"> <!-- [!code ++] -->
        <div class="page_c48ade" data-collapsed="false"><!-- ... --></div>
      </div> <!-- [!code ++] -->
    </div> <!-- [!code ++] -->
  </div>
</div>
```

## [Settings](./modules#settings)

- **Key:** `settings`
- **Class:** `BA__module_settings`

When this Module is enabled, it wraps the `contentRegion` element with two additional containers:
```html
<div class="standardSidebarView__23e6b">
  <div class="sidebarRegion__23e6b theme-dark theme-darker images-dark"><!-- ... --></div>
  <div class="contentRegion__23e6b"> <!-- [!code ++] -->
    <div data-ba-container class="contentRegion__23e6b"> <!-- [!code ++] -->
      <div class="contentRegion__23e6b"><!-- ... --></div>
    </div> <!-- [!code ++] -->
  </div> <!-- [!code ++] -->
</div>
```

Alongside the layout change, it also adds the following styles:
```css
.standardSidebarView__23e6b > .contentRegion__23e6b {
    isolation: isolate;
}
.contentRegion__23e6b > .contentRegion__23e6b {
    height: 100%;
}
.contentRegion__23e6b[data-ba-container] {
    background: none;
}
.platform-win .contentRegionScroller__23e6b {
    height: calc(100% - var(--custom-app-top-bar-height));
}
```

## [Layers](./modules#layers)

- **Key:** `layers`
- **Class:** `BA__module_layers`

When this Module is enabled, it wraps each `layer` element with an additional container:
```html
<div class="layers__960e4 layers__160d8">
  <div data-ba-container class="BA__layerContainer"> <!-- [!code ++] -->
    <div class="layer__960e4 baseLayer__960e4 BA__layer--hidden">
      <div class="container_c48ade"><!-- ... --></div>
    </div>
  </div> <!-- [!code ++] -->
  <div data-ba-container class="BA__layerContainer"> <!-- [!code ++] -->
    <div class="layer__960e4">
      <div class="standardSidebarView__23e6b"><!-- ... --></div>
    </div>
  </div> <!-- [!code ++] -->
</div>
```

Alongside the layout change, it also appends a class `BA__layer--hidden` for the hidden layers (see the example above)
and adds the following styles:
```css
.BA__layerContainer {
    position: absolute;
    inset: 0;
}
.layer__960e4 {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    contain: strict;
}
.BA__layer--hidden {
    visibility: hidden;
    pointer-events: none;
}
```

## [Tooltips](./modules#tooltips)

- **Key:** `tooltips`
- **Class:** `BA__module_tooltips`

This Module doesn't introduce any permanent layout changes.

## [Popouts](./modules#popouts)

- **Key:** `popouts`
- **Class:** `BA__module_popouts`

This Module doesn't introduce any permanent layout changes.

## [Context Menu](./modules#context-menu)

- **Key:** `contextMenu`
- **Class:** `BA__module_contextMenu`

When this Module is enabled, it moves submenus nested within the root menu outside it:
```html
<div class="layerContainer_da8173">
  <div class="clickTrapContainer_da8173 trapClicks_da8173">
    <div class="theme-dark theme-darker images-dark layer_da8173">
      <div class="menu_c1e9c4 flexible_c1e9c4">
        <!-- (Deeply nested) -->
        <div class="clickTrapContainer_da8173"> <!-- [!code --:7] -->
          <div class="theme-dark theme-darker images-dark layer_da8173">
            <div class="submenuPaddingContainer_c1e9c4">
              <div class="submenu_c1e9c4 menu_c1e9c4"><!-- ... --></div>
            </div>
          </div>
        </div>
        <!-- (Deeply nested) -->
      </div>
    </div>
  </div>
  <div class="clickTrapContainer_da8173"> <!-- [!code ++:7] -->
    <div class="theme-dark theme-darker images-dark layer_da8173">
      <div class="submenuPaddingContainer_c1e9c4">
        <div class="submenu_c1e9c4 menu_c1e9c4"><!-- ... --></div>
      </div>
    </div>
  </div>
</div>
```

The same applies for deeply nested submenus (submenus inside other submenus).

## [Messages](./modules#messages)

- **Key:** `messages`
- **Class:** `BA__module_messages`

When this Module is enabled, it moves the `groupStart` class from the `message` element to the `messageListItem` element
to make `margin-top` apply to the message container instead of its child:
```html
<ol class="scrollerInner__36d07">
  <!-- ... -->
  <li class="messageListItem__5126c" class="messageListItem__5126c"> <!-- [!code --] -->
  <li class="messageListItem__5126c" class="messageListItem__5126c groupStart__5126c"> <!-- [!code ++] -->
    <div class="message__5126c cozyMessage__5126c groupStart__5126c wrapper_c19a55 cozy_c19a55 zalgo_c19a55"><!-- ... --></div> <!-- [!code --] -->
    <div class="message__5126c cozyMessage__5126c wrapper_c19a55 cozy_c19a55 zalgo_c19a55"><!-- ... --></div> <!-- [!code ++] -->
  </li>
  <!-- ... -->
</ol>
```

It also changes the layout of dividers — it wraps the divider with an additional container to which it moves
the `divider` and `hasContent` classes that apply the margin styles to make the margins apply to the root divider container:
```html
<ol class="scrollerInner__36d07">
  <!-- ... -->
  <div class="divider__5126c hasContent__5126c divider__908e2 hasContent__908e2"> <!-- [!code --:3] -->
    <span class="content__908e2"><!-- ... --></span>
  </div>
  <div class="divider__5126c hasContent__5126c"> <!-- [!code ++:5] -->
    <div class="divider__908e2 hasContent__908e2">
      <span class="content__908e2"><!-- ... --></span>
    </div>
  </div>
  <!-- ... -->
</ol>
```

## [Channel List](./modules#channel-list)

- **Key:** `channelList`
- **Class:** `BA__module_channelList`

This Module doesn't introduce any permanent layout changes.

## [Modals](./modules#modals)

- **Key:** `modals`
- **Class:** `BA__module_modals`

This Module doesn't introduce any permanent layout changes.

### [Backdrop](./modules#modals-backdrop) {#modals-backdrop}

- **Key:** `modalsBackdrop`
- **Class:** `BA__module_modalsBackdrop`

When this Module is enabled, it adds an element inside the original `backdrop` element,
from which it deletes the original styles:
```html
<div class="layerContainer_da8173">
  <div class="backdrop__78332 withLayer__78332" style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(0px);"></div> <!-- [!code --] -->
  <div class="backdrop__78332 withLayer__78332" data-ba-container> <!-- [!code ++:3] -->
    <div class="BA__backdrop"></div>
  </div>
</div>
```

## [Members Sidebar](./modules#members-sidebar)

- **Key:** `membersSidebar`
- **Class:** `BA__module_membersSidebar`

When this Module is enabled, it wraps the root sidebar element with an additional container:
```html
<div class="content_f75fb0">
  <main class="chatContent_f75fb0"><!-- ... --></main>
  <div data-ba-container class="BA__sidebar"> <!-- [!code ++] -->
    <div class="container_c8ffbb">
      <aside class="membersWrap_c8ffbb hiddenMembers_c8ffbb"><!-- ... --></aside>
    </div>
  </div> <!-- [!code ++] -->
</div>
```

This Module also covers other sidebars inside the chat area, such as Message Search Results,
for which it applies the same change:
```html
<div class="content_f75fb0">
  <main class="chatContent_f75fb0"><!-- ... --></main>
  <div data-ba-container class="BA__sidebar"> <!-- [!code ++] -->
    <section class="searchResultsWrap_a9e706" aria-label="Search Results"><!-- ... --></section>
  </div> <!-- [!code ++] -->
</div>
```

## [Thread Sidebar](./modules#thread-sidebar)

- **Key:** `threadSidebar`
- **Class:** `BA__module_threadSidebar`

When this Module is enabled, it wraps the `chatLayerWrapper` and other sidebar helper elements with three additional containers:
```html
<div class="page_c48ade" data-collapsed="false">
  <div style="width: 100%; height: 100%; display: flex;">
    <div data-has-border="true" class="chat_f75fb0 threadSidebarOpen_f75fb0"><!-- ... --></div>
    <div data-ba-container class="BA__sidebar"> <!-- [!code ++:3] -->
      <div data-ba-container class="BA__sidebar">
        <div class="BA__sidebar">
          <div style="min-width: 458px;"></div>
          <div class="chatLayerWrapper__01ae2"><!-- ... --></div>
        </div> <!-- [!code ++:3] -->
      </div>
    </div>
  </div>
</div>
```

This Module also covers other full-screen sidebars, such as Mod View;
for any non-chat sidebars it only adds one container:
```html
<div class="page_c48ade" data-collapsed="false">
  <div style="width: 100%; height: 100%; display: flex;">
    <div data-has-border="true" class="chat_f75fb0 threadSidebarOpen_f75fb0"><!-- ... --></div>
    <div data-ba-container class="BA__sidebar"> <!-- [!code ++] -->
      <div class="guildSidebar_f75fb0" style="width: 480px;">
        <div class="sidebarContainer__656be"><!-- ... --></div>
      </div>
    </div> <!-- [!code ++] -->
  </div>
</div>
```

### [Switch](./modules#thread-sidebar-switch) {#thread-sidebar-switch}

- **Key:** `threadSidebarSwitch`
- **Class:** `BA__module_threadSidebarSwitch`

This Module introduces the same layout changes as the [Thread Sidebar](#thread-sidebar).

Therefore, for convenience, class `BA__module_threadSidebar` is present when either of these modules is enabled.
