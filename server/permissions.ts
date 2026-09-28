export type Scope='OWN'|'TEAM'|'ALL';
/** Pure predicate used after the role-permission grant has been read from D1. */
export function scopeAllows(scope:Scope|undefined,actorId:string,actorTeamId:string|null,ownerId:string|undefined|null,ownerTeamId:string|null){
 if(!scope)return false;
 if(scope==='ALL')return true;
 if(ownerId===actorId)return true;
 return scope==='TEAM'&&!!actorTeamId&&actorTeamId===ownerTeamId;
}
