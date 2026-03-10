import {useAuthStore} from '../../store/authStore';
import PinLoginScreen from './PinLoginScreen';
export default function AuthGuard({children}:{children:React.ReactNode}){
  const{isAuthenticated}=useAuthStore();
  if(!isAuthenticated)return <PinLoginScreen/>;
  return <>{children}</>;
}
