import fs from 'fs';
import path from 'path';
import { Item } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'items.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

export function readItems(): Item[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as Item[];
}

export function writeItems(items: Item[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

export function findItem(id: string): Item | undefined {
  return readItems().find((item) => item.id === id);
}

export function addItem(item: Item): Item {
  const items = readItems();
  items.push(item);
  writeItems(items);
  return item;
}

export function updateItem(id: string, data: Partial<Omit<Item, 'id' | 'createdAt'>>): Item | null {
  const items = readItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
  writeItems(items);
  return items[index];
}

export function deleteItem(id: string): boolean {
  const items = readItems();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  writeItems(filtered);
  return true;
}
