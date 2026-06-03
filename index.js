require("dotenv").config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ─── DASHBOARD CON IP INYECTADA AUTOMÁTICAMENTE ───────────────────────────
const fs = require('fs');
const path = require('path');

app.get('/dashboard', (req, res) => {
    const filePath = path.join(__dirname, 'dashboard_asistencia_et_jrgs_v14.html');
    fs.readFile(filePath, 'utf8', (err, html) => {
        if (err) {
            console.error('❌ No se encontró el dashboard:', err.message);
            return res.status(404).send('Dashboard no encontrado.');
        }
        const apiUrl = `https://${req.headers.host}`;
        const htmlFinal = html.replace(/__API_URL__/g, apiUrl);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(htmlFinal);
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── CONFIGURACIÓN DE DB ─────────────────────────────────────────────────────
const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'asistencia_et',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) { console.error('❌ ERROR DE DB:', err.message); return; }
    console.log('✅ BASE DE DATOS CONECTADA');
    connection.release();
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── TABLAS MAESTRAS ─────────────────────────────────────────────────────────
app.get('/catalogos', (req, res) => {
    const queries = {
        menciones: 'SELECT id, nombre FROM menciones ORDER BY nombre ASC',
        grados: 'SELECT id, nombre FROM grados ORDER BY id ASC',
        materias: 'SELECT id, nombre FROM materias ORDER BY nombre ASC',
        estados: 'SELECT id, codigo, descripcion FROM estados_asistencia ORDER BY id ASC',
    };

    const resultado = {};
    let pendientes = Object.keys(queries).length;

    Object.entries(queries).forEach(([clave, sql]) => {
        db.query(sql, (err, rows) => {
            if (err) { console.error(`❌ Error en catálogo ${clave}:`, err.message); rows = []; }
            resultado[clave] = rows;
            pendientes--;
            if (pendientes === 0) res.json(resultado);
        });
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── LOGIN ───────────────────────────────────────────────────────────────────
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;
    console.log(`\n-- Intento de Login --\nUsuario: ${usuario}`);

    const query = `
        SELECT
            dv.id,
            dv.usuario,
            dv.contrasena,
            dv.cedula,
            dv.nombre,
            dv.apellido,
            dv.rol,
            dv.turno,
            dv.menciones_permitidas,
            m.nombre AS materia,
            dv.materia_principal_id
        FROM docentes_v2 dv
        LEFT JOIN materias m ON dv.materia_principal_id = m.id
        WHERE dv.usuario = ?
        LIMIT 1
    `;

    db.query(query, [usuario], (err, result) => {
        if (err) {
            console.error('❌ Error en query de login:', err);
            return res.status(500).json({ success: false, error: err.message });
        }
        if (result.length === 0) {
            return res.json({ success: false, campo: 'usuario', message: 'El usuario no existe' });
        }

        const docente = result[0];
        if (docente.contrasena !== contrasena) {
            return res.json({ success: false, campo: 'contrasena', message: 'Contraseña incorrecta' });
        }

        res.json({
            success: true,
            rol: docente.rol,
            usuario: docente.usuario,
            nombre: docente.nombre,
            apellido: docente.apellido,
            menciones_permitidas: docente.menciones_permitidas,
            materia: docente.materia,
        });
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── PERFIL ───────────────────────────────────────────────────────────────────
app.get('/perfil/:usuario', (req, res) => {
    const usuario = req.params.usuario;
    console.log(`\n-- GET /perfil --\nUsuario recibido: "${usuario}"`);

    // Si el usuario es inválido, responder con success:false en lugar de 404
    if (!usuario || usuario === 'undefined' || usuario === 'null' || usuario.trim() === '') {
        console.warn('⚠️  Perfil solicitado con usuario vacío o inválido');
        return res.json({ success: false, error: 'usuario_invalido' });
    }

    const query = `
        SELECT
            dv.id, dv.usuario, dv.cedula, dv.nombre, dv.apellido,
            dv.rol, dv.turno,
            dv.menciones_permitidas,
            m.nombre AS materia,
            dv.materia_principal_id
        FROM docentes_v2 dv
        LEFT JOIN materias m ON dv.materia_principal_id = m.id
        WHERE dv.usuario = ?
        LIMIT 1
    `;
    db.query(query, [usuario], (err, result) => {
        if (err) {
            console.error('❌ Error en query perfil:', err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        if (result.length === 0) {
            console.warn(`⚠️  Perfil no encontrado para usuario: "${usuario}"`);
            return res.json({ success: false, error: 'no_encontrado' });
        }
        console.log(`✅ Perfil encontrado: ${result[0].nombre} ${result[0].apellido}`);
        res.json({ success: true, datos: result[0] });
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── REGISTRO DE ESTUDIANTES (legacy) ────────────────────────────────────────
app.post('/api/estudiantes/registro', (req, res) => {
    const d = req.body;
    const query = `INSERT INTO estudiantes (nombre, apellido, cedula, mencion, ano, rep_nombre, rep_apellido, rep_cedula, rep_telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [d.nombre, d.apellido, d.cedula, d.mencion, d.ano, d.rep_nombre, d.rep_apellido, d.rep_cedula, d.rep_telefono, d.direccion];

    db.query(query, values, (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── ESTUDIANTES ─────────────────────────────────────────────────────────────
app.get('/estudiantes', (req, res) => {
    // FIX: El frontend manda "mencion" (nombre) y "grado_id" (número).
    //      Antes solo se leía "mencion_id" → el filtro de mención nunca se aplicaba.
    const { mencion_id, grado_id, mencion } = req.query;

    console.log(`\n── GET /estudiantes ──`);
    console.log(`  Query recibida: mencion="${mencion}" | mencion_id="${mencion_id}" | grado_id="${grado_id}"`);

    const condiciones = [];
    const params = [];

    // Filtro por ID numérico (compatibilidad legada)
    if (mencion_id) {
        condiciones.push('e.mencion_id = ?');
        params.push(parseInt(mencion_id));
        console.log(`  → Filtrando por mencion_id: ${mencion_id}`);
    }
    // FIX PRINCIPAL: filtro por nombre de mención (lo que manda el frontend)
    if (!mencion_id && mencion) {
        condiciones.push('men.nombre = ?');
        params.push(String(mencion).trim());
        console.log(`  → Filtrando por mencion (nombre): "${mencion}"`);
    }
    if (grado_id) {
        condiciones.push('e.grado_id = ?');
        params.push(parseInt(grado_id));
        console.log(`  → Filtrando por grado_id: ${grado_id}`);
    }

    if (condiciones.length === 0) {
        console.warn(`  ⚠️  Sin filtros aplicados — se devolverán TODOS los estudiantes`);
    }

    const where = condiciones.length > 0 ? 'WHERE ' + condiciones.join(' AND ') : '';

    const query = `
        SELECT
            e.id, e.cedula, e.nombre, e.apellido, e.nro_lista, e.seccion,
            men.nombre  AS mencion,
            men.id      AS mencion_id,
            g.nombre    AS ano,
            g.id        AS grado_id,
            gen.nombre  AS genero,
            r.nombre    AS rep_nombre,
            r.apellido  AS rep_apellido,
            r.cedula    AS rep_cedula,
            r.telefono  AS rep_telefono,
            r.direccion AS direccion,
            n.nombre    AS rep_nacionalidad
        FROM estudiantes_v2 e
        LEFT JOIN menciones  men ON e.mencion_id     = men.id
        LEFT JOIN grados     g   ON e.grado_id       = g.id
        LEFT JOIN generos    gen ON e.genero_id      = gen.id
        LEFT JOIN representantes r ON e.representante_id = r.id
        LEFT JOIN nacionalidades n ON r.nacionalidad_id  = n.id
        ${where}
        ORDER BY men.nombre ASC, g.id ASC, e.nro_lista ASC
    `;

    console.log(`  SQL WHERE: ${where || '(ninguno)'}`);
    console.log(`  Params: ${JSON.stringify(params)}`);

    db.query(query, params, (err, result) => {
        if (err) {
            console.error(`  ❌ Error al obtener estudiantes:`, err.message);
            return res.status(500).json({ error: err.message });
        }
        // Log de las menciones distintas devueltas — si todas coinciden con el filtro, está bien
        const mencionesDevueltas = [...new Set(result.map(r => r.mencion))];
        console.log(`  ✅ ${result.length} estudiantes devueltos`);
        console.log(`  Menciones en respuesta: [${mencionesDevueltas.join(', ')}]`);
        if (mencion && mencionesDevueltas.some(m => m !== String(mencion).trim())) {
            console.error(`  🚨 ALERTA: La respuesta contiene menciones distintas a "${mencion}" — revisar JOIN`);
        }
        res.json(result);
    });
});

app.get('/admin/estudiantes/:cedula', (req, res) => {
    const query = `
        SELECT
            e.id, e.cedula, e.nombre, e.apellido, e.nro_lista, e.seccion,
            men.nombre AS mencion, men.id AS mencion_id,
            g.nombre   AS ano,    g.id   AS grado_id,
            r.nombre   AS rep_nombre,
            r.apellido AS rep_apellido,
            r.cedula   AS rep_cedula,
            r.telefono AS rep_telefono,
            r.direccion AS direccion,
            n.nombre   AS rep_nacionalidad
        FROM estudiantes_v2 e
        LEFT JOIN menciones      men ON e.mencion_id      = men.id
        LEFT JOIN grados         g   ON e.grado_id        = g.id
        LEFT JOIN representantes r   ON e.representante_id = r.id
        LEFT JOIN nacionalidades n   ON r.nacionalidad_id  = n.id
        WHERE e.cedula = ?
        LIMIT 1
    `;
    db.query(query, [req.params.cedula], (err, result) => {
        if (err || result.length === 0) return res.json({ success: false });
        const est = { ...result[0], ano: result[0].ano };
        res.json({ success: true, estudiante: est });
    });
});

app.post('/admin/estudiantes', (req, res) => {
    const {
        nombre, apellido, cedula,
        // Acepta tanto IDs numéricos como nombres de texto (para compatibilidad con gestion.tsx)
        mencion_id: mencion_id_raw, grado_id: grado_id_raw,
        mencion: mencion_nombre, ano: ano_nombre,
        seccion, genero_id,
        rep_nombre, rep_apellido, rep_cedula, rep_nacionalidad_id, rep_telefono, direccion
    } = req.body;

    if (!nombre || !cedula) {
        return res.status(400).json({ success: false, error: 'Faltan campos obligatorios: nombre y cedula' });
    }


    // Cedula del estudiante se guarda con prefijo V-/E- para mostrar nacionalidad en el modal
    // Cedula del representante se limpia porque chk_cedula_rep_8 espera solo numeros
    const cedulaLimpia    = cedula;
    const repCedulaLimpia = rep_cedula ? String(rep_cedula).replace(/^[VE]-/i, '').trim() : null;

    // Función interna que hace el upsert una vez que tenemos mencion_id y grado_id
    function ejecutarConIds(mencion_id, grado_id) {
        if (!mencion_id || !grado_id) {
            return res.status(400).json({ success: false, error: 'No se pudo resolver mencion_id o grado_id' });
        }

        const upsertRep = `
        INSERT INTO representantes (cedula, nacionalidad_id, nombre, apellido, telefono, direccion)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            nacionalidad_id = VALUES(nacionalidad_id),
            nombre    = VALUES(nombre),
            apellido  = VALUES(apellido),
            telefono  = VALUES(telefono),
            direccion = VALUES(direccion)
    `;
        const nac_id = rep_nacionalidad_id ? parseInt(rep_nacionalidad_id) : 1;
        db.query(upsertRep, [repCedulaLimpia || null, nac_id, rep_nombre || null, rep_apellido || null, rep_telefono || null, direccion || null], (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });

            const getRepId = 'SELECT id FROM representantes WHERE cedula = ? LIMIT 1';
            db.query(getRepId, [repCedulaLimpia || null], (err2, repRows) => {
                const representante_id = repRows && repRows.length > 0 ? repRows[0].id : null;

                const queryMax = `
                SELECT COALESCE(MAX(nro_lista), 0) + 1 AS siguiente
                FROM estudiantes_v2
                WHERE mencion_id = ? AND grado_id = ?
            `;
                db.query(queryMax, [mencion_id, grado_id], (err3, maxResult) => {
                    if (err3) return res.status(500).json({ success: false, error: err3.message });

                    const siguiente_nro = maxResult[0].siguiente;

                    const queryInsert = `
                    INSERT INTO estudiantes_v2
                        (cedula, nombre, apellido, mencion_id, grado_id, nro_lista, seccion, genero_id, representante_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                    db.query(queryInsert, [
                        cedulaLimpia, nombre, apellido,
                        mencion_id, grado_id, siguiente_nro,
                        seccion || null, genero_id || null, representante_id
                    ], (err4) => {
                        if (err4) return res.status(500).json({ success: false, error: err4.message });
                        res.json({ success: true, nro_lista: siguiente_nro });
                    });
                });
            });
        });
    }

    // Si ya vienen IDs numéricos, usarlos directo
    if (mencion_id_raw && grado_id_raw) {
        return ejecutarConIds(parseInt(mencion_id_raw), parseInt(grado_id_raw));
    }

    // Si vienen nombres de texto (compatibilidad con gestion.tsx legacy), resolver IDs
    // Normaliza etiquetas como "1er Año", "2do Año" al número que tiene la BD en grados.nombre
    const etiquetaANumero = {
        '1er A\u00f1o': '1', '2do A\u00f1o': '2', '3er A\u00f1o': '3',
        '4to A\u00f1o': '4', '5to A\u00f1o': '5', '6to A\u00f1o': '6',
        '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
    };
    const gradoBuscar = etiquetaANumero[ano_nombre] || ano_nombre || '1';
    const mencionBuscar = mencion_nombre || 'Telem\u00e1tica';

    db.query('SELECT id FROM menciones WHERE nombre = ? LIMIT 1', [mencionBuscar], (err, mRows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!mRows || mRows.length === 0) {
            return res.status(400).json({ success: false, error: `Mención no encontrada: ${mencionBuscar}` });
        }
        const mid = mRows[0].id;

        db.query('SELECT id FROM grados WHERE nombre = ? LIMIT 1', [gradoBuscar], (err2, gRows) => {
            if (err2) return res.status(500).json({ success: false, error: err2.message });
            if (!gRows || gRows.length === 0) {
                return res.status(400).json({ success: false, error: `Grado no encontrado: ${gradoBuscar}` });
            }
            ejecutarConIds(mid, gRows[0].id);
        });
    });
});

app.put('/admin/estudiantes/:id', (req, res) => {
    const { nombre, apellido, cedula, mencion_id, grado_id, seccion, genero_id, representante_id } = req.body;
    const { id } = req.params;

    // Sanear IDs: convertir a entero o null — evita el error "Incorrect integer value"
    const toInt = v => {
        const n = parseInt(v);
        return isNaN(n) ? null : n;
    };

    const query = `
        UPDATE estudiantes_v2
        SET nombre = ?, apellido = ?, cedula = ?,
            mencion_id = ?, grado_id = ?, seccion = ?,
            genero_id = ?, representante_id = ?
        WHERE id = ?
    `;
    db.query(query, [
        nombre, apellido, cedula,
        toInt(mencion_id), toInt(grado_id), seccion || null,
        toInt(genero_id), toInt(representante_id), toInt(id)
    ], (err) => {
        if (err) {
            console.error('❌ Error al actualizar estudiante:', err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});

app.delete('/admin/estudiantes/:cedula', (req, res) => {
    db.query('DELETE FROM estudiantes_v2 WHERE cedula = ?', [req.params.cedula], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── ASISTENCIA ───────────────────────────────────────────────────────────────
// FIX: El frontend envía { estudiante_id, estado, materia, observacion }
//      (strings), así que resolvemos los IDs aquí en el backend.
app.post('/registrar-asistencia', (req, res) => {
    const { estudiante_id, estado, materia, observacion } = req.body;

    if (!estudiante_id || !estado || !materia) {
        return res.status(400).json({ success: false, error: 'Faltan campos: estudiante_id, estado, materia' });
    }

    const fecha = new Date().toISOString().split('T')[0];

    // Mapa de estado string → código en la tabla estados_asistencia
    const estadoCodigo = estado === 'Asistido' ? 'P'
        : estado === 'Inasistente' ? 'A'
            : estado === 'Retirado' ? 'R'
                : null;

    if (!estadoCodigo) {
        return res.status(400).json({ success: false, error: `Estado desconocido: ${estado}` });
    }

    // Resolver estado_id
    db.query(
        'SELECT id FROM estados_asistencia WHERE codigo = ? LIMIT 1',
        [estadoCodigo],
        (err, estadoRows) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (estadoRows.length === 0) {
                return res.status(400).json({ success: false, error: `No se encontró estado con código: ${estadoCodigo}` });
            }
            const estado_id = estadoRows[0].id;

            // Resolver materia_id (si materia es "General", la buscamos o usamos 1 como fallback)
            const materiaFinal = (!materia || materia === 'General') ? 'General' : materia;

            db.query(
                'SELECT id FROM materias WHERE nombre = ? LIMIT 1',
                [materiaFinal],
                (err2, materiaRows) => {
                    if (err2) return res.status(500).json({ success: false, error: err2.message });

                    // Si no existe la materia en la tabla, intentamos insertarla automáticamente
                    if (materiaRows.length === 0) {
                        db.query(
                            'INSERT IGNORE INTO materias (nombre) VALUES (?)',
                            [materiaFinal],
                            (err3) => {
                                if (err3) return res.status(500).json({ success: false, error: err3.message });
                                db.query('SELECT id FROM materias WHERE nombre = ? LIMIT 1', [materiaFinal], (err4, rows4) => {
                                    if (err4 || rows4.length === 0) return res.status(500).json({ success: false, error: 'No se pudo resolver materia' });
                                    insertarAsistencia(rows4[0].id);
                                });
                            }
                        );
                    } else {
                        insertarAsistencia(materiaRows[0].id);
                    }

                    function insertarAsistencia(materia_id) {
                        const query = `
                            INSERT INTO asistencias_v2 (estudiante_id, materia_id, estado_id, observaciones, fecha)
                            VALUES (?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                                estado_id     = VALUES(estado_id),
                                observaciones = VALUES(observaciones)
                        `;
                        db.query(query, [estudiante_id, materia_id, estado_id, observacion || null, fecha], (err5) => {
                            if (err5) {
                                console.error('❌ Error al registrar asistencia:', err5.message);
                                return res.status(500).json({ success: false, error: err5.message });
                            }
                            console.log(`✅ Asistencia: est.${estudiante_id} mat."${materiaFinal}"(${materia_id}) estado:"${estado}"(${estado_id})`);
                            res.json({ success: true });
                        });
                    }
                }
            );
        }
    );
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── CLASE DEL DÍA ────────────────────────────────────────────────────────────
app.get('/clase-hoy', (req, res) => {
    const { mencion, materia } = req.query;
    if (!mencion) return res.status(400).json({ error: 'Falta mencion' });

    const materiaFinal = materia || 'General';
    const fecha = new Date().toISOString().split('T')[0];

    db.query(
        'SELECT * FROM clases WHERE mencion = ? AND materia = ? AND fecha = ?',
        [mencion, materiaFinal, fecha],
        (err, hoy) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query(
                'SELECT clase_fin FROM clases WHERE mencion = ? AND materia = ? ORDER BY fecha DESC LIMIT 1',
                [mencion, materiaFinal],
                (err2, ultimo) => {
                    if (err2) return res.status(500).json({ error: err2.message });

                    const ultima_clase = ultimo.length > 0 ? ultimo[0].clase_fin : 0;
                    const clase_hoy = hoy.length > 0 ? hoy[0] : null;
                    res.json({ clase_hoy, ultima_clase });
                }
            );
        }
    );
});

app.post('/guardar-clase', (req, res) => {
    const { mencion, tema, horas, materia } = req.body;
    if (!mencion || !tema || !horas) return res.status(400).json({ error: 'Faltan datos' });

    const materiaFinal = materia || 'General';
    const fecha = new Date().toISOString().split('T')[0];

    db.query(
        'SELECT clase_fin FROM clases WHERE mencion = ? AND materia = ? ORDER BY fecha DESC LIMIT 1',
        [mencion, materiaFinal],
        (err, ultimo) => {
            if (err) return res.status(500).json({ error: err.message });

            const ultima = ultimo.length > 0 ? ultimo[0].clase_fin : 0;
            const clase_inicio = ultima + 1;
            const clase_fin = ultima + parseInt(horas);

            const query = `
                INSERT INTO clases (mencion, materia, fecha, tema, horas, clase_inicio, clase_fin)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    tema        = VALUES(tema),
                    horas       = VALUES(horas),
                    clase_inicio = VALUES(clase_inicio),
                    clase_fin   = VALUES(clase_fin)
            `;
            db.query(query, [mencion, materiaFinal, fecha, tema, horas, clase_inicio, clase_fin], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                console.log(`✅ Clase guardada: ${mencion}/${materiaFinal} - Clases ${clase_inicio}-${clase_fin}`);
                res.json({ success: true, clase_inicio, clase_fin });
            });
        }
    );
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── HISTORIAL POR FECHA ─────────────────────────────────────────────────────
app.get('/historial', (req, res) => {
    const { fecha, mencion, ano, materia } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Falta la fecha' });

    const condiciones = ['a.fecha = ?'];
    const params = [fecha];

    if (mencion) { condiciones.push('men.nombre = ?'); params.push(mencion); }
    if (ano) { condiciones.push('g.nombre = ?'); params.push(ano); }
    if (materia) { condiciones.push('mat.nombre = ?'); params.push(materia); }

    const where = condiciones.join(' AND ');

    const query = `
        SELECT
            a.id,
            a.estudiante_id,
            e.nombre, e.apellido, e.cedula, e.nro_lista,
            men.nombre  AS mencion,
            g.nombre    AS ano,
            mat.nombre  AS materia,
            ea.codigo   AS estado_codigo,
            ea.descripcion AS estado,
            a.observaciones,
            c.tema, c.clase_inicio, c.clase_fin
        FROM asistencias_v2 a
        JOIN estudiantes_v2  e   ON a.estudiante_id = e.id
        JOIN menciones       men ON e.mencion_id    = men.id
        JOIN grados          g   ON e.grado_id      = g.id
        JOIN materias        mat ON a.materia_id    = mat.id
        JOIN estados_asistencia ea ON a.estado_id   = ea.id
        LEFT JOIN clases c
            ON c.mencion = men.nombre
           AND c.materia = mat.nombre
           AND c.fecha   = a.fecha
        WHERE ${where}
        ORDER BY men.nombre ASC, mat.nombre ASC, g.nombre ASC, e.nro_lista ASC
    `;

    db.query(query, params, (err, result) => {
        if (err) {
            console.error('❌ Error en historial:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ /historial → ${result.length} registros | params: ${JSON.stringify(params)}`);
        res.json(result);
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── ESTADÍSTICAS POR MENCIÓN ─────────────────────────────────────────────────
app.get('/estadisticas/:mencion', (req, res) => {
    const { mencion } = req.params;
    const { materia } = req.query;

    const condiciones = ['men.nombre = ?'];
    const params = [mencion];

    if (materia) { condiciones.push('mat.nombre = ?'); params.push(materia); }

    const where = condiciones.join(' AND ');

    const query = `
        SELECT
            e.id,
            e.nombre,
            e.apellido,
            e.nro_lista,
            COUNT(a.id)                                              AS total_clases,
            SUM(CASE WHEN ea.codigo = 'P' THEN 1 ELSE 0 END)        AS totales_p,
            SUM(CASE WHEN ea.codigo = 'A' THEN 1 ELSE 0 END)        AS totales_a,
            SUM(CASE WHEN ea.codigo = 'R' THEN 1 ELSE 0 END)        AS totales_r
        FROM estudiantes_v2 e
        JOIN menciones men ON e.mencion_id = men.id
        LEFT JOIN asistencias_v2 a ON e.id = a.estudiante_id
        LEFT JOIN materias mat ON a.materia_id = mat.id
        LEFT JOIN estados_asistencia ea ON a.estado_id = ea.id
        WHERE ${where}
        GROUP BY e.id
        ORDER BY e.nro_lista ASC
    `;

    db.query(query, params, (err, result) => {
        if (err) {
            console.error('❌ Error en estadísticas:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── INASISTENCIAS ACUMULADAS ─────────────────────────────────────────────────
app.get('/inasistencias-acumuladas', (req, res) => {
    const { mencion, ano } = req.query;

    const condiciones = ["ea.codigo IN ('A', 'R')"];
    const params = [];

    if (mencion) { condiciones.push('men.nombre = ?'); params.push(mencion); }
    if (ano) { condiciones.push('g.nombre = ?'); params.push(ano); }

    const where = condiciones.join(' AND ');

    const query = `
        SELECT
            e.id,
            e.nombre,
            e.apellido,
            e.cedula,
            e.nro_lista,
            men.nombre  AS mencion,
            g.nombre    AS ano,
            ea.codigo   AS estado_codigo,
            ea.descripcion AS estado,
            a.observaciones,
            mat.nombre  AS materia,
            DATE_FORMAT(a.fecha, '%d/%m/%Y') AS fecha,
            r.nombre    AS rep_nombre,
            r.apellido  AS rep_apellido,
            r.telefono  AS rep_telefono
        FROM asistencias_v2 a
        JOIN estudiantes_v2    e   ON a.estudiante_id  = e.id
        JOIN menciones         men ON e.mencion_id     = men.id
        JOIN grados            g   ON e.grado_id       = g.id
        JOIN materias          mat ON a.materia_id     = mat.id
        JOIN estados_asistencia ea ON a.estado_id      = ea.id
        LEFT JOIN representantes r  ON e.representante_id = r.id
        WHERE ${where}
        ORDER BY men.nombre ASC, g.nombre ASC, e.nro_lista ASC, a.fecha DESC
    `;

    db.query(query, params, (err, rows) => {
        if (err) {
            console.error('❌ Error en inasistencias-acumuladas:', err.message);
            return res.status(500).json({ error: err.message });
        }

        const mapa = {};
        rows.forEach(r => {
            const key = String(r.id);
            if (!mapa[key]) {
                mapa[key] = {
                    nombre: r.nombre,
                    apellido: r.apellido,
                    cedula: r.cedula,
                    nro_lista: r.nro_lista,
                    mencion: r.mencion,
                    ano: r.ano,
                    rep_nombre: r.rep_nombre ?? null,
                    rep_apellido: r.rep_apellido ?? null,
                    rep_telefono: r.rep_telefono ?? null,
                    totalInasistencias: 0,
                    totalRetirados: 0,
                    registros: [],
                };
            }
            if (r.estado_codigo === 'A') mapa[key].totalInasistencias++;
            if (r.estado_codigo === 'R') mapa[key].totalRetirados++;
            mapa[key].registros.push({
                estado: r.estado,
                estado_codigo: r.estado_codigo,
                observaciones: r.observaciones,
                fecha: r.fecha,
                materia: r.materia,
            });
        });

        const resultado = Object.values(mapa).sort((a, b) => {
            if (a.mencion < b.mencion) return -1;
            if (a.mencion > b.mencion) return 1;
            return (a.nro_lista ?? 0) - (b.nro_lista ?? 0);
        });

        res.json(resultado);
    });
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── ASISTENCIA DE DOCENTES ───────────────────────────────────────────────────
app.get('/admin/docentes', (req, res) => {
    const query = `
        SELECT
            dv.id, dv.nombre, dv.apellido, dv.usuario,
            dv.rol, dv.turno,
            m.nombre AS materia
        FROM docentes_v2 dv
        LEFT JOIN materias m ON dv.materia_principal_id = m.id
        ORDER BY dv.apellido ASC
    `;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.get('/asistencia-docentes/hoy', (req, res) => {
    const hoy = new Date().toISOString().split('T')[0];
    const query = `
        SELECT ad.*, dv.nombre, dv.apellido
        FROM asistencia_docentes ad
        JOIN docentes_v2 dv ON ad.docente_id = dv.id
        WHERE ad.fecha = ?
        ORDER BY dv.apellido ASC
    `;
    db.query(query, [hoy], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.get('/verificar-asistencia-docente', (req, res) => {
    const { usuario } = req.query;
    if (!usuario) return res.status(400).json({ error: 'Falta el usuario' });

    const hoy = new Date().toISOString().split('T')[0];

    db.query('SELECT id FROM docentes_v2 WHERE usuario = ?', [usuario], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ habilitado: false, motivo: 'Docente no encontrado' });

        const docente_id = result[0].id;

        db.query(
            'SELECT estado FROM asistencia_docentes WHERE docente_id = ? AND fecha = ?',
            [docente_id, hoy],
            (err2, rows) => {
                if (err2) return res.status(500).json({ error: err2.message });
                if (rows.length === 0) return res.json({ habilitado: false, motivo: 'sin_registro' });

                const estado = rows[0].estado;
                if (estado === 'Ausente') return res.json({ habilitado: false, motivo: 'ausente' });
                return res.json({ habilitado: true, estado });
            }
        );
    });
});

app.post('/asistencia-docentes', (req, res) => {
    const { docente_id, estado, bloque_clase, observaciones } = req.body;
    if (!docente_id || !estado) return res.status(400).json({ error: 'Faltan datos obligatorios' });

    const fecha = new Date().toISOString().split('T')[0];
    const query = `
        INSERT INTO asistencia_docentes (docente_id, fecha, estado, bloque_clase, observaciones)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            estado        = VALUES(estado),
            bloque_clase  = VALUES(bloque_clase),
            observaciones = VALUES(observaciones)
    `;
    db.query(query, [docente_id, fecha, estado, bloque_clase ?? null, observaciones ?? null], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

app.get('/asistencia-docentes/historial', (req, res) => {
    const { desde, hasta } = req.query;
    const condiciones = [];
    const params = [];
    if (desde) { condiciones.push('ad.fecha >= ?'); params.push(desde); }
    if (hasta) { condiciones.push('ad.fecha <= ?'); params.push(hasta); }
    const where = condiciones.length > 0 ? 'WHERE ' + condiciones.join(' AND ') : '';

    const query = `
        SELECT
            ad.id, ad.fecha, ad.estado, ad.bloque_clase, ad.observaciones,
            dv.nombre, dv.apellido,
            m.nombre AS materia
        FROM asistencia_docentes ad
        JOIN docentes_v2 dv ON ad.docente_id = dv.id
        LEFT JOIN materias m ON dv.materia_principal_id = m.id
        ${where}
        ORDER BY ad.fecha DESC, dv.apellido ASC
    `;
    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
// ─────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVIDOR COMPARTIDO`);
    console.log(`Local:    http://localhost:${PORT}`);
    console.log(`En la red: http://TU_IP_AQUI:${PORT}`);
});
