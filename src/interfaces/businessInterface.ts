import { TransactionTypes } from "../repositories/cardRepository";

export interface Business {
    id: number;
    name: string;
    type: TransactionTypes;
  }