import {useLiveQuery} from 'dexie-react-hooks';
import {db} from '../db/database';
import {useAuthStore} from '../store/authStore';
export function useCategories(){const{storeId}=useAuthStore();return useLiveQuery(()=>db.categories.where('storeId').equals(storeId).sortBy('sortOrder'),[storeId])}
