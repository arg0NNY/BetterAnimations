---
outline: deep
---

# Modules

Modules control the Animations for specific parts of Discord. See [Basics](./basics#modules).

## Servers <Badge type="warning" text="Switch" />

Animates the&nbsp;transitions when switching between servers and&nbsp;other full-screen pages, such as DMs and Discover.

> [!WARNING]
> Servers animations are heavy on performance, may stutter and slow down app navigation.

**Supports:**
- [Auto-Position](./animation-settings#position)
- [Auto-Direction](./animation-settings#direction)

**Default values:**
- [Auto-Direction](./animation-settings#direction) Axis: **Vertical**
- [Overflow](./advanced-animation-settings#overflow): **Disabled**

### Enhance layout

Discord’s default layout is&nbsp;poorly compatible with&nbsp;server-switching animations, forcing _BetterAnimations_ to&nbsp;animate unrelated areas
(Server List and User Panel) with&nbsp;huge performance losses.
This&nbsp;option restructures Discord’s layout to&nbsp;isolate animations to&nbsp;only the&nbsp;server area with&nbsp;no&nbsp;visual changes.
However, it may clash with&nbsp;other plugins or&nbsp;themes you have enabled. Try disabling this&nbsp;option if&nbsp;you encounter conflicts.

> [!NOTE]
> When this option is&nbsp;disabled _BetterAnimations_ will still apply minor layout tweaks (required for&nbsp;animations to&nbsp;function).
> Consider disabling Servers animations entirely if&nbsp;the&nbsp;conflict persists.

## Channels <Badge type="warning" text="Switch" />

Animates the&nbsp;transitions when switching between channels and other pages sharing the&nbsp;same sidebar.

> [!WARNING]
> Channels animations are heavy on performance, may stutter and slow down app navigation.

**Supports:**
- [Auto-Position](./animation-settings#position)
- [Auto-Direction](./animation-settings#direction)

**Default values:**
- [Auto-Direction](./animation-settings#direction) Axis: **Vertical**
- [Overflow](./advanced-animation-settings#overflow): **Disabled**

## Settings <Badge type="warning" text="Switch" />

Animates the&nbsp;transitions when switching between sections of&nbsp;the&nbsp;settings.

**Supports:**
- [Auto-Position](./animation-settings#position)
- [Auto-Direction](./animation-settings#direction)

**Default values:**
- [Auto-Direction](./animation-settings#direction) Axis: **Vertical**
- [Overflow](./advanced-animation-settings#overflow): **Disabled**

## Layers <Badge type="warning" text="Switch" />

Animates the&nbsp;transitions when switching between full-screen views of&nbsp;the&nbsp;Discord&nbsp;app, such as User&nbsp;Settings, Server&nbsp;Settings, _BetterAnimations_ Settings, etc.

**Supports:**
- [Auto-Position](./animation-settings#position)
- [Auto-Direction](./animation-settings#direction)

**Default values:**
- [Auto-Direction](./animation-settings#direction) Axis: **Depth**

> [!TIP]
> This module hides [Overflow](./advanced-animation-settings#overflow) setting as it has no effect
> due to the fact that layers occupy Discord's window entirely and can't have overflow.

## Tooltips <Badge type="tip" text="Reveal" />

Animates the&nbsp;appearance and disappearance of&nbsp;informative floating UI elements application-wide,
such as various control descriptions, server titles in&nbsp;the&nbsp;server list and other non-interactive elements that provide clarity to&nbsp;Discord's interfaces.

**Supports:**
- [Auto-Position](./animation-settings#position)
- [Auto-Direction](./animation-settings#direction)

## Popouts <Badge type="tip" text="Reveal" />

Animates the&nbsp;appearance and disappearance of&nbsp;interactive floating UI elements application-wide, such as User Profiles, Select Inputs, Pinned Messages, etc.

**Supports:**
- [Auto-Position](./animation-settings#position)
- [Auto-Direction](./animation-settings#direction)

## Context Menu <Badge type="tip" text="Reveal" />

Animates the&nbsp;appearance and disappearance of&nbsp;a&nbsp;context menu that is activated by&nbsp;right-clicking on&nbsp;various UI elements.

**Supports:**
- [Auto-Position](./animation-settings#position)
- [Auto-Direction](./animation-settings#direction)

> [!IMPORTANT]
> Context Menus that have a&nbsp;strictly defined anchor element, with the exception of&nbsp;Context Submenus, are controlled by&nbsp;[Popouts](#popouts).

## Messages <Badge type="tip" text="Reveal" />

Animates the&nbsp;appearance of&nbsp;new messages and the&nbsp;disappearance of&nbsp;deleted messages and other UI elements in&nbsp;the&nbsp;chat.

**Supports:**
- [Expand/Collapse Animations](./basics#expand-collapse-animations)

## Channel List <Badge type="tip" text="Reveal" />

Animates the&nbsp;appearance and disappearance of&nbsp;channels in&nbsp;the&nbsp;channel list triggered by&nbsp;switching categories,
creating or deleting a&nbsp;channel, and other actions that change the contents of&nbsp;the&nbsp;channel list.

**Supports:**
- [Expand/Collapse Animations](./basics#expand-collapse-animations)

## Modals <Badge type="tip" text="Reveal" />

Animates the&nbsp;appearance and disappearance of&nbsp;full-screen modal windows.

**Supports:**
- [Auto-Position](./animation-settings#position)

### Backdrop <Badge type="tip" text="Reveal" /> {#modals-backdrop}

Animates the&nbsp;appearance and disappearance of&nbsp;a&nbsp;dimming overlay behind modal windows.

**Supports:**
- [Auto-Position](./animation-settings#position)

> [!NOTE]
> Backdrop animations can alter the&nbsp;static styles of&nbsp;the&nbsp;backdrop.

> [!TIP]
> This module hides [Overflow](./advanced-animation-settings#overflow) setting as it has no effect
> due to the fact that backdrop occupies Discord's window entirely and can't have overflow.

## Members Sidebar <Badge type="tip" text="Reveal" />

Animates the&nbsp;appearance and disappearance of&nbsp;sidebars inside the&nbsp;chat area, such as Member List, Message Search Results, etc.

**Supports:**
- [Expand/Collapse Animations](./basics#expand-collapse-animations)
- [Auto-Position](./animation-settings#position)

## Thread Sidebar <Badge type="tip" text="Reveal" />

Animates the&nbsp;appearance and disappearance of&nbsp;full-screen sidebars, such as Thread Chat, Forum Post Chat, etc.

**Supports:**
- [Expand/Collapse Animations](./basics#expand-collapse-animations)
- [Auto-Position](./animation-settings#position)

### Switch <Badge type="warning" text="Switch" /> {#thread-sidebar-switch}

Animates the&nbsp;transitions when switching between full-screen sidebars, such as between threads or forum posts.

**Supports:**
- [Auto-Position](./animation-settings#position)
