INSERT OR IGNORE INTO permissions (id, description) VALUES ('account.assign', 'account.assign'), ('contact.assign', 'contact.assign'), ('prospect.assign', 'prospect.assign');--> statement-breakpoint
INSERT OR IGNORE INTO role_permissions (role_id, permission_id, scope)
SELECT role_id, 'account.assign', scope FROM role_permissions WHERE permission_id = 'account.update' AND role_id <> 'READ_ONLY';--> statement-breakpoint
INSERT OR IGNORE INTO role_permissions (role_id, permission_id, scope)
SELECT role_id, 'contact.assign', scope FROM role_permissions WHERE permission_id = 'contact.update' AND role_id <> 'READ_ONLY';--> statement-breakpoint
INSERT OR IGNORE INTO role_permissions (role_id, permission_id, scope)
SELECT role_id, 'prospect.assign', scope FROM role_permissions WHERE permission_id = 'prospect.update' AND role_id <> 'READ_ONLY';
