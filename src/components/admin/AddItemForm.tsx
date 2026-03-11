import {useState,useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate,useParams} from 'react-router-dom';
import {ArrowLeft,Camera,Save,Languages,X} from 'lucide-react';
import {v4 as uuid} from 'uuid';
import {db} from '../../db/database';
import {useAuthStore} from '../../store/authStore';
import {useCategories} from '../../hooks/useCategories';
import {translateHiToEn} from '../../lib/translate';
import type {Item} from '../../db/database';

function Input({label,value,onChange,type='text',required=false,suffix}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean;suffix?:React.ReactNode}){
  return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}{required&&' *'}</label><div className="flex gap-2"><input type={type} value={value} onChange={e=>onChange(e.target.value)} className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>{suffix}</div></div>;
}

function createThumbnail(blob:Blob, maxWidth:number = 200, maxHeight:number = 200):Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(blob);
  });
}

export default function AddItemForm(){
  const{t}=useTranslation();const nav=useNavigate();const{id:itemId}=useParams();const{storeId}=useAuthStore();const cats=useCategories();
  const[saving,setSaving]=useState(false);
  const[translating,setTranslating]=useState(false);
  const[form,setForm]=useState({shortName:'',name:'',nameHi:'',categoryId:'',sku:'',quantity:0,assetDescription:'',remarks:'',photoThumbnail:'' as string|null});
  const[existingItem,setExistingItem]=useState<Item|null>(null);
  const[uploading,setUploading]=useState(false);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));

  useEffect(()=>{
    if(itemId){
      db.items.get(itemId).then(item=>{
        if(item){
          setExistingItem(item);
          setForm({shortName:item.shortName,name:item.name,nameHi:item.nameHi||'',categoryId:item.categoryId||'',sku:item.sku||'',quantity:item.quantity,assetDescription:item.assetDescription||item.condition||'',remarks:item.remarks||'',photoThumbnail:item.photoThumbnail||null});
        }
      });
    }
  },[itemId]);

  const doTranslate=async()=>{
    if(!form.nameHi.trim())return;
    setTranslating(true);
    const en=await translateHiToEn(form.nameHi);
    if(en&&en!==form.nameHi){set('name',en);if(!form.shortName)set('shortName',en.slice(0,20))}
    setTranslating(false);
  };

  const handlePhotoUpload=async(file:File|null)=>{
    if(!file)return;
    setUploading(true);
    try{
      const thumbnail=await createThumbnail(file);
      set('photoThumbnail',thumbnail);
    }catch(err){
      console.error('Error creating thumbnail:',err);
    }
    setUploading(false);
  };

  const removePhoto=()=>{
    set('photoThumbnail',null);
  };

  const save=async()=>{
    if(!form.name.trim()&&!form.nameHi.trim())return;
    setSaving(true);
    if(!form.name.trim()&&form.nameHi.trim()){const en=await translateHiToEn(form.nameHi);set('name',en)}
    const finalName=form.name.trim()||form.nameHi.trim();
    const now=new Date().toISOString();const cat=cats?.find(c=>c.id===form.categoryId);
    
    if(existingItem){
      const updated:Item={...existingItem,shortName:form.shortName||finalName.slice(0,20),name:finalName,nameHi:form.nameHi||undefined,categoryId:form.categoryId||undefined,quantity:form.quantity,condition:form.assetDescription,remarks:form.remarks,sku:form.sku||undefined,categoryDescription:cat?.path||'',assetDescription:form.assetDescription,photoThumbnail:form.photoThumbnail||undefined,lastModifiedBy:'admin',updatedAt:now,syncStatus:'pending'};
      await db.items.update(existingItem.id,updated);
      await db.pendingSync.add({id:uuid(),table:'items',recordId:existingItem.id,operation:'update',data:updated,createdAt:now,retries:0} as any);
    }else{
      const item:Item={id:uuid(),storeId,shortName:form.shortName||finalName.slice(0,20),name:finalName,nameHi:form.nameHi||undefined,categoryId:form.categoryId||undefined,quantity:form.quantity,condition:form.assetDescription,remarks:form.remarks,sku:form.sku||undefined,groupDescription:'Site Services Workshop',categoryDescription:cat?.path||'',assetDescription:form.assetDescription,photoThumbnail:form.photoThumbnail||undefined,erpPassthrough:{},createdBy:'admin',lastModifiedBy:'admin',createdAt:now,updatedAt:now,syncVersion:1,syncStatus:'pending'} as Item;
      await db.items.add(item);
      await db.pendingSync.add({id:uuid(),table:'items',recordId:item.id,operation:'insert',data:item,createdAt:now,retries:0} as any);
    }
    nav('/');
  };
  return(
    <div className="pb-20">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 flex items-center gap-3"><button onClick={()=>nav(-1)} className="p-1 rounded-lg hover:bg-gray-100"><ArrowLeft size={22}/></button><h2 className="font-semibold text-lg">{existingItem?t('admin.editItem'):t('admin.addItem')}</h2></div>
      <div className="p-4 space-y-4">
        <div className="relative">
          {form.photoThumbnail?(
            <div className="relative">
              <img src={form.photoThumbnail} alt="Item" className="w-full h-40 object-cover rounded-xl"/>
              <button onClick={removePhoto} disabled={uploading} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"><X size={18}/></button>
            </div>
          ):(
            <label className="cursor-pointer block">
              <input type="file" accept="image/*" onChange={e=>handlePhotoUpload(e.target.files?.[0]||null)} disabled={uploading} className="hidden"/>
              <div className="w-full h-40 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 border-2 border-dashed hover:border-blue-400 hover:bg-blue-50 transition-colors"><Camera size={32}/><span className="text-sm">{uploading?t('admin.uploading'):t('item.addPhoto')}</span></div>
            </label>
          )}
          {form.photoThumbnail&&(
            <label className="mt-2 block">
              <input type="file" accept="image/*" onChange={e=>handlePhotoUpload(e.target.files?.[0]||null)} disabled={uploading} className="hidden"/>
              <div className="px-3 py-2 border rounded-lg text-sm text-center hover:bg-gray-50 cursor-pointer text-gray-600">{uploading?t('admin.uploading'):t('admin.changPhoto')}</div>
            </label>
          )}
        </div>
        <Input label={t('admin.hindiName')} value={form.nameHi} onChange={v=>set('nameHi',v)}
          suffix={<button onClick={doTranslate} disabled={!form.nameHi.trim()||translating} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 disabled:opacity-40 flex items-center gap-1 text-sm whitespace-nowrap"><Languages size={16}/>{translating?'...':t('dashboard.translate')}</button>}/>
        <Input label={t('admin.fullName')} value={form.name} onChange={v=>set('name',v)} required/>
        <Input label={t('admin.shortName')} value={form.shortName} onChange={v=>set('shortName',v)}/>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.selectCategory')}</label>
          <select value={form.categoryId} onChange={e=>set('categoryId',e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-sm bg-white"><option value="">{t('admin.selectCategory')}</option>{cats?.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <Input label={t('admin.initialQty')} value={String(form.quantity)} onChange={v=>set('quantity',Number(v)||0)} type="number"/>
        <Input label={t('admin.assetDesc')} value={form.assetDescription} onChange={v=>set('assetDescription',v)}/>
        <Input label={t('item.remarks')} value={form.remarks} onChange={v=>set('remarks',v)}/>
        <button onClick={save} disabled={(!form.name.trim()&&!form.nameHi.trim())||saving} className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2"><Save size={18}/>{saving?t('admin.saving'):t('admin.save')}</button>
      </div>
    </div>
  );
}
