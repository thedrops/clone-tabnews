import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const databaseVersion = await database.query("SHOW server_version;");
  const maxConnections = await database.query("SHOW max_connections;");
  const databaseName = process.env.POSTGRES_DB;
  const openedConnections = await database.query({
    text: `SELECT COUNT(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        max_connections: parseInt(maxConnections.rows[0].max_connections),
        opened_connections: openedConnections.rows[0].opened_connections,
      },
    },
  });
}

export default status;
