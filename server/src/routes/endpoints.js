import express from "express";
import pg from "pg";
const { Pool } = pg;

const router = express.Router();

const user = "postgres";
const password = "admin123";
const host = "localhost";
const port = 5432;
const database = "TPI";

// Endpoints
router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/students", async (req, res) => {
  const pool = new Pool({
    user: user,
    password: password,
    host: host,
    port: port,
    database: database,
  });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const queryText = 'SELECT * FROM "prueba"';
    const { rows } = await client.query(queryText);
    await client.query("COMMIT");

    console.log(rows);

    res.status(200).send(rows);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al obtener Students:", error);
    res.status(500).send("Error interno del servidor");
  } finally {
    client.release();
  }
});

// Endpoint para obtener Markers
router.get("/markers", async (req, res) => {
  const pool = new Pool({
    user: user,
    password: password,
    host: host,
    port: port,
    database: database,
  });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const queryText =
      'SELECT *, ST_AsGeoJSON("Markers".geometry) as features FROM "Markers"';
    const { rows } = await client.query(queryText);
    await client.query("COMMIT");

    const features = rows?.map((row) => {
      const { features, geometry, ...properties } = row;
      return {
        type: "Feature",
        geometry: {
          ...JSON.parse(features),
        },
        properties,
      };
    });

    res.status(200).send({ type: "FeatureCollection", features });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al obtener Markers:", error);
    res.status(500).send("Error interno del servidor");
  } finally {
    client.release();
  }
});

// Endpoint para agregar un marker
router.post("/addMarker", async (req, res) => {
  const pool = new Pool({
    user: user,
    password: password,
    host: host,
    port: port,
    database: database,
  });
  const client = await pool.connect();

  try {
    console.log(req.body);
    const { name, description } = req.body.properties;
    const { coordinates } = req.body.geometry;
    console.log(name, description, coordinates);
    await client.query("BEGIN");

    const queryText =
      'INSERT INTO public."Markers" ("Nombre", "Descripcion", geometry) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)) RETURNING *';
    const values = [name, description, coordinates[0], coordinates[1]];

    const { rows } = await client.query(queryText, values);
    await client.query("COMMIT");

    res.status(201).send(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al agregar marker:", error);
    res.status(500).send("Error interno del servidor");
  } finally {
    client.release();
  }
});

// Endpoint para la intersección de capas
router.post("/intersect", async (req, res) => {
  console.log(req.body);

  const pool = new Pool({
    user: user,
    password: password,
    host: host,
    port: port,
    database: database,
  });
  const client = await pool.connect();
  try {
    const { layersLW, coords } = req.body;
    // const { layers, coords } = req.body;
    console.log(req.body);
    const layersNames = layersLW.map((layer) => layer.sourceName);
    let wkt = "";

    if (coords.length === 2) {
      wkt = `POINT(${coords[0]} ${coords[1]})`;
    } else {
      wkt = "POLYGON((";
      for (let i = 0; i < coords[0].length - 1; i++) {
        wkt += `${coords[0][i][0]} ${coords[0][i][1]},`;
      }
      wkt += `${coords[0][0][0]} ${coords[0][0][1]}))`;
    }

    let result = {};

    await client.query("BEGIN");

    await Promise.all(
      layersNames.map(async (layer) => {
        const initialQuery = `SELECT *, ST_AsGeoJSON("${layer}".geom) as features FROM "${layer}"`;
        const query = `${initialQuery} WHERE ST_Intersects(ST_GeomFromText('${wkt}', 4326), "${layer}".geom)`;
        console.log(query);

        const { rows } = await client.query(query);

        const features = rows?.map((row) => {
          const { features, geometry, ...properties } = row;
          return {
            type: "Feature",
            geometry: {
              ...JSON.parse(features),
            },
            properties,
          };
        });

        result = {
          ...result,
          [layer]: {
            type: "FeatureCollection",
            features,
          },
        };
      })
    );

    res.status(200).send(result);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en la intersección de capas:", error);
    res.status(500).send("Error interno del servidor");
  } finally {
    client.release();
  }
});

// Endpoint para eliminar Markers
router.post("/removeMarkers", async (req, res) => {
  const pool = new Pool({
    user: user,
    password: password,
    host: host,
    port: port,
    database: database,
  });
  const client = await pool.connect();
  try {
    const { coords } = req.body;
    if (!coords) {
      return res.status(400).send("Solicitud incorrecta");
    }

    let wkt = "POLYGON((";
    for (let i = 0; i < coords[0].length - 1; i++) {
      wkt += `${coords[0][i][0]} ${coords[0][i][1]},`;
    }
    wkt += `${coords[0][0][0]} ${coords[0][0][1]}))`;

    await client.query("BEGIN");

    const queryText =
      'DELETE FROM "Markers" WHERE ST_Intersects(geometry, ST_GeomFromText($1, 4326))';
    const values = [wkt];

    const { rows } = await client.query(queryText, values);
    await client.query("COMMIT");

    res.status(201).send(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar Markers:", error);
    res.status(500).send("Error interno del servidor");
  } finally {
    client.release();
  }
});

export default router;
