import { CollaborationRecord, CollaborationStatus } from '../types';

const STORAGE_KEY = 'rudransh_inquiries_store';
const EVENT_KEY = 'rudransh_inquiries_updated';

// Sample seed inquiry to provide immediate context if empty
const DEFAULT_SAMPLE_INQUIRIES: CollaborationRecord[] = [
  {
    id: 'inq-sample-1',
    recordId: 'REQ-2026-FASH01',
    brandName: 'Aura Luxury Studios',
    applicantName: 'Elena Vance',
    applicantEmail: 'elena@auraluxury.com',
    applicantPhone: '+1 (555) 349-2810',
    workType: 'Fashion Ads / Visuals',
    description: 'Looking to produce a 6-part AI fashion editorial campaign for our upcoming Autumn capsule launch.',
    preferredContactMethod: 'gmail',
    budgetTimeline: 'Flexible / Q3',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export function getStoredInquiries(): CollaborationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_INQUIRIES));
      return DEFAULT_SAMPLE_INQUIRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading stored inquiries:', err);
    return [];
  }
}

export function saveInquiry(
  inquiryData: Omit<CollaborationRecord, 'id' | 'createdAt' | 'updatedAt'>
): CollaborationRecord {
  const current = getStoredInquiries();
  const id = 'inq_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  const newRecord: CollaborationRecord = {
    ...inquiryData,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: updated }));
  } catch (err) {
    console.error('Failed to save inquiry to storage:', err);
  }

  return newRecord;
}

export function updateInquiry(
  id: string,
  updates: Partial<CollaborationRecord>
): CollaborationRecord | null {
  const current = getStoredInquiries();
  let updatedRecord: CollaborationRecord | null = null;

  const nextList = current.map((item) => {
    if (item.id === id) {
      updatedRecord = {
        ...item,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updatedRecord;
    }
    return item;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: nextList }));
  } catch (err) {
    console.error('Failed to update inquiry in storage:', err);
  }

  return updatedRecord;
}

export function deleteInquiry(id: string): boolean {
  const current = getStoredInquiries();
  const nextList = current.filter((item) => item.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: nextList }));
    return true;
  } catch (err) {
    console.error('Failed to delete inquiry from storage:', err);
    return false;
  }
}

export function subscribeToInquiries(callback: (items: CollaborationRecord[]) => void): () => void {
  // Fire immediately
  callback(getStoredInquiries());

  const handleUpdate = (e: Event) => {
    const custom = e as CustomEvent<CollaborationRecord[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getStoredInquiries());
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredInquiries());
    }
  };

  window.addEventListener(EVENT_KEY, handleUpdate);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(EVENT_KEY, handleUpdate);
    window.removeEventListener('storage', handleStorage);
  };
}
