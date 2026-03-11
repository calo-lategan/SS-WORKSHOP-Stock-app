import * as XLSX from 'xlsx';
import {db} from '../db/database';
import {ERP_COLUMN_MAP,ERP_COLUMNS} from '../shared/columnMapping';

export async function exportToExcel():Promise<void>{
  const items=await db.items.filter(i=>!i.deletedAt).toArray();
  const rows=items.map((item,index)=>{
    const row:Record<string,any>={};
    for(const col of ERP_COLUMNS){
      const def=ERP_COLUMN_MAP[col];
      if(def.generate){row[col]=def.generate(index)}
      else if(def.passthrough&&item.erpPassthrough){row[col]=item.erpPassthrough[col]??def.default??''}
      else if(def.field){let v=(item as any)[def.field];if(def.transform)v=def.transform(v);row[col]=v??def.default??''}
      else{row[col]=def.default??''}
    }
    return row;
  });
  const wb=XLSX.utils.book_new();const ws=XLSX.utils.json_to_sheet(rows,{header:ERP_COLUMNS});
  XLSX.utils.book_append_sheet(wb,ws,'Inventory');
  XLSX.writeFile(wb,'inventory-export-'+new Date().toISOString().slice(0,10)+'.xlsx');
}
