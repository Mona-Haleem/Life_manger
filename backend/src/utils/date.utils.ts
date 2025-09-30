// src/utils/date.utils.ts
import { format, parseISO, addDays, isBefore, isAfter } from 'date-fns';

export const formatDate = (date: string | Date, fmt = 'yyyy-MM-dd') => {
  return format(typeof date === 'string' ? parseISO(date) : date, fmt);
};

export const addDaysToDate = (date: string | Date, days: number) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return addDays(parsed, days).toISOString();
};

export const isDateBefore = (a: string | Date, b: string | Date) => {
  const dateA = typeof a === 'string' ? parseISO(a) : a;
  const dateB = typeof b === 'string' ? parseISO(b) : b;
  return isBefore(dateA, dateB);
};

export const isDateAfter = (a: string | Date, b: string | Date) => {
  const dateA = typeof a === 'string' ? parseISO(a) : a;
  const dateB = typeof b === 'string' ? parseISO(b) : b;
  return isAfter(dateA, dateB);
};
