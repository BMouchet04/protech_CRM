/** Local fictional seed reset only. Never targets the hosted database. */
import {spawnSync} from 'node:child_process';
if(process.env.CONFIRM_LUKE_DEV_RESET!=='fictional-only')throw new Error('Set CONFIRM_LUKE_DEV_RESET=fictional-only to reset local test data.');
const tables=['task_history','audit_logs','tasks','activities','prospects','opportunities','contacts','account_sites','accounts','exchange_rates','pipeline_stages','pipelines','loss_reasons','currencies','business_lines','role_permissions','permissions','users','teams','roles','territories','seed_state'];
const sql=`PRAGMA foreign_keys=OFF; ${tables.map(t=>`DELETE FROM ${t};`).join(' ')} PRAGMA foreign_keys=ON;`;
const result=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state','--command',sql],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status??1);
console.log('Local fictional data reset. Next authenticated request seeds it again.');
