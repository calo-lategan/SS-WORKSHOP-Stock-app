import Dexie, {type EntityTable} from 'dexie';

export interface Item {
  id: string;
  storeId: string;
  shortName: string;
  name: string;
  nameHi?: string;
  categoryId?: string;
  quantity: number;
  condition?: string;
  remarks?: string;
  sku?: string;
  photoThumbnail?: string;
  groupDescription?: string;
  categoryDescription?: string;
  assetDescription?: string;
  erpPassthrough?: Record<string, any>;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  syncVersion: number;
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  nameHi?: string;
  path: string;
  parentId?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  syncStatus: 'synced' | 'pending';
}

export interface ChangeLog {
  id: string;
  itemId: string;
  action: 'increment' | 'decrement' | 'set' | 'create' | 'update' | 'delete';
  quantityChange?: number;
  previousQty?: number;
  newQty?: number;
  reason?: string;
  performedBy: string;
  createdAt: string;
}

export interface PendingSync {
  id: string;
  table: string;
  recordId: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  createdAt: string;
  retries: number;
}

const database = new Dexie('AlLaithInventory') as Dexie & {
  items: EntityTable<Item, 'id'>;
  categories: EntityTable<Category, 'id'>;
  changeLog: EntityTable<ChangeLog, 'id'>;
  pendingSync: EntityTable<PendingSync, 'id'>;
};

database.version(2).stores({
  items: 'id, storeId, categoryId, name, shortName, sku, syncStatus, deletedAt, updatedAt',
  categories: 'id, storeId, path, sortOrder',
  changeLog: 'id, itemId, createdAt',
  pendingSync: 'id, table, recordId, createdAt'
});

export type ChangeLogEntry = ChangeLog;
export {database as db};
