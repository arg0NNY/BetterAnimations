# Animation Settings

This section describes all the settings and all their values Animations can use to unlock the full potential of customization provided by _BetterAnimations_.

> [!IMPORTANT]
> Note that different Animations may not support all the listed settings or may not support all the values of the specific setting.

> [!TIP]
> This page only covers the settings available in Simple Mode. To learn about the settings available in [Advanced Mode](./advanced-mode) see [Advanced Animation Settings](./advanced-animation-settings).

## Duration

Controls how long the animation will take to complete.

A range from 100 milliseconds to 2 seconds with 50ms step.

> [!NOTE]
> Animations may modify the range and expand it up to 5 seconds if needed.
> 
> If the range exceeds 2 seconds in total the step will be increased from 50ms to 100ms.

## Position

Determines the anchor point of the animation.

**Available values:**
- Top Left
- Top
- Top Right
- Left
- Center
- Right
- Bottom Left
- Bottom
- Bottom Right

### Auto

This setting can automatically determine its value:
- **For [_Tooltips_](./modules#tooltips) and [_Popouts_](./modules#popouts):**

  Uses **the location of the anchor element** relative to the animating element.
- **For [_Context Menu_](./modules#context-menu):**

  Uses the current **mouse position** for the root Context Menu or **the location of the corresponding Menu Item** for Context Submenus.
- **For [_Layers_](./modules#layers):**

  Uses the current **mouse position**.
  Provides an option to **preserve it for individual layers**: the layer will be exited using the same **mouse position** used when this layer entered.
- **For [_Servers_](./modules#servers), [_Channels_](./modules#channels), [_Settings_](./modules#settings),
  [_Modals_](./modules#modals), [_Modals -> Backdrop_](./modules#modals-backdrop), [_Members Sidebar_](./modules#members-sidebar),
  [_Thread Sidebar_](./modules#thread-sidebar) and [_Thread Sidebar -> Switch_](./modules#thread-sidebar-switch):**

  Uses the current **mouse position**.

## Direction

Determines the general flow of the animation.

**Available values:**
- Upwards
- Downwards
- Leftwards
- Rightwards
- Forwards
- Backwards

### Auto

This setting can automatically determine its value:

- **For [_Servers_](./modules#servers), [_Channels_](./modules#channels), [_Settings_](./modules#settings) and [_Layers_](./modules#layers):**
  
  Automatically chooses the direction on the selected axis:
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21V3m0 18l3-3m-3 3l-3-3m3-15L9 6m3-3l3 3"></path>
  </svg> _Vertical_ (_Upwards_, _Downwards_),
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 12l3 3m-3-3l3-3m15 3l-3-3m3 3l-3 3"></path>
  </svg> _Horizontal_ (_Leftwards_, _Rightwards_),
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="currentColor" stroke-width="2" d="M12,22C12,22,12,22,12,22L12,22c-0.5,0-0.9-0.1-1.2-0.2c-0.4-0.2-0.7-0.4-1-0.7l-6.6-6.9c-0.6-0.7-0.2-1.6,0.9-2.2
          c1-0.5,2.4-0.5,3,0l2.5,2l1.2-10.7L9.3,3.7C8.7,3.9,8,3.9,7.6,3.7C7.2,3.5,7.3,3.3,7.8,3.1l3.5-1c0.1,0,0.2-0.1,0.3-0.1
          c0.1,0,0.2,0,0.4,0l0,0c0,0,0,0,0,0l0,0c0.1,0,0.3,0,0.4,0c0.1,0,0.2,0,0.3,0.1l3.5,1c0.5,0.2,0.6,0.4,0.2,0.6
          c-0.4,0.2-1.2,0.2-1.7,0l-1.6-0.5l1.2,10.7l2.5-2c0.7-0.5,2-0.5,3,0c1.1,0.6,1.6,1.5,0.9,2.2l-6.6,6.9c-0.3,0.3-0.6,0.5-1,0.7
          C12.9,21.9,12.5,22,12,22L12,22C12,22,12,22,12,22z"></path>
  </svg> _Depth_ (_Forwards_, _Backwards_).

  For example, if the selected server/channel/section/layer is listed below the previous one it chooses _Upwards_
  to make it look like it is coming from above the previous one, if listed above — _Downwards_
  (<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21V3m0 18l3-3m-3 3l-3-3m3-15L9 6m3-3l3 3"></path>
  </svg> _Vertical_ axis).

  You may reverse this behavior by enabling the
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m17 2l4 4l-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4l4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></g>
  </svg> _Reverse_ option.

- **For [_Tooltips_](./modules#tooltips), [_Popouts_](./modules#popouts) and [_Context Menu_](./modules#context-menu):**

  Automatically chooses between _Upwards_, _Downwards_, _Leftwards_ and _Rightwards_
  based on the location of the anchor element:
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v14m18-7H7m8 6l6-6l-6-6"></path>
  </svg> _Away_ from it or
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19V5m10 1l-6 6l6 6m-6-6h14"></path>
  </svg>_Towards_ it.

  For example, if the anchor element is located on the left side it chooses _Rightwards_ if
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v14m18-7H7m8 6l6-6l-6-6"></path>
  </svg> _Away_, _Leftwards_ if
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19V5m10 1l-6 6l6 6m-6-6h14"></path>
  </svg>_Towards_,
  if located above — _Downwards_ if
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v14m18-7H7m8 6l6-6l-6-6"></path>
  </svg> _Away_, _Upwards_ if
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="display: inline; vertical-align: sub;">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19V5m10 1l-6 6l6 6m-6-6h14"></path>
  </svg>_Towards_, etc.

## Variant

Custom options provided by the Animation.

For example, it may control color, size, etc.
