import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft,PlusCircle,Trash2} from 'lucide-react';
import {v4 as uuid} from 'uuid';
import {db} from '../../db/database';
import {useCategories} from '../../hooks/useCategories';
import {useAuthStore} from '../../store/authStore';

const COLORS=['#F59E0B','#14B8A6','#8B5CF6','#6B7280','#3B82F6','#F43F5E','#06B6D4','#EC4899','#10B981','#EF4444'];

export default function CategoryManager(){
  const{t}=useTranslation();
  const nav=useNavigate();
  const cats=useCategories();
  const{storeId}=useAuthStore();
  const[name,setName]=useState('');
  const[nameHi,setNameHi]=useState('');
  const[color,setColor]=useState(COLORS[0]);
  const[adding,setAdding]=useState(false);

  const add=async()=>{
    if(!name.trim())return;
    setAdding(true);
    await db.categories.add({id:uuid(),storeId,name:name.trim(),nameHi:nameHi.trim()||undefined,path:name.trim().replace(/\s+/g,'_'),icon:'package',color,sortOrder:(cats?.length||0)+1,syncStatus:'pending'} as any);
    setName('');setNameHi('');setColor(COLORS[Math.floor(Math.random()*COLORS.length)]);setAdding(false);
  };

  const remove=async(id:string)=>{
    if(confirm(t('dashboard.confirmDeleteCat')))await db.categories.delete(id);
  };

  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button>
        <h2 className="font-semibold text-lg">{t('dashboard.categories')}</h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder={t('dashboard.catName')} className="w-full border rounded-xl px-3 py-2.5 text-sm"/>
          <input value={nameHi} onChange={e=>setNameHi(e.target.value)} placeholder={t('dashboard.catNameHi')} className="w-full border rounded-xl px-3 py-2.5 text-sm"/>
          <div className="flex gap-2 flex-wrap">{COLORS.map(c=><button key={c} onClick={()=>setColor(c)} className={`w-8 h-8 rounded-full border-2 ${c===color?'border-gray-800 scale-110':'border-transparent'}`} style={{backgroundColor:c}}/>)}</div>
          <button onClick={add} disabled={!name.trim()||adding} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-40 flex items-center justify-center gap-2"><PlusCircle size={18}/>{t('dashboard.addCategory')}</button>
        </div>
        <div className="space-y-2">
          {cats?.map(c=>(
            <div key={c.id} className="bg-white border rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor:c.color||'#64748B'}}/>
                <div><div className="font-medium text-sm">{c.name}</div>{c.nameHi&&<div className="text-xs text-gray-400">{c.nameHi}</div>}</div>
              </div>
              <button onClick={()=>remove(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
