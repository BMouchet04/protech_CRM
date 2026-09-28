export type Status = 'Nouveau' | 'Contact tenté' | 'Contacté' | 'Qualifié' | 'À relancer' | 'Converti';
export type Line = 'Services' | 'Produits France' | 'Export' | 'Network';
export type Prospect = { id: number; accountId?: string|null; contactId?: string|null; opportunityId?: string|null; nextActionDate?:string; convertedAt?: string; source?: string; createdAt?: string; ownerId?: string; first: string; last: string; company: string; email: string; owner: string; status: Status; score: number; position: string; role: string; region: string; line: Line; action: string; date: string };
