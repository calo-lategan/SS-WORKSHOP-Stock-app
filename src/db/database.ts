import Dexie, { Table } from 'dexie';

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
  photoPath?: string;
  photoThumbnail?: string;
  photoBlob?: Blob;
  groupDescription: string;
  subGroupDescription?: string;
  categoryDescription?: string;
  subCategoryDescription?: string;
  assetDescription?: string;
  assetCost?: number;
  erpPassthrough?: Record<string, any>;
  createdBy: string;
  lastModifiedBy?: string;
  createdAt: string;
  updatedAt: string;
  syncVersion: number;
  syncStatus: 'synced' | 'pending' | 'conflict';
  deletedAt?: string;
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

export interface ChangeLogEntry {
  id: string;
  storeId: string;
  itemId: string;
  action: 'increment' | 'decrement' | 'create' | 'edit' | 'delete';
  quantityBefore?: number;
  quantityAfter?: number;
  quantityChange?: number;
  reason?: string;
  performedBy: string;
  createdAt: string;
  synced: boolean;
}

export interface PendingSync {
  id: string;
  table: 'items' | 'change_log' | 'categories';
  recordId: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  createdAt: string;
  retries: number;
}

export interface PhotoUpload {
  id: string;
  itemId: string;
  blob: Blob;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  retries: number;
  createdAt: string;
  error?: string;
}

class InventoryDatabase extends Dexie {
  items!: Table<Item>;
  categories!: Table<Category>;
  changeLog!: Table<ChangeLogEntry>;
  pendingSync!: Table<PendingSync>;
  photoUploads!: Table<PhotoUpload>;

  constructor() {
    super('AlLaithInventory');

    this.version(1).stores({
      items: 'id, storeId, categoryId, name, shortName, updatedAt, syncStatus, [storeId+syncStatus], [storeId+categoryId]',
      categories: 'id, storeId, path, parentId, [storeId+parentId]',
      changeLog: 'id, storeId, itemId, createdAt, synced, [itemId+createdAt]',
      pendingSync: 'id, table, createdAt, [table+createdAt]',
      photoUploads: 'id, itemId, status, [status+createdAt]',
    });

    this.version(2).stores({
      items: 'id, storeId, categoryId, name, shortName, updatedAt, syncStatus, [storeId+syncStatus], [storeId+categoryId]',
      categories: 'id, storeId, path, parentId, [storeId+parentId]',
      changeLog: 'id, storeId, itemId, createdAt, synced, [itemId+createdAt]',
      pendingSync: 'id, table, createdAt, [table+createdAt]',
      photoUploads: 'id, itemId, status, [status+createdAt]',
    }).upgrade(tx => {
      return tx.table('items').toCollection().modify(item => {
        if (!item.erpPassthrough) item.erpPassthrough = {};
      });
    });
  }
}

export const db = new InventoryDatabase();
