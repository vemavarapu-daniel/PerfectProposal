
export interface ProposalState {
  recipientName: string;
  proposerName?: string;
  customMessage?: string;
}

export enum AppRoute {
  CREATE = 'create',
  PROPOSAL = 'proposal',
  CELEBRATE = 'celebrate'
}
