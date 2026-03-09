export interface ColumnDef {
  field: string | null;
  transform?: (v: any) => any;
  generate?: (index: number) => any;
  default?: any;
  passthrough?: boolean;
}

export const ERP_COLUMN_MAP: Record<string, ColumnDef> = {
  'RowNumber':               { field: null, generate: (i: number) => i + 1 },
  'lId':                     { field: 'id', transform: (v: string) => v.slice(0, 8) },
  'Short Name':              { field: 'shortName' },
  'Name':                    { field: 'name' },
  'Remarks':                 { field: 'remarks', default: '' },
  'Stock Keeping Unit':      { field: 'sku', default: '' },
  'StockMaintain':           { field: null, passthrough: true, default: '' },
  'Capacity':                { field: null, passthrough: true, default: '' },
  'Used':                    { field: 'quantity' },
  'ResourceType':            { field: null, passthrough: true, default: '' },
  'TaxType':                 { field: null, passthrough: true, default: '' },
  'StockLedger':             { field: null, passthrough: true, default: '' },
  'StockLedgerIncome':       { field: null, passthrough: true, default: '' },
  'StockLedgerExpense':      { field: null, passthrough: true, default: '' },
  'LastModifiedBy':          { field: 'lastModifiedBy' },
  'LastModifiedOn':          { field: 'updatedAt' },
  'Created On':              { field: 'createdAt' },
  'HS-Codes':                { field: null, passthrough: true, default: '' },
  'Working Height':          { field: null, passthrough: true, default: '' },
  'Group Description':       { field: 'groupDescription', default: 'Site Services Workshop' },
  'Sub Group Description':   { field: 'subGroupDescription', default: '' },
  'Category Description':    { field: 'categoryDescription' },
  'Sub Category Description':{ field: 'subCategoryDescription', default: '' },
  'Purchase Month':          { field: null, passthrough: true, default: '' },
  'Purchase Year':           { field: null, passthrough: true, default: '' },
  'Asset Description':       { field: 'assetDescription' },
  'Asset Cost':              { field: 'assetCost' },
  'Total Life':              { field: null, passthrough: true, default: '' },
  'Assets S. No':            { field: null, passthrough: true, default: '' },
  'Revenue Category':        { field: null, passthrough: true, default: '' },
  'Asset Type':              { field: null, passthrough: true, default: '' },
};

export const ERP_COLUMNS = Object.keys(ERP_COLUMN_MAP);

export const PASSTHROUGH_COLUMNS = Object.entries(ERP_COLUMN_MAP)
  .filter(([_, def]) => def.passthrough)
  .map(([col]) => col);

export const REQUIRED_COLUMNS = ['Name', 'Used', 'Category Description'];
