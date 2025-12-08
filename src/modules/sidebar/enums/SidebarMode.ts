export const SidebarMode = {
  Settings: 'settings',
  Chat: 'chat',
} as const;

export type SidebarModeType = (typeof SidebarMode)[keyof typeof SidebarMode];
