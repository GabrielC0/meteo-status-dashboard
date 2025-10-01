export type TicketStatus = 'nouveau' | 'ouvert' | 'en_attente' | 'resolu' | 'ferme';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Ticket = {
  id: number;
  ticketNumber: string;
  status: TicketStatus;
  priority: TicketPriority;
  title: string;
  description: string | null;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

export type TicketRow = {
  id: number;
  ticket_number: string;
  status: string;
  priority: string;
  title: string;
  description: string | null;
  assignee: string | null;
  created_at: Date;
  updated_at: Date;
  resolved_at: Date | null;
};

export type TicketStats = {
  total_tickets: number;
  tickets_nouveau: string;
  tickets_ouvert: string;
  tickets_en_attente: string;
  tickets_resolu: string;
  tickets_ferme: string;
  avg_resolution_hours: number | null;
};

export type TicketsState = {
  tickets: Ticket[];
  stats: TicketStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;
};
