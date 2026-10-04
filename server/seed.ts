import {env} from 'cloudflare:workers';
import {mockAccounts,mockSites,mockContacts,mockActivities,mockUsers} from '@/data/crm';
import {initialProspects} from '@/data/prospects';
import {mockOpportunities} from '@/data/opportunities';
import {mockTasks,mockWorkActivities} from '@/data/work';
import {mockPipelines,lostReasons} from '@/data/pipelines';
import {normalizeDomain,normalizeEmail,normalizeName,normalizePhone,normalizeTaxId} from './normalize';

type DB=NonNullable<typeof env.DB>;
const iso=()=>new Date().toISOString();
const roles=['SUPERADMIN','DIRECTION','SALES_MANAGER','COMMERCIAL','CHARGE_AFFAIRES','ADMIN_COMMERCIAL','READ_ONLY'];
const crmTeams=[
 ['team-export','Sales export'],
 ['team-services-particuliers','Services Particuliers'],
 ['team-services-paca','Services PACA'],
 ['team-services','Services France'],
 ['team-sales','Sales France'],
 ['team-monaco','Services Monaco'],
] as const;
export const permissionList=['account.read','account.create','account.update','account.delete','account.assign','contact.read','contact.create','contact.update','contact.delete','contact.assign','prospect.read','prospect.create','prospect.update','prospect.delete','prospect.assign','prospect.convert','opportunity.read','opportunity.create','opportunity.update','opportunity.delete','opportunity.assign','opportunity.win','opportunity.lose','task.read','task.create','task.update','task.delete','task.assign','task.complete','activity.read','activity.create','activity.delete','forecast.read','admin.users','admin.roles','admin.teams','admin.rates','admin.config','audit.read','data.export','data.sync'];
const grant=(role:string,permission:string):'OWN'|'TEAM'|'ALL'|null=>{
 if(role==='SUPERADMIN')return 'ALL';
 if(permission==='data.sync')return role==='DIRECTION'?'ALL':role==='SALES_MANAGER'?'TEAM':null;
 if(role==='DIRECTION')return permission.startsWith('admin.')||permission==='audit.read'?null:'ALL';
 if(role==='SALES_MANAGER')return permission.startsWith('admin.')?null:'TEAM';
 if(role==='READ_ONLY')return permission.endsWith('.read')?'ALL':null;
 if(role==='ADMIN_COMMERCIAL')return permission.startsWith('admin.')?'ALL':permission.endsWith('.read')?'ALL':permission==='data.export'?null:'TEAM';
 return permission.startsWith('admin.')||permission==='data.export'?null:'OWN';
};
export async function ensureDevSeed(db:DB,identity:{userId:string;email:string}){
 const state=await db.prepare('SELECT id FROM seed_state WHERE id=?').bind('fictional-v1').first();
 if(state)return;
 const now=iso();const statements:ReturnType<DB['prepare']>[]=[];
 const add=(sql:string,...params:unknown[])=>statements.push(db.prepare(sql).bind(...params));
 for(const role of roles)add('INSERT OR IGNORE INTO roles(id,name) VALUES(?,?)',role,role);
 for(const p of permissionList)add('INSERT OR IGNORE INTO permissions(id,description) VALUES(?,?)',p,p);
 for(const role of roles)for(const p of permissionList){const scope=grant(role,p);if(scope)add('INSERT OR IGNORE INTO role_permissions(role_id,permission_id,scope) VALUES(?,?,?)',role,p,scope)}
 for(const [id,name] of crmTeams)add('INSERT OR IGNORE INTO teams(id,name,created_at,updated_at) VALUES(?,?,?,?)',id,name,now,now);
 const fixtures=[['u1','Alice Martin','SUPERADMIN',identity.userId,identity.email],['u2','Pierre Lambert','SALES_MANAGER',null,null],['u3','Samira Benali','COMMERCIAL',null,null],['u4','Nicolas Rey','CHARGE_AFFAIRES',null,null],['u5','Claire Morel','DIRECTION',null,null],['u6','Emma Renard','ADMIN_COMMERCIAL',null,null],['u7','Lucas Girard','READ_ONLY',null,null],['u8','Maya Laurent','COMMERCIAL',null,null]];
 for(const [id,name,role,auth,email] of fixtures)add('INSERT OR IGNORE INTO users(id,auth_id,email,name,role_id,team_id,active,created_at,updated_at) VALUES(?,?,?,?,?,NULL,1,?,?)',id,auth,email,name,role,now,now);
 for(const line of ['Services','Produits France','Export','Network'])add('INSERT OR IGNORE INTO business_lines(id,name) VALUES(?,?)',line,line);
 for(const code of ['EUR','USD','GBP','AED'])add('INSERT OR IGNORE INTO currencies(code,name) VALUES(?,?)',code,code);
 for(const label of lostReasons)add('INSERT OR IGNORE INTO loss_reasons(id,label) VALUES(?,?)',normalizeName(label),label);
 for(const pipeline of mockPipelines){add('INSERT OR IGNORE INTO pipelines(id,business_line_id,name,inactivity_days,created_at,updated_at) VALUES(?,?,?,?,?,?)',pipeline.id,pipeline.businessLine,pipeline.name,{services:14,'products-fr':21,export:30,network:30}[pipeline.id],now,now);for(const [rank,stage] of pipeline.stages.entries())add('INSERT OR IGNORE INTO pipeline_stages(id,pipeline_id,name,rank,probability,terminal,color) VALUES(?,?,?,?,?,?,?)',stage.id,pipeline.id,stage.name,rank,stage.probability,stage.terminal??null,stage.color)}
 for(const a of mockAccounts)add('INSERT OR IGNORE INTO accounts(id,parent_id,owner_id,name,normalized_name,domain,tax_id_normalized,phone_normalized,payload,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)',a.id,a.parentId,a.ownerId,a.name,normalizeName(a.name),normalizeDomain(a.website),normalizeTaxId((a as typeof a & {taxId?:string}).taxId??''),normalizePhone(a.phone),JSON.stringify(a),now,now);
 for(const site of mockSites)add('INSERT OR IGNORE INTO account_sites(id,account_id,owner_id,payload,created_at,updated_at) VALUES(?,?,?,?,?,?)',site.id,site.accountId,site.ownerId??mockAccounts.find(a=>a.id===site.accountId)?.ownerId??'u1',JSON.stringify(site),now,now);
 for(const contact of mockContacts)add('INSERT OR IGNORE INTO contacts(id,account_id,site_id,owner_id,email_normalized,phone_normalized,name_normalized,payload,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)',contact.id,contact.accountId,contact.siteId,contact.ownerId,normalizeEmail(contact.email),normalizePhone(contact.phone),normalizeName(`${contact.first} ${contact.last}`),JSON.stringify(contact),now,now);
 for(const opportunity of mockOpportunities)add('INSERT OR IGNORE INTO opportunities(id,account_id,site_id,primary_contact_id,owner_id,pipeline_id,stage_id,status,native_amount,currency,next_action_date,payload,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',opportunity.id,opportunity.accountId,opportunity.siteId,opportunity.primaryContactId,opportunity.ownerId,opportunity.pipelineId,opportunity.stageId,opportunity.status,opportunity.amount,opportunity.currency,opportunity.nextActionDate||null,JSON.stringify(opportunity),now,now);
 for(const prospect of initialProspects)add('INSERT OR IGNORE INTO prospects(id,account_id,contact_id,opportunity_id,owner_id,next_action_date,payload,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)',String(prospect.id),prospect.accountId??null,prospect.contactId??null,prospect.opportunityId??null,prospect.ownerId??mockUsers.find(u=>u.name===prospect.owner)?.id??'u1',prospect.nextActionDate??null,JSON.stringify(prospect),now,now);
 for(const activity of [...mockWorkActivities,...mockActivities])add('INSERT OR IGNORE INTO activities(id,user_id,prospect_id,account_id,contact_id,opportunity_id,activity_date,payload,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)',activity.id,activity.userId,activity.prospectId??null,activity.accountId??null,activity.contactId??null,activity.opportunityId??null,activity.activityDate,JSON.stringify(activity),now,now);
 for(const task of mockTasks)add('INSERT OR IGNORE INTO tasks(id,owner_id,prospect_id,account_id,contact_id,opportunity_id,activity_id,due_date,status,payload,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',task.id,task.ownerId,task.prospectId??null,task.accountId??null,task.contactId??null,task.opportunityId??null,task.activityId??null,task.dueDate,task.status,JSON.stringify(task),now,now);
 add('INSERT OR IGNORE INTO seed_state(id,created_at,kind) VALUES(?,?,?)','fictional-v1',now,'fictional-only');
 // D1 batches are atomic; the marker is written last so a failed seed is not treated as complete.
 await db.batch(statements);
}
/** Small, idempotent CRM configuration; runs for databases seeded before service centers existed. */
export async function ensureServiceCenters(db:DB){const existing=await db.prepare('SELECT count(*) AS total FROM service_centers WHERE id IN (?,?)').bind('monaco','castagniers').first<{total:number}>();if(existing?.total===2)return;await db.batch([
 db.prepare('INSERT OR IGNORE INTO service_centers(id,name,active) VALUES(?,?,1)').bind('monaco','Monaco'),
 db.prepare('INSERT OR IGNORE INTO service_centers(id,name,active) VALUES(?,?,1)').bind('castagniers','Castagniers'),
])}

/** Additive administration metadata and one-time team-model migration. */
export async function ensureAdminExtensions(db:DB){
 const t=iso();
 await db.batch([
  db.prepare('CREATE TABLE IF NOT EXISTS user_access (user_id TEXT PRIMARY KEY REFERENCES users(id), scope TEXT NOT NULL DEFAULT \'OWN\', site_access TEXT NOT NULL DEFAULT \'PENDING\', invited_at TEXT, last_login_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)'),
  db.prepare('CREATE TABLE IF NOT EXISTS team_settings (team_id TEXT PRIMARY KEY REFERENCES teams(id), manager_user_id TEXT REFERENCES users(id), active INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL)'),
  db.prepare('CREATE TABLE IF NOT EXISTS user_teams (user_id TEXT NOT NULL REFERENCES users(id), team_id TEXT NOT NULL REFERENCES teams(id), created_at TEXT NOT NULL, PRIMARY KEY(user_id,team_id))'),
  db.prepare('CREATE INDEX IF NOT EXISTS idx_user_teams_team ON user_teams(team_id)'),
  ...permissionList.map(permission=>db.prepare('INSERT OR IGNORE INTO permissions(id,description) VALUES(?,?)').bind(permission,permission)),
  db.prepare("DELETE FROM role_permissions WHERE role_id IN ('DIRECTION','ADMIN_COMMERCIAL') AND permission_id LIKE 'admin.%'"),
  db.prepare("DELETE FROM role_permissions WHERE role_id='DIRECTION' AND permission_id='audit.read'"),
  db.prepare("INSERT OR IGNORE INTO role_permissions(role_id,permission_id,scope) SELECT 'SUPERADMIN',id,'ALL' FROM permissions"),
  db.prepare("INSERT OR IGNORE INTO role_permissions(role_id,permission_id,scope) SELECT 'DIRECTION',id,'ALL' FROM permissions WHERE id NOT LIKE 'admin.%' AND id<>'audit.read'"),
  db.prepare("INSERT OR IGNORE INTO role_permissions(role_id,permission_id,scope) SELECT 'SALES_MANAGER',id,'TEAM' FROM permissions WHERE id NOT LIKE 'admin.%' AND id<>'data.export'"),
  db.prepare("INSERT OR IGNORE INTO role_permissions(role_id,permission_id,scope) SELECT 'READ_ONLY',id,'ALL' FROM permissions WHERE id LIKE '%.read' OR id='forecast.read'"),
  db.prepare("INSERT OR IGNORE INTO user_access(user_id,scope,site_access,created_at,updated_at) SELECT id,CASE role_id WHEN 'SUPERADMIN' THEN 'ALL' WHEN 'DIRECTION' THEN 'ALL' WHEN 'SALES_MANAGER' THEN 'TEAM' WHEN 'ADMIN_COMMERCIAL' THEN 'TEAM' ELSE 'OWN' END,CASE WHEN auth_id IS NULL THEN 'PENDING' ELSE 'AUTHORIZED' END,?,? FROM users").bind(t,t),
 ]);
 const migrated=await db.prepare('SELECT id FROM seed_state WHERE id=?').bind('teams-multi-v1').first();
 if(!migrated){
  const desiredIds=crmTeams.map(([id])=>id);
  await db.batch([
   ...crmTeams.map(([id,name])=>db.prepare('INSERT INTO teams(id,name,created_at,updated_at,deleted_at,deleted_by) VALUES(?,?,?,?,NULL,NULL) ON CONFLICT(id) DO UPDATE SET name=excluded.name,updated_at=excluded.updated_at,deleted_at=NULL,deleted_by=NULL').bind(id,name,t,t)),
   db.prepare(`UPDATE teams SET deleted_at=?,deleted_by='system',updated_at=? WHERE id NOT IN (${desiredIds.map(()=>'?').join(',')}) AND deleted_at IS NULL`).bind(t,t,...desiredIds),
   db.prepare('DELETE FROM user_teams'),
   db.prepare('UPDATE users SET team_id=NULL,updated_at=? WHERE team_id IS NOT NULL').bind(t),
   db.prepare(`UPDATE team_settings SET manager_user_id=NULL,active=0,updated_at=? WHERE team_id NOT IN (${desiredIds.map(()=>'?').join(',')})`).bind(t,...desiredIds),
   db.prepare('INSERT OR IGNORE INTO seed_state(id,created_at,kind) VALUES(?,?,?)').bind('teams-multi-v1',t,'configuration-migration'),
  ]);
 } else {
  await db.batch(crmTeams.map(([id,name])=>db.prepare('INSERT OR IGNORE INTO teams(id,name,created_at,updated_at) VALUES(?,?,?,?)').bind(id,name,t,t)));
 }
 await db.prepare("INSERT OR IGNORE INTO team_settings(team_id,active,updated_at) SELECT id,1,? FROM teams WHERE deleted_at IS NULL").bind(t).run();
}
