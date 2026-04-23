const mysql = require('mysql2/promise');

function readEnv(name) {
	const value = process.env[name];
	return typeof value === 'string' ? value.trim() : '';
}

function toBool(value) {
	return typeof value === 'string' && ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function parseDatabaseUrl() {
	const urlValue = readEnv('DATABASE_URL');
	if (!urlValue) return null;

	try {
		const parsed = new URL(urlValue);
		return {
			host: parsed.hostname,
			port: parsed.port ? Number(parsed.port) : 3306,
			user: decodeURIComponent(parsed.username),
			password: decodeURIComponent(parsed.password),
			database: parsed.pathname.replace(/^\//, ''),
			requireSsl: parsed.searchParams.get('ssl-mode') === 'REQUIRED'
		};
	} catch (err) {
		console.log('Invalid DATABASE_URL format:', err.message);
		return null;
	}
}

const urlConfig = parseDatabaseUrl();
const envHost = readEnv('DB_HOST');
const host = urlConfig?.host || envHost;
const requireSsl = Boolean(
	urlConfig?.requireSsl ||
	toBool(readEnv('DB_SSL_REQUIRED')) ||
	host.endsWith('.aivencloud.com')
);
const sslCa = readEnv('DB_SSL_CA').replace(/\\n/g, '\n');
const rejectUnauthorized = sslCa
	? !toBool(readEnv('DB_SSL_REJECT_UNAUTHORIZED_FALSE'))
	: false;

const dbConfig = {
	host,
	port: Number(urlConfig?.port || readEnv('DB_PORT') || 3306),
	user: urlConfig?.user || readEnv('DB_USER'),
	password: urlConfig?.password || readEnv('DB_PASSWORD'),
	database: urlConfig?.database || readEnv('DB_DATABASE'),
	multipleStatements: false,
	namedPlaceholders: true,
	ssl: requireSsl
		? {
			rejectUnauthorized,
			ca: sslCa || undefined
		}
		: undefined
};

const database = mysql.createPool(dbConfig);

module.exports = database;
		