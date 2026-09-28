import {requireChatGPTUser} from './chatgpt-auth';
import Home from '@/components/crm-app';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/');return <Home/>}
