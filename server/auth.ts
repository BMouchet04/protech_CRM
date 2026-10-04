import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {ensureAdminExtensions,ensureDevSeed,ensureServiceCenters} from './seed';

type DB=NonNullable<typeof env.DB>;
export type Actor={id:string;name:string;roleId:string;teamIds:string[];scope:'OWN'|'TEAM'|'ALL';permissions:Record<string,'OWN'|'TEAM'|'ALL'>;db:DB};
export class AccessError extends Error{constructor(public code:'UNAUTHENTICATED'|'FORBIDDEN'|'UNAVAILABLE'|'INVALID'|'CONFLICT',message:string){super(message)}}
export async function actor():Promise<Actor>{
 const identity=await getChatGPTUser();if(!identity)throw new AccessError('UNAUTHENTICATED','Connexion nécessaire.');
 const db=env.DB;if(!db)throw new AccessError('UNAVAILABLE','Le service de données est indisponible.');
 await ensureDevSeed(db,identity);
 await ensureServiceCenters(db);
 await ensureAdminExtensions(db);
 let user=await db.prepare("SELECT u.id,u.name,u.role_id AS roleId,u.active,COALESCE(ua.scope,'OWN') AS scope FROM users u LEFT JOIN user_access ua ON ua.user_id=u.id WHERE u.auth_id=? AND u.deleted_at IS NULL").bind(identity.userId).first<{id:string;name:string;roleId:string;active:number;scope:'OWN'|'TEAM'|'ALL'}>();
 if(!user){const byEmail=await db.prepare("SELECT u.id,u.name,u.role_id AS roleId,u.active,u.auth_id AS authId,COALESCE(ua.scope,'OWN') AS scope FROM users u LEFT JOIN user_access ua ON ua.user_id=u.id WHERE lower(u.email)=lower(?) AND u.deleted_at IS NULL").bind(identity.email).first<{id:string;name:string;roleId:string;active:number;authId:string|null;scope:'OWN'|'TEAM'|'ALL'}>();if(byEmail&&!byEmail.authId){await db.prepare('UPDATE users SET auth_id=?,updated_at=? WHERE id=? AND auth_id IS NULL').bind(identity.userId,new Date().toISOString(),byEmail.id).run();user=byEmail}}
 if(!user||!user.active)throw new AccessError('FORBIDDEN','Votre compte CRM n’est pas actif ou autorisé.');
 const [grants,memberships]=await Promise.all([
  db.prepare('SELECT permission_id AS permissionId,scope FROM role_permissions WHERE role_id=?').bind(user.roleId).all<{permissionId:string;scope:'OWN'|'TEAM'|'ALL'}>(),
  db.prepare('SELECT ut.team_id AS teamId FROM user_teams ut JOIN teams t ON t.id=ut.team_id WHERE ut.user_id=? AND t.deleted_at IS NULL').bind(user.id).all<{teamId:string}>(),
 ]);
 const rank={OWN:0,TEAM:1,ALL:2} as const;const cap=(permissionScope:'OWN'|'TEAM'|'ALL')=>rank[permissionScope]<=rank[user.scope]?permissionScope:user.scope;
 await db.prepare('UPDATE user_access SET last_login_at=?,updated_at=? WHERE user_id=?').bind(new Date().toISOString(),new Date().toISOString(),user.id).run();
 return {id:user.id,name:user.name,roleId:user.roleId,teamIds:memberships.results.map(x=>x.teamId),scope:user.scope,db,permissions:Object.fromEntries(grants.results.map(x=>[x.permissionId,cap(x.scope)]))};
}
export async function allowed(a:Actor,permission:string,ownerId?:string|null){const scope=a.permissions[permission];if(!scope)return false;if(ownerId===undefined)return true;if(scope==='ALL')return true;if(!ownerId)return false;if(ownerId===a.id)return true;if(scope!=='TEAM'||!a.teamIds.length)return false;const placeholders=a.teamIds.map(()=>'?').join(',');const shared=await a.db.prepare(`SELECT 1 AS ok FROM user_teams ut JOIN teams t ON t.id=ut.team_id WHERE ut.user_id=? AND ut.team_id IN (${placeholders}) AND t.deleted_at IS NULL LIMIT 1`).bind(ownerId,...a.teamIds).first<{ok:number}>();return !!shared}
export async function requirePermission(a:Actor,permission:string,ownerId?:string|null){if(!await allowed(a,permission,ownerId))throw new AccessError('FORBIDDEN','Vous n’avez pas l’autorisation.');}
export const respondError=(e:unknown)=>{const err=e instanceof AccessError?e:new AccessError('UNAVAILABLE','Impossible d’enregistrer ou de charger les données.');if(!(e instanceof AccessError))console.error('CRM request failed',e);return Response.json({error:err.message,code:err.code},{status:{UNAUTHENTICATED:401,FORBIDDEN:403,INVALID:400,CONFLICT:409,UNAVAILABLE:503}[err.code]})};
