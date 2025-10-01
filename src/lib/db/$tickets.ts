import { query } from './config';
import type { QueryParams } from '@/types/Database.types';
import type { Ticket, TicketStatus, TicketPriority, TicketRow } from '@/types/Tickets.types';

export const getAllTickets = async (filters?: {
  status?: TicketStatus[];
  priority?: TicketPriority[];
}): Promise<Ticket[]> => {
  try {
    const baseSql = `
      SELECT 
        id, ticket_number, status, priority, title, description,
        assignee, created_at, updated_at, resolved_at
      FROM titan_tickets
      WHERE 1=1
    `;

    const params: QueryParams = [];
    const statusFilter =
      filters?.status && filters.status.length > 0
        ? ` AND status IN (${filters.status.map(() => '?').join(',')})`
        : '';
    const priorityFilter =
      filters?.priority && filters.priority.length > 0
        ? ` AND priority IN (${filters.priority.map(() => '?').join(',')})`
        : '';

    if (filters?.status && filters.status.length > 0) {
      params.push(...filters.status);
    }
    if (filters?.priority && filters.priority.length > 0) {
      params.push(...filters.priority);
    }

    const orderBy = ` ORDER BY 
      FIELD(priority, 'urgent', 'high', 'medium', 'low'),
      created_at DESC
    `;

    const finalSql = baseSql + statusFilter + priorityFilter + orderBy;

    const tickets = await query<TicketRow[]>(finalSql, params);

    return tickets.map((t) => {
      const status = t.status as TicketStatus;
      const priority = t.priority as TicketPriority;

      return {
        id: t.id,
        ticketNumber: t.ticket_number,
        status,
        priority,
        title: t.title,
        description: t.description,
        assignee: t.assignee,
        createdAt: t.created_at.toISOString(),
        updatedAt: t.updated_at.toISOString(),
        resolvedAt: t.resolved_at?.toISOString() || null,
      };
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des tickets:', error);
    throw error;
  }
};

export const getTicketByNumber = async (ticketNumber: string): Promise<Ticket | null> => {
  try {
    const [ticket] = await query<TicketRow[]>(
      `SELECT 
        id, ticket_number, status, priority, title, description,
        assignee, created_at, updated_at, resolved_at
      FROM titan_tickets
      WHERE ticket_number = ?`,
      [ticketNumber],
    );

    if (!ticket) {
      return null;
    }

    const status = ticket.status as TicketStatus;
    const priority = ticket.priority as TicketPriority;

    return {
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      status,
      priority,
      title: ticket.title,
      description: ticket.description,
      assignee: ticket.assignee,
      createdAt: ticket.created_at.toISOString(),
      updatedAt: ticket.updated_at.toISOString(),
      resolvedAt: ticket.resolved_at?.toISOString() || null,
    };
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du ticket ${ticketNumber}:`, error);
    return null;
  }
};

export const createTicket = async (
  ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'resolvedAt'>,
): Promise<string | null> => {
  try {
    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;

    await query(
      `INSERT INTO titan_tickets
        (ticket_number, status, priority, title, description, assignee)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        ticketNumber,
        ticket.status,
        ticket.priority,
        ticket.title,
        ticket.description || null,
        ticket.assignee || null,
      ],
    );

    return ticketNumber;
  } catch (error) {
    console.error('❌ Erreur lors de la création du ticket:', error);
    return null;
  }
};

export const updateTicketStatus = async (
  ticketNumber: string,
  newStatus: TicketStatus,
  assignee?: string,
): Promise<boolean> => {
  try {
    const resolvedAt = newStatus === 'resolu' || newStatus === 'ferme' ? new Date() : null;

    await query(
      `UPDATE titan_tickets
      SET status = ?,
          assignee = COALESCE(?, assignee),
          resolved_at = COALESCE(?, resolved_at),
          updated_at = NOW()
      WHERE ticket_number = ?`,
      [newStatus, assignee || null, resolvedAt, ticketNumber],
    );

    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour du ticket ${ticketNumber}:`, error);
    return false;
  }
};

export const getTicketStats = async () => {
  try {
    const [stats] = await query<
      {
        total_tickets: number;
        tickets_nouveau: number;
        tickets_ouvert: number;
        tickets_en_attente: number;
        tickets_resolu: number;
        tickets_ferme: number;
        avg_resolution_hours: number | null;
      }[]
    >(
      `SELECT 
        COUNT(*) as total_tickets,
        SUM(CASE WHEN status = 'nouveau' THEN 1 ELSE 0 END) as tickets_nouveau,
        SUM(CASE WHEN status = 'ouvert' THEN 1 ELSE 0 END) as tickets_ouvert,
        SUM(CASE WHEN status = 'en_attente' THEN 1 ELSE 0 END) as tickets_en_attente,
        SUM(CASE WHEN status = 'resolu' THEN 1 ELSE 0 END) as tickets_resolu,
        SUM(CASE WHEN status = 'ferme' THEN 1 ELSE 0 END) as tickets_ferme,
        AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_resolution_hours
      FROM titan_tickets`,
    );

    return (
      stats || {
        total_tickets: 0,
        tickets_nouveau: 0,
        tickets_ouvert: 0,
        tickets_en_attente: 0,
        tickets_resolu: 0,
        tickets_ferme: 0,
        avg_resolution_hours: null,
      }
    );
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats tickets:', error);
    throw error;
  }
};

export const getTicketsByStatus = async () => {
  try {
    const result = await query<
      {
        status: string;
        ticket_count: number;
        ticket_numbers: string;
      }[]
    >(`SELECT status, ticket_count, ticket_numbers FROM v_tickets_by_status`);

    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des tickets par statut:', error);
    throw error;
  }
};

const ticketsService = {
  getAllTickets,
  getTicketByNumber,
  createTicket,
  updateTicketStatus,
  getTicketStats,
  getTicketsByStatus,
};

export default ticketsService;
