import {create} from 'zustand';
import type {Role} from '../lib/constants';
interface AuthState{isAuthenticated:boolean;role:Role|null;label:string;storeId:string;login:(role:Role,label:string,storeId:string)=>void;logout:()=>void}
export const useAuthStore=create<AuthState>((set)=>({isAuthenticated:false,role:null,label:'',storeId:'default-store-001',login:(role,label,storeId)=>set({isAuthenticated:true,role,label,storeId}),logout:()=>set({isAuthenticated:false,role:null,label:''})}));
