import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Minus,Plus} from 'lucide-react';
import PhotoPlaceholder from './PhotoPlaceholder';
import type {Item} from '../../db/database';

export default function ItemCard({item,onAdjust}:{item:Item;onAdjust:(id:string,delta:number)=>void}){
  const{i18n}=useTranslation();
  const nav=useNavigate();
  const hi=i18n.language==='hi';
  const name=hi&&item.nameHi?item.nameHi:item.shortName||item.name;
  return(
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform">
      <div onClick={()=>nav('/item/'+item.id)} className="cursor-pointer p-3 pb-2">
        <PhotoPlaceholder photoThumbnail={item.photoThumbnail} name={item.name} size="lg"/>
        <h3 className="font-medium text-gray-800 mt-2 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{name}</h3>
        {item.categoryDescription&&<p className="text-xs text-gray-400 mt-0.5 truncate">{item.categoryDescription}</p>}
      </div>
      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-50 bg-gray-50/50">
        <button onClick={e=>{e.stopPropagation();onAdjust(item.id,-1)}} className="w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 flex items-center justify-center text-red-600 transition-colors"><Minus size={20} strokeWidth={2.5}/></button>
        <span className={`text-lg font-bold tabular-nums ${item.quantity===0?'text-red-500':item.quantity<5?'text-amber-500':'text-gray-800'}`}>{item.quantity}</span>
        <button onClick={e=>{e.stopPropagation();onAdjust(item.id,1)}} className="w-10 h-10 rounded-lg bg-green-50 hover:bg-green-100 active:bg-green-200 flex items-center justify-center text-green-600 transition-colors"><Plus size={20} strokeWidth={2.5}/></button>
      </div>
    </div>
  );
}
