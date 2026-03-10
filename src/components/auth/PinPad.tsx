import {useState} from 'react';
import {Delete} from 'lucide-react';
export default function PinPad({onSubmit,error,loading}:{onSubmit:(pin:string)=>void;error?:string;loading?:boolean}){
  const[pin,setPin]=useState('');
  const add=(d:string)=>{if(pin.length<6)setPin(pin+d)};
  return(
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 mb-2">{[0,1,2,3,4,5].map(i=><div key={i} className={`w-4 h-4 rounded-full border-2 ${i<pin.length?'bg-blue-600 border-blue-600':'border-gray-300'}`}/>)}</div>
      {error&&<p className="text-red-500 text-sm font-medium">{error}</p>}
      <div className="grid grid-cols-3 gap-3">
        {['1','2','3','4','5','6','7','8','9'].map(d=><button key={d} onClick={()=>add(d)} disabled={loading} className="w-16 h-16 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-xl font-semibold transition-colors">{d}</button>)}
        <button onClick={()=>setPin(pin.slice(0,-1))} disabled={loading} className="w-16 h-16 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><Delete size={22}/></button>
        <button onClick={()=>add('0')} disabled={loading} className="w-16 h-16 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-xl font-semibold">0</button>
        <button onClick={()=>{if(pin.length>=4)onSubmit(pin)}} disabled={pin.length<4||loading} className="w-16 h-16 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-40 transition-colors">{loading?'...':'OK'}</button>
      </div>
    </div>
  );
}
