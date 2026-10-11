export interface Lead { id: number; name: string; initials: string; product: string; value: number; score: number; intent: number; hours: number; source: string; }
export interface MissedCall { id: number; name: string; time: string; value: number; hot: boolean; }
export interface RecentCall { id: number; name: string; time: string; duration: string; type: 'incoming' | 'outgoing'; outcome: string; }
export interface Message { id: string; name: string; time: string; text: string; own?: boolean; }
export interface Channel { id: string; name: string; description: string; percent?: number; unread: number; type: 'role' | 'task' | 'general'; }
