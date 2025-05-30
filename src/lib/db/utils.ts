import { randomUUID } from 'crypto';
 
/**
 * Function to create a unique ID for database records
 * @returns {string} A random UUID
 */
export const createId = (): string => randomUUID(); 