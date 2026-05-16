const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ─── SERVIR EL DASHBOARD COMO ARCHIVO ESTÁTICO ───────────────────────────────
// Accede en: http://localhost:3000/dashboard_asistencia_et_jrgs_v2.html
// En la red:  http://192.168.101.8:3000/dashboard_asistencia_et_jrgs_v2.html
app.use(express.static(__dirname));

// CONFIGURACIÓN DE DB
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'asistencia_et',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ ERROR DE DB:', err.message);
        return;
    }
    console.log('✅ BASE DE DATOS CONECTADA');
    connection.release();
});

// --- RUTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;
    console.log(`\n-- Intento de Login --\nUsuario: ${usuario}`);

    const queryUsuario = 'SELECT usuario, contrasena, rol, menciones_permitidas, materia FROM docentes WHERE usuario = ?';
    db.query(queryUsuario, [usuario], (err, result) => {
        if (err) {
            console.error('❌ Error en query:', err);
            return res.status(500).json({ success: false, error: err });
        }
        if (result.length === 0) {
            return res.json({ success: false, campo: 'usuario', message: 'El usuario no existe' });
        }
        if (result[0].contrasena !== contrasena) {
            return res.json({ success: false, campo: 'contrasena', message: 'La contraseña es incorrecta' });
        }

        console.log('✅ Login exitoso para:', result[0].usuario);
        res.json({
            success: true,
            rol: result[0].rol,
            usuario: result[0].usuario,
            menciones_permitidas: result[0].menciones_permitidas || null,
            // materia puede ser "Programación,Orientación" o una sola materia o null
            materia: result[0].materia || null
        });
    });
});

// --- ESTUDIANTES ---
app.get('/estudiantes', (req, res) => {
    db.query('SELECT * FROM estudiantes ORDER BY mencion, nro_lista ASC', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// --- GESTIÓN (Añadir/Borrar) ---
app.post('/admin/estudiantes', (req, res) => {
    const { nombre, apellido, cedula, mencion, ano } = req.body;

    const queryMax = 'SELECT COALESCE(MAX(nro_lista), 0) + 1 AS siguiente FROM estudiantes WHERE mencion = ? AND ano = ?';
    db.query(queryMax, [mencion, ano], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        const siguiente_nro = result[0].siguiente;
        const queryInsert = 'INSERT INTO estudiantes (nombre, apellido, cedula, mencion, ano, nro_lista) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(queryInsert, [nombre, apellido, cedula, mencion, ano, siguiente_nro], (err2) => {
            if (err2) return res.status(500).json({ success: false, error: err2.message });
            res.json({ success: true, nro_lista: siguiente_nro });
        });
    });
});

app.get('/admin/estudiantes/:cedula', (req, res) => {
    db.query('SELECT * FROM estudiantes WHERE cedula = ?', [req.params.cedula], (err, result) => {
        if (err || result.length === 0) return res.json({ success: false });
        res.json({ success: true, estudiante: result[0] });
    });
});

app.delete('/admin/estudiantes/:cedula', (req, res) => {
    db.query('DELETE FROM estudiantes WHERE cedula = ?', [req.params.cedula], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.put('/admin/estudiantes/:id', (req, res) => {
    const { nombre, apellido, cedula, mencion, ano, rep_nombre, rep_apellido, rep_cedula, rep_telefono, direccion } = req.body;
    const { id } = req.params;

    const query = `
        UPDATE estudiantes SET
            nombre = ?, apellido = ?, cedula = ?, mencion = ?, ano = ?,
            rep_nombre = ?, rep_apellido = ?, rep_cedula = ?, rep_telefono = ?, direccion = ?
        WHERE id = ?
    `;
    db.query(query, [nombre, apellido, cedula, mencion, ano, rep_nombre, rep_apellido, rep_cedula, rep_telefono, direccion, id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// --- REGISTRAR ASISTENCIA ---
// Ahora acepta "materia" en el body. Si no se envía, usa 'General'.
app.post('/registrar-asistencia', (req, res) => {
    const { estudiante_id, estado, observacion, materia } = req.body;
    const fecha = new Date().toISOString().split('T')[0];
    const materiaFinal = materia || 'General';

    const query = `
        INSERT INTO asistencias (estudiante_id, materia, estado, observaciones, fecha)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE estado = VALUES(estado), observaciones = VALUES(observaciones)
    `;
    db.query(query, [estudiante_id, materiaFinal, estado, observacion || null, fecha], (err) => {
        if (err) {
            console.error('❌ Error al registrar asistencia:', err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        console.log(`✅ Asistencia guardada: estudiante ${estudiante_id} [${materiaFinal}] -> ${estado}`);
        res.json({ success: true });
    });
});

// --- OBTENER CLASE DEL DÍA ---
// Ahora acepta ?mencion=X&materia=Y
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

// --- GUARDAR CLASE DEL DÍA ---
// Ahora acepta "materia" en el body
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
                    tema = VALUES(tema),
                    horas = VALUES(horas),
                    clase_inicio = VALUES(clase_inicio),
                    clase_fin = VALUES(clase_fin)
            `;
            db.query(query, [mencion, materiaFinal, fecha, tema, horas, clase_inicio, clase_fin], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                console.log(`✅ Clase guardada: ${mencion}/${materiaFinal} - Clases ${clase_inicio}-${clase_fin} - Tema: ${tema}`);
                res.json({ success: true, clase_inicio, clase_fin });
            });
        }
    );
});

// --- HISTORIAL POR FECHA ---
// Ahora soporta filtro opcional ?materia=X
app.get('/historial', (req, res) => {
    const { fecha, mencion, ano, materia } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Falta la fecha' });

    const condiciones = ['a.fecha = ?'];
    const params = [fecha];

    if (mencion) { condiciones.push('e.mencion = ?'); params.push(mencion); }
    if (ano) { condiciones.push('e.ano = ?'); params.push(ano); }
    if (materia) { condiciones.push('a.materia = ?'); params.push(materia); }

    const where = condiciones.join(' AND ');

    const query = `
        SELECT
            a.id,
            e.nombre,
            e.apellido,
            e.cedula,
            e.mencion,
            e.ano,
            e.nro_lista,
            a.materia,
            a.estado,
            a.observaciones,
            c.tema,
            c.clase_inicio,
            c.clase_fin
        FROM asistencias a
        JOIN estudiantes e ON a.estudiante_id = e.id
        LEFT JOIN clases c ON c.mencion = e.mencion AND c.materia = a.materia AND c.fecha = a.fecha
        WHERE ${where}
        ORDER BY e.mencion, a.materia, e.ano ASC, e.nro_lista ASC
    `;

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// --- ESTADÍSTICAS POR MENCIÓN ---
// Ahora soporta filtro opcional ?materia=X
app.get('/estadisticas/:mencion', (req, res) => {
    const { mencion } = req.params;
    const { materia } = req.query;

    const condiciones = ['e.mencion = ?'];
    const params = [mencion];
    if (materia) { condiciones.push('(a.materia = ? OR a.materia IS NULL)'); params.push(materia); }

    const where = condiciones.join(' AND ');

    const query = `
        SELECT
            e.id,
            e.nombre,
            e.apellido,
            e.nro_lista,
            COUNT(a.id)                                              AS total_clases,
            SUM(CASE WHEN a.estado = 'Asistido'    THEN 1 ELSE 0 END) AS totales_p,
            SUM(CASE WHEN a.estado = 'Inasistente' THEN 1 ELSE 0 END) AS totales_a,
            SUM(CASE WHEN a.estado = 'Retirado'    THEN 1 ELSE 0 END) AS totales_r
        FROM estudiantes e
        LEFT JOIN asistencias a ON e.id = a.estudiante_id
        WHERE ${where}
        GROUP BY e.id
        ORDER BY e.nro_lista ASC
    `;
    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// --- INASISTENCIAS ACUMULADAS (para el admin) ---
app.get('/inasistencias-acumuladas', (req, res) => {
    const { mencion, ano } = req.query;

    const condiciones = ["a.estado IN ('Inasistente', 'Retirado')"];
    const params = [];

    if (mencion) { condiciones.push('e.mencion = ?'); params.push(mencion); }
    if (ano) { condiciones.push('e.ano = ?'); params.push(ano); }

    const where = condiciones.join(' AND ');

    const query = `
        SELECT
            e.id,
            e.nombre,
            e.apellido,
            e.cedula,
            e.nro_lista,
            e.mencion,
            e.ano,
            a.estado,
            a.observaciones,
            DATE_FORMAT(a.fecha, '%d/%m/%Y') AS fecha,
            a.materia
        FROM asistencias a
        JOIN estudiantes e ON a.estudiante_id = e.id
        WHERE ${where}
        ORDER BY e.mencion ASC, e.ano ASC, e.nro_lista ASC, a.fecha DESC
    `;

    db.query(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Agrupar por estudiante
        const mapa = {};
        rows.forEach(r => {
            const key = `${r.id}`;
            if (!mapa[key]) {
                mapa[key] = {
                    nombre: r.nombre,
                    apellido: r.apellido,
                    cedula: r.cedula,
                    nro_lista: r.nro_lista,
                    mencion: r.mencion,
                    ano: r.ano,
                    totalInasistencias: 0,
                    totalRetirados: 0,
                    registros: [],
                };
            }
            if (r.estado === 'Inasistente') mapa[key].totalInasistencias++;
            if (r.estado === 'Retirado') mapa[key].totalRetirados++;
            mapa[key].registros.push({
                estado: r.estado,
                observaciones: r.observaciones,
                fecha: r.fecha,
                materia: r.materia,
            });
        });

        const resultado = Object.values(mapa).sort((a, b) => {
            if (a.mencion < b.mencion) return -1;
            if (a.mencion > b.mencion) return 1;
            if (Number(a.ano) !== Number(b.ano)) return Number(a.ano) - Number(b.ano);
            return (a.nro_lista ?? 0) - (b.nro_lista ?? 0);
        });

        res.json(resultado);
    });
});

// --- PERFIL ---
app.get('/perfil/:usuario', (req, res) => {
    db.query('SELECT * FROM docentes WHERE usuario = ?', [req.params.usuario], (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ success: false });
        res.json({ success: true, datos: result[0] });
    });
});


// ─── ASISTENCIA DE DOCENTES ───────────────────────────────────────────────────

app.get('/admin/docentes', (req, res) => {
    db.query(
        'SELECT id, nombre, apellido, usuario, materia, rol FROM docentes ORDER BY apellido ASC',
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result);
        }
    );
});

app.get('/asistencia-docentes/hoy', (req, res) => {
    const hoy = new Date().toISOString().split('T')[0];
    db.query('SELECT * FROM asistencia_docentes WHERE fecha = ?', [hoy], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// --- VERIFICAR SI UN DOCENTE TIENE ASISTENCIA REGISTRADA HOY ---
// Usado por el docente al entrar a pasar lista: si el admin no lo registró, se bloquea.
app.get('/verificar-asistencia-docente', (req, res) => {
    const { usuario } = req.query;
    if (!usuario) return res.status(400).json({ error: 'Falta el usuario' });

    const hoy = new Date().toISOString().split('T')[0];

    // 1. Obtener el id del docente a partir del usuario
    db.query('SELECT id FROM docentes WHERE usuario = ?', [usuario], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ habilitado: false, motivo: 'Docente no encontrado' });

        const docente_id = result[0].id;

        // 2. Verificar si existe registro de asistencia hoy para ese docente
        db.query(
            'SELECT estado FROM asistencia_docentes WHERE docente_id = ? AND fecha = ?',
            [docente_id, hoy],
            (err2, rows) => {
                if (err2) return res.status(500).json({ error: err2.message });

                if (rows.length === 0) {
                    // No hay registro: el admin aún no lo marcó
                    return res.json({ habilitado: false, motivo: 'sin_registro' });
                }

                const estado = rows[0].estado;

                if (estado === 'Ausente') {
                    // El admin lo marcó como ausente: no puede pasar lista
                    return res.json({ habilitado: false, motivo: 'ausente' });
                }

                // Presente o Tardanza: puede pasar lista
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
            d.nombre, d.apellido, d.materia
        FROM asistencia_docentes ad
        JOIN docentes d ON ad.docente_id = d.id
        ${where}
        ORDER BY ad.fecha DESC, d.apellido ASC
    `;
    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVIDOR COMPARTIDO`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`En la red: http://TU_IP_AQUI:${PORT}`);
});
