import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity,
    TextInput, Alert, Platform, Image, ToastAndroid, Modal, ScrollView,
    KeyboardAvoidingView, Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import { API_URL } from '../constants';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function AsistenciaScreen() {
    const { seleccion, rol, anoFiltro, materia: materiaParam, usuario, menciones_permitidas } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const materiasDisponibles: string[] = (() => {
        const raw = String(materiaParam ?? '').trim();
        if (!raw || raw === 'null' || raw === 'undefined') return ['General'];
        const lista = raw.split(',').map(m => m.trim()).filter(Boolean);
        return lista.length > 0 ? lista : ['General'];
    })();

    const [materiaActiva, setMateriaActiva] = useState<string>(materiasDisponibles[0]);
    const [estudiantes, setEstudiantes] = useState<any[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [asistenciaPorMateria, setAsistenciaPorMateria] = useState<Record<string, Record<number, string>>>({});
    const [comentariosPorMateria, setComentariosPorMateria] = useState<Record<string, Record<number, string>>>({});
    const [busqueda, setBusqueda] = useState('');
    const [tema, setTema] = useState('');
    const [horas, setHoras] = useState(2);
    const [claseInfo, setClaseInfo] = useState<any>(null);
    const [siguienteClase, setSiguienteClase] = useState(1);
    const [guardandoClase, setGuardandoClase] = useState(false);
    const [claseExpandida, setClaseExpandida] = useState(false);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const formEdicion = useRef<any>({});
    const [guardandoEdicion, setGuardandoEdicion] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [vistaFinal, setVistaFinal] = useState(false);

    const [headerVisible, setHeaderVisible] = useState(true);
    // ──────────────────────────────────────────────────────────────────────────

    const esAdmin = rol === 'admin';

    const [accesoBloqueado, setAccesoBloqueado] = useState<false | 'sin_registro' | 'ausente' | 'verificando'>('verificando');

    useEffect(() => {
        if (esAdmin) { setAccesoBloqueado(false); return; }
        const verificar = async () => {
            try {
                const res = await axios.get(`${API_URL}/verificar-asistencia-docente`, {
                    params: { usuario: String(usuario ?? '') }
                });
                setAccesoBloqueado(res.data.habilitado ? false : res.data.motivo);
            } catch {
                setAccesoBloqueado('sin_registro');
            }
        };
        verificar();
    }, []);

    const asistenciaMarcada = asistenciaPorMateria[materiaActiva] ?? {};
    const comentarios = comentariosPorMateria[materiaActiva] ?? {};

    const setAsistenciaMarcada = (updater: (prev: Record<number, string>) => Record<number, string>) => {
        setAsistenciaPorMateria(prev => ({ ...prev, [materiaActiva]: updater(prev[materiaActiva] ?? {}) }));
    };
    const setComentarios = (updater: (prev: Record<number, string>) => Record<number, string>) => {
        setComentariosPorMateria(prev => ({ ...prev, [materiaActiva]: updater(prev[materiaActiva] ?? {}) }));
    };

    const totalEstudiantes = estudiantes.length;
    const totalMarcados = Object.keys(asistenciaMarcada).length;
    const listaCompleta = totalEstudiantes > 0 && totalMarcados >= totalEstudiantes;
    const porcentajeMarcado = totalEstudiantes > 0 ? Math.round((totalMarcados / totalEstudiantes) * 100) : 0;

    const cargarDatos = useCallback(async () => {
        // FIX: Se agregó materiaActiva a las dependencias para que useCallback
        //      no capture un valor obsoleto de materiaActiva al llamar cargarAsistenciasHoy.
        console.log(`\n── cargarDatos() ──`);
        console.log(`  seleccion (mención): "${seleccion}"`);
        console.log(`  anoFiltro: "${anoFiltro}"`);
        console.log(`  materiaActiva: "${materiaActiva}"`);

        try {
            const params: any = {};
            if (seleccion) params.mencion = String(seleccion);
            if (anoFiltro) params.grado_id = parseInt(String(anoFiltro));

            console.log(`  → Llamando GET /estudiantes con params:`, params);

            const res = await axios.get(`${API_URL}/estudiantes`, { params });

            console.log(`  ✅ Respuesta: ${res.data.length} estudiantes`);
            if (res.data.length > 0) {
                const mencionesRecibidas = [...new Set(res.data.map((e: any) => e.mencion))];
                console.log(`  Menciones recibidas: [${mencionesRecibidas.join(', ')}]`);
                if (seleccion && mencionesRecibidas.some((m: any) => m !== String(seleccion))) {
                    console.error(`  🚨 ERROR: Se recibieron estudiantes de menciones distintas a "${seleccion}"`);
                    console.error(`     → El backend NO está filtrando correctamente por mención`);
                }
            } else {
                console.warn(`  ⚠️  Sin estudiantes — ¿existe la mención "${seleccion}" en la BD?`);
            }

            const ordenados = [...res.data].sort(
                (a: any, b: any) => (a.nro_lista ?? 0) - (b.nro_lista ?? 0)
            );
            setEstudiantes(ordenados);
            // Pasar lista fresca porque el state 'estudiantes' aún no actualizó
            await cargarAsistenciasHoy(ordenados, materiaActiva);
        } catch (error: any) {
            console.error(`  ❌ Error en cargarDatos:`, error?.message ?? error);
            Alert.alert("Error de Conexión", "Asegúrate de que el servidor esté corriendo correctamente.");
        } finally {
            setCargando(false);
        }
        // FIX: materiaActiva añadida a las dependencias (antes faltaba)
    }, [seleccion, anoFiltro, materiaActiva]);

    const cargarClaseHoy = useCallback(async (materia: string) => {
        try {
            const res = await axios.get(`${API_URL}/clase-hoy`, { params: { mencion: seleccion, materia } });
            setSiguienteClase(res.data.ultima_clase + 1);
            if (res.data.clase_hoy) {
                setClaseInfo(res.data.clase_hoy);
                setTema(res.data.clase_hoy.tema);
                setHoras(res.data.clase_hoy.horas);
            } else {
                setClaseInfo(null); setTema(''); setHoras(2);
            }
        } catch (e) { console.error('Error al cargar clase del día'); }
    }, [seleccion]);

    // Carga las asistencias ya registradas hoy para no perderlas al volver
    // Carga asistencias de hoy y decide si mostrar vistaFinal
    // Recibe la lista fresca de estudiantes y la materia activa para no depender del state async
    const cargarAsistenciasHoy = useCallback(async (listaFresca: any[], materiaFresca: string) => {
        console.log(`\n── cargarAsistenciasHoy() ──`);
        console.log(`  mención: "${seleccion}" | año: "${anoFiltro}" | materia: "${materiaFresca}"`);
        console.log(`  Total estudiantes en lista fresca: ${listaFresca.length}`);
        try {
            const hoy = new Date().toISOString().split('T')[0];
            const res = await axios.get(`${API_URL}/historial`, {
                params: { fecha: hoy, mencion: String(seleccion), ano: String(anoFiltro ?? '') }
            });
            if (!res.data || res.data.length === 0) {
                console.log(`  → Sin asistencias previas hoy para "${seleccion}"`);
                return;
            }
            console.log(`  → ${res.data.length} registros de asistencia encontrados hoy`);

            const nuevaAsistencia: Record<string, Record<number, string>> = {};
            const nuevosComentarios: Record<string, Record<number, string>> = {};

            for (const reg of res.data) {
                const mat = reg.materia || 'General';
                if (!nuevaAsistencia[mat]) nuevaAsistencia[mat] = {};
                if (!nuevosComentarios[mat]) nuevosComentarios[mat] = {};
                // Mapeamos por codigo (P/A/R) que es 100% confiable,
                // y lo convertimos al string que usa el frontend
                const codigoAEstado: Record<string, string> = {
                    'P': 'Asistido', 'A': 'Inasistente', 'R': 'Retirado'
                };
                const estadoFrontend = codigoAEstado[reg.estado_codigo]
                    ?? (['Asistido', 'Inasistente', 'Retirado'].includes(reg.estado) ? reg.estado : null);
                if (estadoFrontend && reg.estudiante_id) {
                    nuevaAsistencia[mat][reg.estudiante_id] = estadoFrontend;
                }
                if (reg.observaciones && reg.estudiante_id) {
                    nuevosComentarios[mat][reg.estudiante_id] = reg.observaciones;
                }
            }

            setAsistenciaPorMateria(nuevaAsistencia);
            setComentariosPorMateria(nuevosComentarios);

            // Verificar si la lista ya está completa para la materia activa
            const asistenciaActiva = nuevaAsistencia[materiaFresca] ?? {};
            const idsConAsistencia = Object.keys(asistenciaActiva).map(Number);
            const todosPresentes = listaFresca.length > 0 &&
                listaFresca.every((e: any) => idsConAsistencia.includes(e.id));
            if (todosPresentes) {
                setVistaFinal(true);
                // Avisar al docente que ya existe asistencia guardada hoy
                Alert.alert(
                    'Lista ya registrada',
                    `Ya registraste la asistencia de hoy para "${materiaFresca}". Se muestra en modo solo lectura.\n\nToca "Editar Asistencia" si necesitas hacer cambios.`,
                    [{ text: 'Entendido' }]
                );
            }

        } catch (e) { /* silencioso — no bloquea la pantalla */ }
    }, [seleccion, anoFiltro]);

    // Re-cargar cuando cambie la mención o el año (el admin puede navegar sin desmontar la pantalla)
    useEffect(() => {
        console.log(`\n══ useEffect [seleccion, anoFiltro] ══`);
        console.log(`  Nueva selección → mención: "${seleccion}" | año: "${anoFiltro}"`);
        setCargando(true);
        setEstudiantes([]);
        setAsistenciaPorMateria({});
        setComentariosPorMateria({});
        setVistaFinal(false);
        setBusqueda('');
        cargarDatos();
        cargarClaseHoy(materiaActiva);
    }, [seleccion, anoFiltro]);

    const cambiarMateria = (nuevaMateria: string) => {
        if (nuevaMateria === materiaActiva) return;
        const tieneDatos = Object.keys(asistenciaPorMateria[materiaActiva] ?? {}).length > 0;
        const hacerCambio = () => {
            setMateriaActiva(nuevaMateria);
            setBusqueda('');
            cargarClaseHoy(nuevaMateria);
        };
        if (tieneDatos) {
            Alert.alert(
                `¿Cambiar a ${nuevaMateria}?`,
                `El progreso de "${materiaActiva}" se conserva. Puedes regresar en cualquier momento.`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Cambiar', onPress: hacerCambio },
                ]
            );
        } else {
            hacerCambio();
        }
    };

    const guardarClase = async () => {
        if (!tema.trim()) return Alert.alert('Error', 'Escribe el tema de la clase antes de guardar.');
        setGuardandoClase(true);
        try {
            const res = await axios.post(`${API_URL}/guardar-clase`, {
                mencion: seleccion, materia: materiaActiva, tema: tema.trim(), horas
            });
            if (res.data.success) {
                setClaseInfo({ tema: tema.trim(), horas, clase_inicio: res.data.clase_inicio, clase_fin: res.data.clase_fin });
                Alert.alert('✅ Guardado', `Clase ${res.data.clase_inicio === res.data.clase_fin ? res.data.clase_inicio : res.data.clase_inicio + ' y ' + res.data.clase_fin} registrada.`);
            }
        } catch (e) {
            Alert.alert('Error', 'No se pudo guardar la clase.');
        } finally {
            setGuardandoClase(false);
        }
    };

    const etiquetaClase = claseInfo
        ? (claseInfo.clase_inicio === claseInfo.clase_fin ? `Clase ${claseInfo.clase_inicio}` : `Clases ${claseInfo.clase_inicio} y ${claseInfo.clase_fin}`)
        : null;

    // ── FIX PRINCIPAL: enviamos estado y materia como strings ────────────────
    const enviarAsistencia = async (id: number, estado: string) => {
        if (asistenciaMarcada[id] === estado) return;
        try {
            const obs = comentarios[id] || "";
            await axios.post(`${API_URL}/registrar-asistencia`, {
                estudiante_id: id,
                estado,           // "Asistido" | "Inasistente" | "Retirado"
                materia: materiaActiva,
                observacion: obs,
            });
            setAsistenciaMarcada(prev => ({ ...prev, [id]: estado }));
            if (Platform.OS === 'android') ToastAndroid.show(`${materiaActiva}: ${estado}`, ToastAndroid.SHORT);
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la asistencia.");
        }
    };
    // ──────────────────────────────────────────────────────────────────────────

    const exportarExcel = async () => {
        if (totalMarcados === 0) {
            Alert.alert('Sin datos', 'No hay asistencias marcadas aún para exportar.');
            return;
        }
        setExportando(true);
        try {
            const hoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const etiquetasAno: Record<string, string> = {
                '1': '1er Año', '2': '2do Año', '3': '3er Año', '4': '4to Año', '5': '5to Año',
            };
            const anoLabel = etiquetasAno[String(anoFiltro)] ?? `${anoFiltro}° Año`;

            // Construir filas para cada materia que tenga registros
            const materiasConDatos = materiasDisponibles.filter(
                m => Object.keys(asistenciaPorMateria[m] ?? {}).length > 0
            );

            const wb = XLSX.utils.book_new();

            for (const mat of materiasConDatos) {
                const asistencia = asistenciaPorMateria[mat] ?? {};
                const comentarios = comentariosPorMateria[mat] ?? {};

                // Encabezado informativo
                const encabezado = [
                    ['Institución:', 'E.T. J.R.G.S'],
                    ['Mención:', String(seleccion)],
                    ['Año:', anoLabel],
                    ['Materia:', mat],
                    ['Fecha:', hoy],
                    [],
                    ['N°', 'Nombre', 'Apellido', 'Cédula', 'Estado', 'Observaciones'],
                ];

                // Filas de estudiantes
                const filas = estudiantes.map((e, idx) => {
                    const estado = asistencia[e.id] ?? 'Sin marcar';
                    const obs = comentarios[e.id] ?? '';
                    return [
                        e.nro_lista ?? idx + 1,
                        e.nombre,
                        e.apellido,
                        e.cedula ?? '',
                        estado,
                        obs,
                    ];
                });

                // Fila de resumen
                const presentes = Object.values(asistencia).filter(v => v === 'Asistido').length;
                const ausentes = Object.values(asistencia).filter(v => v === 'Inasistente').length;
                const retirados = Object.values(asistencia).filter(v => v === 'Retirado').length;
                const resumen = [
                    [],
                    ['', 'RESUMEN', '', '', '', ''],
                    ['', 'Presentes:', presentes, '', '', ''],
                    ['', 'Inasistentes:', ausentes, '', '', ''],
                    ['', 'Retirados:', retirados, '', '', ''],
                    ['', 'Total:', estudiantes.length, '', '', ''],
                ];

                const datos = [...encabezado, ...filas, ...resumen];
                const ws = XLSX.utils.aoa_to_sheet(datos);

                // Ancho de columnas
                ws['!cols'] = [
                    { wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 30 }
                ];

                const nombreHoja = mat.length > 31 ? mat.substring(0, 31) : mat;
                XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
            }

            // Convertir a base64
            const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

            const nombreArchivo = `asistencia_${String(seleccion).replace(/\s/g, '_')}_${String(anoFiltro)}ano_${new Date().toISOString().split('T')[0]}.xlsx`;
            const fileUri = FileSystem.cacheDirectory + nombreArchivo;

            await FileSystem.writeAsStringAsync(fileUri, wbout, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const puedeCompartir = await Sharing.isAvailableAsync();
            if (puedeCompartir) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    dialogTitle: `Asistencia ${seleccion} - ${anoLabel}`,
                    UTI: 'com.microsoft.excel.xlsx',
                });
            } else {
                Alert.alert('Error', 'No se puede compartir archivos en este dispositivo.');
            }
        } catch (e) {
            console.error('Error al exportar:', e);
            Alert.alert('Error', 'No se pudo generar el archivo Excel.');
        } finally {
            setExportando(false);
        }
    };

    const abrirPerfil = (estudiante: any) => {
        setEstudianteSeleccionado(estudiante);
        formEdicion.current = {
            nombre: estudiante.nombre || '', apellido: estudiante.apellido || '',
            cedula: estudiante.cedula || '', mencion: estudiante.mencion || '',
            ano: estudiante.ano?.toString() || '', rep_nombre: estudiante.rep_nombre || '',
            rep_apellido: estudiante.rep_apellido || '', rep_cedula: estudiante.rep_cedula || '',
            rep_telefono: estudiante.rep_telefono || '', direccion: estudiante.direccion || '',
        };
        setModoEdicion(false);
        setModalVisible(true);
    };

    const guardarEdicion = async () => {
        const datos = formEdicion.current;
        if (!datos.nombre || !datos.cedula) { Alert.alert('Error', 'El nombre y la cédula son obligatorios.'); return; }
        setGuardandoEdicion(true);
        try {
            const res = await axios.put(`${API_URL}/admin/estudiantes/${estudianteSeleccionado.id}`, datos);
            if (res.data.success) {
                setEstudiantes(prev => prev.map(e => e.id === estudianteSeleccionado.id ? { ...e, ...datos } : e));
                setEstudianteSeleccionado((prev: any) => ({ ...prev, ...datos }));
                setModoEdicion(false);
                Alert.alert('✅ Guardado', 'Los datos del estudiante fueron actualizados.');
            } else { Alert.alert('Error', 'No se pudieron guardar los cambios.'); }
        } catch (e) {
            Alert.alert('Error', 'Error de conexión al guardar.');
        } finally { setGuardandoEdicion(false); }
    };

    const totalPresentes = Object.values(asistenciaMarcada).filter(v => v === 'Asistido').length;
    const totalAusentes = Object.values(asistenciaMarcada).filter(v => v === 'Inasistente').length;
    const totalRetirados = Object.values(asistenciaMarcada).filter(v => v === 'Retirado').length;

    const estudiantesFiltrados = estudiantes.filter(e =>
        (e.nro_lista?.toString() ?? '').includes(busqueda) ||
        (e.nombre?.toLowerCase() ?? '').includes(busqueda.toLowerCase())
    );

    const renderItem = ({ item }: { item: any }) => {
        const estado = asistenciaMarcada[item.id];
        const yaRegistrado = !!estado;

        if (esAdmin) {
            return (
                <TouchableOpacity style={styles.card} onPress={() => abrirPerfil(item)} activeOpacity={0.75}>
                    <View style={styles.cardContent}>
                        <View style={styles.fotoCont}>
                            <View style={styles.badge}><Text style={styles.badgeText}>{item.nro_lista}</Text></View>
                            <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.nombre}+${item.apellido}&background=1e293b&color=38bdf8&bold=true` }} style={styles.foto} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
                            <Text style={styles.cedulaAdmin}>CI: {item.cedula || '—'}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#334155" />
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <View style={[
                styles.card,
                estado === 'Asistido' && styles.borderP,
                estado === 'Inasistente' && styles.borderA,
                estado === 'Retirado' && styles.borderR,
                yaRegistrado && styles.cardRegistrado,
            ]}>
                <View style={styles.cardContent}>
                    <TouchableOpacity style={styles.fotoCont} onPress={() => abrirPerfil(item)} activeOpacity={0.7}>
                        <View style={styles.badge}><Text style={styles.badgeText}>{item.nro_lista}</Text></View>
                        <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.nombre}+${item.apellido}&background=1e293b&color=38bdf8&bold=true` }} style={styles.foto} />
                        {yaRegistrado && (
                            <View style={[
                                styles.checkOverlay,
                                estado === 'Asistido' && { backgroundColor: '#10B981' },
                                estado === 'Inasistente' && { backgroundColor: '#EF4444' },
                                estado === 'Retirado' && { backgroundColor: '#F59E0B' },
                            ]}>
                                <Ionicons name="checkmark" size={14} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => abrirPerfil(item)} activeOpacity={0.7}>
                            <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
                        </TouchableOpacity>
                        {yaRegistrado && (
                            <View style={[
                                styles.estadoChip,
                                estado === 'Asistido' && { backgroundColor: '#10B98120', borderColor: '#10B98150' },
                                estado === 'Inasistente' && { backgroundColor: '#EF444420', borderColor: '#EF444450' },
                                estado === 'Retirado' && { backgroundColor: '#F59E0B20', borderColor: '#F59E0B50' },
                            ]}>
                                <Text style={[
                                    styles.estadoChipText,
                                    estado === 'Asistido' && { color: '#10B981' },
                                    estado === 'Inasistente' && { color: '#EF4444' },
                                    estado === 'Retirado' && { color: '#F59E0B' },
                                ]}>
                                    {estado === 'Asistido' ? '✓ Presente' : estado === 'Inasistente' ? '✗ Inasistente' : '↩ Retirado'}
                                </Text>
                            </View>
                        )}
                        <TextInput
                            style={styles.inputObs}
                            placeholder="Agregar nota..."
                            placeholderTextColor="#475569"
                            value={comentarios[item.id] || ''}
                            onChangeText={(txt) => setComentarios(prev => ({ ...prev, [item.id]: txt }))}
                            onBlur={() => { if (asistenciaMarcada[item.id]) enviarAsistencia(item.id, asistenciaMarcada[item.id]); }}
                        />
                    </View>

                    <View style={styles.botones}>
                        <TouchableOpacity
                            onPress={() => enviarAsistencia(item.id, 'Asistido')}
                            style={[styles.btn, estado === 'Asistido' ? styles.bgP : styles.bgOff]}
                        >
                            <Text style={styles.btnTxt}>P</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => enviarAsistencia(item.id, 'Inasistente')}
                            style={[styles.btn, estado === 'Inasistente' ? styles.bgA : styles.bgOff]}
                        >
                            <Text style={styles.btnTxt}>A</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => enviarAsistencia(item.id, 'Retirado')}
                            style={[styles.btn, estado === 'Retirado' ? styles.bgR : styles.bgOff]}
                        >
                            <Text style={styles.btnTxt}>R</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    if (accesoBloqueado === 'verificando') {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 120 }} />
                <Text style={{ color: '#64748B', textAlign: 'center', marginTop: 16, fontSize: 14 }}>Verificando acceso...</Text>
            </View>
        );
    }

    if (accesoBloqueado === 'sin_registro' || accesoBloqueado === 'ausente') {
        const esAusente = accesoBloqueado === 'ausente';
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }]}>
                <View style={bloqueadoStyles.iconCircle}>
                    <Ionicons name={esAusente ? 'close-circle' : 'lock-closed'} size={52} color={esAusente ? '#EF4444' : '#F59E0B'} />
                </View>
                <Text style={bloqueadoStyles.titulo}>{esAusente ? 'Acceso Denegado' : 'Sin Autorización'}</Text>
                <Text style={bloqueadoStyles.mensaje}>
                    {esAusente
                        ? 'Fuiste registrado como AUSENTE hoy por el administrador.\nNo puedes pasar asistencia.'
                        : 'El administrador aún no ha registrado tu asistencia para el día de hoy.'}
                </Text>
                {!esAusente && (
                    <View style={bloqueadoStyles.infoBox}>
                        <Ionicons name="information-circle-outline" size={16} color="#38BDF8" />
                        <Text style={bloqueadoStyles.infoText}>
                            Comunícate con el administrador para que registre tu asistencia en el panel de{' '}
                            <Text style={{ fontWeight: '900', color: '#38BDF8' }}>Asistencia de Docentes</Text>.
                        </Text>
                    </View>
                )}
                <TouchableOpacity style={bloqueadoStyles.btnVolver} onPress={() => router.replace({
                    pathname: '/menu',
                    params: {
                        rol: String(rol ?? ''),
                        usuario: String(usuario ?? ''),
                        anoFiltro: String(anoFiltro ?? '1'),
                        menciones_permitidas: String(menciones_permitidas ?? ''),
                        materia: String(materiaParam ?? ''),
                    }
                })}>
                    <Ionicons name="arrow-back" size={18} color="#020617" />
                    <Text style={bloqueadoStyles.btnVolverTxt}>Volver al menú</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* ── STICKY MINI-HEADER (siempre visible) ── */}
            <View style={styles.stickyHeader}>
                <TouchableOpacity onPress={() => router.replace({
                    pathname: '/menu',
                    params: {
                        rol: String(rol ?? ''),
                        usuario: String(usuario ?? ''),
                        anoFiltro: String(anoFiltro ?? '1'),
                        menciones_permitidas: String(menciones_permitidas ?? ''),
                        materia: String(materiaParam ?? ''),
                    }
                })}>
                    <Text style={styles.backBtn}>← Volver</Text>
                </TouchableOpacity>

                <Text style={styles.titulo} numberOfLines={1}>
                    {seleccion}{anoFiltro ? ` · ${anoFiltro}°` : ''}
                </Text>

                <TouchableOpacity
                    onPress={() => setHeaderVisible(v => !v)}
                    style={styles.toggleBtn}
                >
                    <Ionicons name={headerVisible ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
                </TouchableOpacity>


            </View>

            {/* ── MATERIA ACTIVA BANNER (solo cuando hay >1 materia) ── */}
            {!esAdmin && materiasDisponibles.length > 1 && (
                <View style={styles.materiaActivaBanner}>
                    <Ionicons name="book" size={14} color="#009EF7" />
                    <Text style={styles.materiaActivaBannerText}>
                        Pasando lista en: <Text style={{ fontWeight: '900', color: '#009EF7' }}>{materiaActiva}</Text>
                    </Text>
                </View>
            )}

            {/* ── MATERIA + CLASE (se ocultan con el botón) ── */}
            {!esAdmin && (
                <View style={{ display: headerVisible ? 'flex' : 'none' }}>

                    {/* Selector de materia */}
                    {materiasDisponibles.length > 1 && (
                        <View style={styles.materiaSelectorContainer}>
                            <Text style={styles.materiaSelectorLabel}>MATERIA</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.materiaSelectorRow}>
                                    {materiasDisponibles.map((m) => {
                                        const activa = m === materiaActiva;
                                        const tieneRegistros = Object.keys(asistenciaPorMateria[m] ?? {}).length > 0;
                                        const completa = tieneRegistros && Object.keys(asistenciaPorMateria[m] ?? {}).length >= totalEstudiantes;
                                        return (
                                            <TouchableOpacity
                                                key={m}
                                                onPress={() => cambiarMateria(m)}
                                                style={[styles.materiaTab, activa && styles.materiaTabActiva, completa && !activa && styles.materiaTabCompleta]}
                                                activeOpacity={0.75}
                                            >
                                                {tieneRegistros && !activa && (
                                                    <View style={[styles.materiaTabDot, completa && { backgroundColor: '#10B981' }]} />
                                                )}
                                                <Text style={[styles.materiaTabText, activa && styles.materiaTabTextActiva, completa && !activa && { color: '#10B981' }]} numberOfLines={1}>
                                                    {m}
                                                </Text>
                                                {completa && !activa && (
                                                    <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                                                )}
                                                {activa && (
                                                    <Ionicons name="checkmark-circle" size={14} color="#020617" style={{ marginLeft: 4 }} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {materiasDisponibles.length === 1 && materiasDisponibles[0] !== 'General' && (
                        <View style={styles.materiaUnicaBadge}>
                            <Ionicons name="book-outline" size={14} color="#38BDF8" />
                            <Text style={styles.materiaUnicaText}>{materiasDisponibles[0]}</Text>
                        </View>
                    )}

                    {/* Clase del día */}
                    {claseInfo ? (
                        <View style={styles.claseGuardada}>
                            <View style={styles.claseGuardadaIcono}><Ionicons name="book" size={18} color="#38BDF8" /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.claseGuardadaLabel}>TEMA DE HOY</Text>
                                <Text style={styles.claseGuardadaTema} numberOfLines={1}>{claseInfo.tema}</Text>
                            </View>
                            <View style={styles.claseBadge}><Text style={styles.claseBadgeText}>{etiquetaClase}</Text></View>
                        </View>
                    ) : (
                        <View style={styles.claseForm}>
                            <TouchableOpacity onPress={() => setClaseExpandida(v => !v)} style={styles.claseFormHeader} activeOpacity={0.75}>
                                <Ionicons name="book-outline" size={16} color="#38BDF8" />
                                <Text style={[styles.claseFormTitulo, { flex: 1 }]}>REGISTRAR CLASE DE HOY</Text>
                                <Ionicons name={claseExpandida ? 'chevron-up' : 'chevron-down'} size={16} color="#38BDF8" />
                            </TouchableOpacity>
                            {claseExpandida && (
                                <>
                                    <TextInput style={styles.claseInput} placeholder="Ej: Ciberseguridad, Redes OSI..." placeholderTextColor="#334155" value={tema} onChangeText={setTema} />
                                    <View style={styles.horasRow}>
                                        {[1, 2].map(h => (
                                            <TouchableOpacity key={h} onPress={() => setHoras(h)} style={[styles.horaBtn, horas === h && styles.horaBtnActivo]}>
                                                <Ionicons name="time-outline" size={14} color={horas === h ? '#020617' : '#64748B'} />
                                                <Text style={[styles.horaBtnTxt, horas === h && styles.horaBtnTxtActivo]}>{h === 1 ? '1ª Hora' : '1ª y 2ª'}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <TouchableOpacity onPress={guardarClase} style={[styles.claseGuardarBtn, guardandoClase && { opacity: 0.6 }]} disabled={guardandoClase}>
                                        <Ionicons name="save-outline" size={16} color="#020617" />
                                        <Text style={styles.claseGuardarBtnTxt}>{guardandoClase ? 'GUARDANDO...' : 'GUARDAR CLASE'}</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}
                </View>
            )}

            {/* ── PROGRESO + RESUMEN + BUSCADOR (siempre visibles) ── */}
            {!esAdmin && (
                <View style={styles.resumenWrapper}>
                    {listaCompleta && (
                        <TouchableOpacity
                            style={styles.listaCompletaBanner}
                            onPress={() => setVistaFinal(true)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                            <Text style={styles.listaCompletaText}>¡Lista completa! Toca para ver el resumen final.</Text>
                            <View style={styles.verListaBtn}>
                                <Ionicons name="eye-outline" size={14} color="#10B981" />
                                <Text style={styles.verListaBtnText}>Ver</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <View style={styles.progresoContainer}>
                        <View style={styles.progresoHeader}>
                            <Text style={styles.progresoLabel}>Progreso del pase de lista</Text>
                            <Text style={styles.progresoContador}>
                                <Text style={{ color: '#38BDF8', fontWeight: '900' }}>{totalMarcados}</Text>
                                <Text style={{ color: '#475569' }}>/{totalEstudiantes}</Text>
                            </Text>
                        </View>
                        <View style={styles.progresoBg}>
                            <View style={[
                                styles.progresoFill,
                                { width: `${porcentajeMarcado}%` },
                                listaCompleta && { backgroundColor: '#10B981' }
                            ]} />
                        </View>
                    </View>

                    <View style={styles.resumenContainer}>
                        <View style={styles.resumenItem}>
                            <Text style={[styles.resumenLabel, { color: '#10B981' }]}>P</Text>
                            <Text style={styles.resumenNum}>{totalPresentes}</Text>
                        </View>
                        <View style={styles.resumenDivider} />
                        <View style={styles.resumenItem}>
                            <Text style={[styles.resumenLabel, { color: '#EF4444' }]}>A</Text>
                            <Text style={styles.resumenNum}>{totalAusentes}</Text>
                        </View>
                        <View style={styles.resumenDivider} />
                        <View style={styles.resumenItem}>
                            <Text style={[styles.resumenLabel, { color: '#F59E0B' }]}>R</Text>
                            <Text style={styles.resumenNum}>{totalRetirados}</Text>
                        </View>
                        <View style={styles.resumenDivider} />
                        <View style={styles.resumenItem}>
                            <Text style={[styles.resumenLabel, { color: '#475569' }]}>—</Text>
                            <Text style={styles.resumenNum}>{totalEstudiantes - totalMarcados}</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Buscador */}
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#64748B" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por Nro. de lista o nombre..."
                    placeholderTextColor="#64748B"
                    value={busqueda}
                    onChangeText={setBusqueda}
                />
            </View>

            {/* ── LISTA DE ESTUDIANTES ── */}
            {cargando ? (
                <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={estudiantesFiltrados}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 + insets.bottom }}
                />
            )}

            {/* ── VISTA FINAL (solo lectura) ── */}
            <Modal
                visible={vistaFinal}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setVistaFinal(false)}
            >
                <View style={vistaFinalStyles.container}>
                    <View style={vistaFinalStyles.header}>
                        <TouchableOpacity onPress={() => setVistaFinal(false)} style={vistaFinalStyles.backBtn}>
                            <Ionicons name="chevron-back" size={22} color="#38BDF8" />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={vistaFinalStyles.titulo}>Lista Final</Text>
                            <Text style={vistaFinalStyles.subtitulo}>
                                {seleccion}{anoFiltro ? ` · ${anoFiltro}°` : ''} — {materiaActiva}
                            </Text>
                        </View>
                        <View style={vistaFinalStyles.completadoBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                            <Text style={vistaFinalStyles.completadoText}>Completa</Text>
                        </View>
                    </View>

                    <View style={vistaFinalStyles.resumen}>
                        <View style={vistaFinalStyles.resumenItem}>
                            <Text style={[vistaFinalStyles.resumenNum, { color: '#10B981' }]}>{totalPresentes}</Text>
                            <Text style={vistaFinalStyles.resumenLabel}>Presentes</Text>
                        </View>
                        <View style={vistaFinalStyles.resumenDivider} />
                        <View style={vistaFinalStyles.resumenItem}>
                            <Text style={[vistaFinalStyles.resumenNum, { color: '#EF4444' }]}>{totalAusentes}</Text>
                            <Text style={vistaFinalStyles.resumenLabel}>Inasistentes</Text>
                        </View>
                        <View style={vistaFinalStyles.resumenDivider} />
                        <View style={vistaFinalStyles.resumenItem}>
                            <Text style={[vistaFinalStyles.resumenNum, { color: '#F59E0B' }]}>{totalRetirados}</Text>
                            <Text style={vistaFinalStyles.resumenLabel}>Retirados</Text>
                        </View>
                    </View>

                    <FlatList
                        data={[...estudiantes].sort((a, b) => (a.nro_lista ?? 0) - (b.nro_lista ?? 0))}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 130 + insets.bottom }}
                        renderItem={({ item }) => {
                            const estado = asistenciaMarcada[item.id];
                            const obs = (comentariosPorMateria[materiaActiva] ?? {})[item.id];
                            const colorEstado =
                                estado === 'Asistido' ? '#10B981' :
                                    estado === 'Inasistente' ? '#EF4444' : '#F59E0B';
                            const icono =
                                estado === 'Asistido' ? 'checkmark-circle' :
                                    estado === 'Inasistente' ? 'close-circle' : 'arrow-undo-circle';
                            const etiqueta =
                                estado === 'Asistido' ? 'Presente' :
                                    estado === 'Inasistente' ? 'Inasistente' : 'Retirado';

                            return (
                                <View style={[vistaFinalStyles.card, { borderLeftColor: colorEstado }]}>
                                    <View style={vistaFinalStyles.cardLeft}>
                                        <View style={vistaFinalStyles.nroBadge}>
                                            <Text style={vistaFinalStyles.nroText}>{item.nro_lista}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={vistaFinalStyles.nombre}>{item.nombre} {item.apellido}</Text>
                                            {obs ? <Text style={vistaFinalStyles.obs}>📝 {obs}</Text> : null}
                                        </View>
                                    </View>
                                    <View style={[vistaFinalStyles.estadoBadge, { backgroundColor: colorEstado + '20', borderColor: colorEstado + '60' }]}>
                                        <Ionicons name={icono as any} size={14} color={colorEstado} />
                                        <Text style={[vistaFinalStyles.estadoText, { color: colorEstado }]}>{etiqueta}</Text>
                                    </View>
                                </View>
                            );
                        }}
                    />

                    <View style={[vistaFinalStyles.footer, { paddingBottom: 20 + insets.bottom }]}>
                        <TouchableOpacity
                            style={vistaFinalStyles.editarBtn}
                            onPress={() => setVistaFinal(false)}
                        >
                            <Ionicons name="create-outline" size={20} color="#020617" />
                            <Text style={vistaFinalStyles.editarBtnText}>EDITAR ASISTENCIA</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ── MODAL DE PERFIL ── */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => { setModalVisible(false); setModoEdicion(false); }}
            >
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <View style={styles.modalTopBar}>
                                {esAdmin ? (
                                    modoEdicion ? (
                                        <TouchableOpacity style={styles.modalEditToggle} onPress={() => setModoEdicion(false)}>
                                            <Ionicons name="close-outline" size={16} color="#EF4444" />
                                            <Text style={[styles.modalEditToggleTxt, { color: '#EF4444' }]}>Cancelar</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.modalEditToggle} onPress={() => setModoEdicion(true)}>
                                            <Ionicons name="pencil-outline" size={16} color="#38BDF8" />
                                            <Text style={styles.modalEditToggleTxt}>Editar</Text>
                                        </TouchableOpacity>
                                    )
                                ) : <View style={{ width: 70 }} />}
                                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => { setModalVisible(false); setModoEdicion(false); }}>
                                    <Ionicons name="close" size={22} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                    <Image source={{ uri: `https://ui-avatars.com/api/?name=${estudianteSeleccionado?.nombre}+${estudianteSeleccionado?.apellido}&background=1e293b&color=38bdf8&bold=true&size=200` }} style={styles.modalAvatar} />
                                    <Text style={styles.modalNombre}>{estudianteSeleccionado?.nombre} {estudianteSeleccionado?.apellido}</Text>
                                    <View style={styles.modalMencionPill}>
                                        <Text style={styles.modalMencionText}>{estudianteSeleccionado?.mencion}</Text>
                                    </View>
                                </View>

                                <Text style={styles.seccionTitulo}>DATOS DEL ESTUDIANTE</Text>
                                <View style={styles.modalInfoBox}>
                                    <View style={styles.modalRow}>
                                        <View style={styles.modalIconBox}><Ionicons name="list-outline" size={16} color="#38BDF8" /></View>
                                        <View>
                                            <Text style={styles.modalLabel}>Nro. de Lista</Text>
                                            <Text style={styles.modalValue}>#{estudianteSeleccionado?.nro_lista ?? '—'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.modalSep} />
                                    <CampoModal icono="person-outline" label="Nombre" campo="nombre" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.nombre} formRef={formEdicion} maxLength={100} />
                                    <CampoModal icono="person-outline" label="Apellido" campo="apellido" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.apellido} formRef={formEdicion} maxLength={100} />
                                    <CampoModal icono="card-outline" label="Cédula" campo="cedula" keyboardType="numeric" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.cedula} formRef={formEdicion} maxLength={20} />
                                    <CampoModal icono="school-outline" label="Año de Estudio" campo="ano" keyboardType="numeric" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.ano} formRef={formEdicion} maxLength={1} />
                                    {(estudianteSeleccionado?.seccion || modoEdicion) ? (
                                        <CampoModal icono="git-branch-outline" label="Sección" campo="seccion" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.seccion} formRef={formEdicion} maxLength={5} />
                                    ) : null}
                                </View>

                                <Text style={[styles.seccionTitulo, { marginTop: 16 }]}>DATOS DEL REPRESENTANTE</Text>
                                <View style={styles.modalInfoBox}>
                                    <CampoModal icono="person-outline" label="Nombre del Representante" campo="rep_nombre" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.rep_nombre} formRef={formEdicion} maxLength={100} />
                                    <CampoModal icono="person-outline" label="Apellido del Representante" campo="rep_apellido" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.rep_apellido} formRef={formEdicion} maxLength={100} />
                                    <CampoModal icono="card-outline" label="Cédula del Representante" campo="rep_cedula" keyboardType="numeric" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.rep_cedula} formRef={formEdicion} maxLength={20} />
                                    <CampoModal icono="call-outline" label="Teléfono" campo="rep_telefono" keyboardType="phone-pad" modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.rep_telefono} formRef={formEdicion} maxLength={20} />
                                    <CampoModal icono="location-outline" label="Dirección de Vivienda" campo="direccion" multiline={true} modoEdicion={modoEdicion} valorVista={estudianteSeleccionado?.direccion} formRef={formEdicion} maxLength={200} />
                                </View>

                                {asistenciaMarcada[estudianteSeleccionado?.id] ? (
                                    <View style={[
                                        styles.modalEstadoBadge,
                                        asistenciaMarcada[estudianteSeleccionado?.id] === 'Asistido' && { backgroundColor: '#10B98120', borderColor: '#10B981' },
                                        asistenciaMarcada[estudianteSeleccionado?.id] === 'Inasistente' && { backgroundColor: '#EF444420', borderColor: '#EF4444' },
                                        asistenciaMarcada[estudianteSeleccionado?.id] === 'Retirado' && { backgroundColor: '#F59E0B20', borderColor: '#F59E0B' },
                                    ]}>
                                        <Text style={[
                                            styles.modalEstadoText,
                                            asistenciaMarcada[estudianteSeleccionado?.id] === 'Asistido' && { color: '#10B981' },
                                            asistenciaMarcada[estudianteSeleccionado?.id] === 'Inasistente' && { color: '#EF4444' },
                                            asistenciaMarcada[estudianteSeleccionado?.id] === 'Retirado' && { color: '#F59E0B' },
                                        ]}>
                                            {materiaActiva} · Hoy: {asistenciaMarcada[estudianteSeleccionado?.id]}
                                        </Text>
                                    </View>
                                ) : null}

                                {modoEdicion && (
                                    <TouchableOpacity style={[styles.guardarBtn, guardandoEdicion && { opacity: 0.6 }]} onPress={guardarEdicion} disabled={guardandoEdicion}>
                                        <Ionicons name="save-outline" size={20} color="#020617" />
                                        <Text style={styles.guardarBtnTxt}>{guardandoEdicion ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}</Text>
                                    </TouchableOpacity>
                                )}
                                <View style={{ height: 20 }} />
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

// ── CampoModal ────────────────────────────────────────────────────────────────
interface CampoModalProps {
    icono: string; label: string; campo: string; keyboardType?: any;
    multiline?: boolean; modoEdicion: boolean; valorVista: any;
    formRef: React.MutableRefObject<any>; maxLength?: number;
}
const CampoModal = React.memo(({ icono, label, campo, keyboardType = 'default', multiline = false, modoEdicion, valorVista, formRef, maxLength }: CampoModalProps) => (
    <View>
        <View style={campoStyles.row}>
            {/* Ícono actualizado al azul activo de la marca */}
            <View style={campoStyles.iconBox}><Ionicons name={icono as any} size={16} color="#009EF7" /></View>
            <View style={{ flex: 1 }}>
                <Text style={campoStyles.label}>{label}</Text>
                {modoEdicion ? (
                    <TextInput style={[campoStyles.input, multiline && { minHeight: 60 }]} defaultValue={formRef.current[campo] ?? ''} onChangeText={(t) => { formRef.current[campo] = t; }} placeholderTextColor="#8A9BB0" placeholder="—" keyboardType={keyboardType} multiline={multiline} maxLength={maxLength} autoCorrect={false} autoCapitalize="words" />
                ) : (
                    <Text style={campoStyles.value}>{valorVista || '—'}</Text>
                )}
            </View>
        </View>
        <View style={campoStyles.sep} />
    </View>
));

const campoStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 },
    // Ícono izquierdo de cada campo del modal (diseño claro Movistar)
    iconBox: { width: 34, height: 34, backgroundColor: '#EAF6FF' /* Azul suave de marca — fondo del cuadrito del ícono */, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
    // Etiqueta/label gris sobre el valor
    label: { color: '#8A9BB0' /* Gris azulado secundario — texto "Nombre", "Cédula", etc. */, fontSize: 11, fontWeight: '600', marginBottom: 2 },
    // Valor del campo en modo solo lectura
    value: { color: '#1A1A2E' /* Azul oscuro premium — texto del valor del estudiante en modo vista */, fontSize: 15, fontWeight: '700' },
    // Input de edición dentro del modal
    input: { color: '#1A1A2E' /* Azul oscuro premium — texto escrito */, fontSize: 15, fontWeight: '700', backgroundColor: '#F2F4F7' /* Gris claro suave — fondo del input editable */, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, flex: 1 },
    // Separador horizontal entre filas de datos
    sep: { height: 1, backgroundColor: '#E8EDF2' /* Gris sutil — línea divisoria limpia entre campos */, marginVertical: 10 },
});

const styles = StyleSheet.create({
    // Fondo principal de toda la pantalla de asistencia
    container: { flex: 1, backgroundColor: '#F7F9FC' /* Gris/azul muy claro — nuevo fondo base de toda la app */, paddingHorizontal: 20 },

    // ── Sticky mini-header ──────────────────────────────────────────────────
    stickyHeader: {
        marginTop: 55,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E6ED' /* Gris sutil — línea divisoria debajo del mini-header */,
    },
    // Botón "← Volver" del mini-header
    backBtn: { color: '#009EF7' /* Azul Movistar — link de navegación activo */, fontSize: 15, fontWeight: '700' },
    // Título central del mini-header (nombre de mención y año)
    titulo: { fontSize: 18, fontWeight: '900', color: '#1A1A2E' /* Azul oscuro premium — título principal "Mención · Año" */, flex: 1, textAlign: 'center', marginHorizontal: 8 },
    exportBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#FFFFFF' /* Blanco puro — fondo limpio */, paddingHorizontal: 10, paddingVertical: 7,
        borderRadius: 10, borderWidth: 1,
        borderColor: '#00C853' /* Verde brillante — marca oficial para acciones de éxito o archivos Excel */,
    },
    // Texto "Excel" del botón de exportar
    exportBtnText: { color: '#00C853' /* Verde brillante — texto e ícono del botón Excel */, fontSize: 12, fontWeight: '700' },
    toggleBtn: {
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: '#FFFFFF' /* Blanco puro */, borderWidth: 1,
        borderColor: '#E0E6ED' /* Gris sutil — borde del botón de chevron toggle */,
        justifyContent: 'center', alignItems: 'center',
        marginLeft: 6,
    },

    // ── Colapsable ──────────────────────────────────────────────────────────
    colapsable: {},

    // Tarjeta de estudiante ya registrado (mismo fondo que la tarjeta base)
    cardRegistrado: { backgroundColor: '#FFFFFF' /* Blanco puro — consistente con el diseño general claro */ },
    checkOverlay: {
        position: 'absolute', bottom: -4, right: -4,
        width: 20, height: 20, borderRadius: 10,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF' /* Blanco puro — aísla el check sobre el avatar del alumno */,
    },
    estadoChip: {
        alignSelf: 'flex-start', borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 3,
        borderWidth: 1, marginTop: 4, marginBottom: 4,
        // NOTA: los fondos y bordes se aplican dinámicamente según la guía de estados:
        // Asistido → backgroundColor: '#00C85315' (Verde suave), borderColor: '#00C85340'
        // Inasistente → backgroundColor: '#FF3B3015' (Rojo suave), borderColor: '#FF3B3040'
        // Retirado → backgroundColor: '#FF950015' (Naranja suave), borderColor: '#FF950040'
    },
    estadoChipText: { fontSize: 11, fontWeight: '800' },
    // NOTA: El color del texto del chip también es dinámico y actualizado:
    // Asistido → '#00C853' (Verde), Inasistente → '#FF3B30' (Rojo), Retirado → '#FF9500' (Naranja)

    // Progreso y resumen
    resumenWrapper: { marginTop: 10 },
    listaCompletaBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#00C85315' /* Verde brillante al 8% de opacidad — fondo del banner de lista completa */, borderRadius: 12, padding: 12,
        borderWidth: 1,
        borderColor: '#00C85340' /* Verde brillante al 25% de opacidad — borde del banner */, marginBottom: 10,
    },
    // Texto del banner de lista completa
    listaCompletaText: { color: '#00C853' /* Verde brillante — mensaje de éxito de lista completa */, fontSize: 13, fontWeight: '700', flex: 1 },
    verListaBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#00C85325' /* Verde brillante al 14% opacidad — fondo del botón "Ver" */, paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 8, borderWidth: 1,
        borderColor: '#00C85350' /* Verde brillante al 31% opacidad — borde del mini-botón "Ver" */,
    },
    // Texto del mini-botón "Ver" del banner de lista completa
    verListaBtnText: { color: '#00C853' /* Verde brillante — texto del mini-botón */, fontSize: 12, fontWeight: '800' },

    progresoContainer: { marginBottom: 8 },
    progresoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    // Etiqueta "Progreso del pase de lista"
    progresoLabel: { color: '#8A9BB0' /* Gris azulado secundario — texto informativo sobre la barra */, fontSize: 11, fontWeight: '600' },
    progresoContador: { fontSize: 13 },
    // NOTA: El contador usa colores inline: '#009EF7' (Azul activo) para el marcado, '#8A9BB0' para el total
    progresoBg: { height: 6, backgroundColor: '#E8EDF2' /* Gris claro sutil — pista vacía de la barra de progreso */, borderRadius: 3, overflow: 'hidden' },
    progresoFill: { height: '100%', backgroundColor: '#009EF7' /* Azul Movistar — cambia a '#00C853' (Verde) al completarse */, borderRadius: 3 },

    resumenContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF' /* Blanco puro — fondo de la caja de resumen */, padding: 10,
        borderRadius: 14, borderWidth: 1,
        borderColor: '#E0E6ED' /* Gris sutil — borde de la caja de resumen */,
        justifyContent: 'space-around', alignItems: 'center',
    },
    resumenItem: { alignItems: 'center', flex: 1 },
    // NOTA: resumenLabel recibe colores inline actualizados por item: P → '#00C853', A → '#FF3B30', R → '#FF9500', Sin marcar → '#8A9BB0'
    resumenLabel: { fontSize: 15, fontWeight: '900' },
    // Número grande de conteo en el resumen
    resumenNum: { color: '#1A1A2E' /* Azul oscuro premium — número de conteo con alto contraste */, fontSize: 18, fontWeight: '900', marginTop: 1 },
    // Divisor vertical entre items del resumen
    resumenDivider: { width: 1, height: 28, backgroundColor: '#E8EDF2' /* Gris claro — línea vertical separadora limpia */ },

    materiaActivaBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#EAF6FF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#009EF740',
    },
    materiaActivaBannerText: {
        color: '#1A1A2E',
        fontSize: 12,
        fontWeight: '600',
    },
    // Selector de materia
    materiaSelectorContainer: { marginTop: 10, marginBottom: 2 },
    // Etiqueta "MATERIA" encima del selector de tabs
    materiaSelectorLabel: { color: '#8A9BB0' /* Gris azulado secundario — etiqueta en mayúsculas */, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 7 },
    materiaSelectorRow: { flexDirection: 'row', gap: 8 },
    // Tab de materia inactivo
    materiaTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, backgroundColor: '#FFFFFF' /* Blanco puro */, borderWidth: 1, borderColor: '#E0E6ED' /* Gris sutil — borde inactivo */, position: 'relative' },
    // Tab de materia activo (seleccionado)
    materiaTabActiva: { backgroundColor: '#009EF7' /* Azul Movistar — resalta la pestaña seleccionada */, borderColor: '#009EF7' },
    // Tab de materia con todos los registros completos (pero no activa)
    materiaTabCompleta: { borderColor: '#00C85350' /* Verde brillante al 31% opacidad — indica completado de forma sutil */ },
    // Texto de tab de materia inactivo
    materiaTabText: { color: '#8A9BB0' /* Gris azulado — texto de materia inactiva */, fontSize: 13, fontWeight: '700' },
    // Texto de tab de materia activo
    materiaTabTextActiva: { color: '#FFFFFF' /* Blanco puro — contraste perfecto sobre el azul principal */, fontSize: 13, fontWeight: '700' },
    // Punto indicador de registros en tab de materia
    materiaTabDot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: '#00C853' /* Verde brillante — registros incompletos */ },

    // Badge de materia única (cuando solo hay una materia disponible)
    materiaUnicaBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 2, alignSelf: 'flex-start', backgroundColor: '#FFFFFF' /* Blanco puro */, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#E0E6ED' },
    // Nombre de la materia en el badge único
    materiaUnicaText: { color: '#009EF7' /* Azul Movistar — texto resaltado de la materia */, fontSize: 13, fontWeight: '700' },

    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF' /* Blanco puro — fondo de barra de búsqueda */, borderRadius: 12, paddingHorizontal: 15, marginTop: 10, marginBottom: 4, height: 48, borderWidth: 1, borderColor: '#009EF7' /* Azul Movistar — siempre resaltado en la marca */ },
    // Texto que escribe el usuario en la barra de búsqueda
    searchInput: { flex: 1, color: '#1A1A2E' /* Azul oscuro premium — legibilidad al escribir */, marginLeft: 10, fontSize: 15 },

    // Tarjeta de cada estudiante en la lista
    card: { backgroundColor: '#FFFFFF' /* Blanco puro — tarjetas limpias estilo iOS/Android moderno */, borderRadius: 20, padding: 15, marginBottom: 12, borderLeftWidth: 6, borderLeftColor: '#E0E6ED' /* Gris sutil por defecto (sin estado marcado) */ },
    // Bordes izquierdos actualizados según estados oficiales
    borderP: { borderLeftColor: '#00C853' /* Verde brillante — Presente */ },
    borderA: { borderLeftColor: '#FF3B30' /* Rojo vivo — Inasistente */ },
    borderR: { borderLeftColor: '#FF9500' /* Naranja — Retirado */ },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    fotoCont: { marginRight: 15, position: 'relative' },
    foto: { width: 60, height: 60, borderRadius: 15 },
    // Badge con el número de lista sobre la foto del estudiante
    badge: { position: 'absolute', top: -8, left: -8, backgroundColor: '#009EF7' /* Azul Movistar — fondo del badge circular del número de lista */, width: 25, height: 25, borderRadius: 12.5, zIndex: 1, justifyContent: 'center', alignItems: 'center' },
    // Número de lista dentro del badge circular
    badgeText: { color: '#FFFFFF' /* Blanco puro — legibilidad óptima */, fontSize: 12, fontWeight: 'bold' },
    // Nombre completo del estudiante en la tarjeta
    nombre: { color: '#1A1A2E' /* Azul oscuro premium — nombre completo del alumno */, fontSize: 20, fontWeight: 'bold' },
    // Cédula del estudiante (solo visible en modo admin)
    cedulaAdmin: { color: '#8A9BB0' /* Gris azulado secundario — texto de la cédula para el administrador */, fontSize: 13, fontWeight: '600', marginTop: 3 },
    // Campo de observaciones/notas en la tarjeta del estudiante
    inputObs: { backgroundColor: '#F2F4F7' /* Gris claro suave — fondo del input de notas */, borderRadius: 8, padding: 8, color: '#1A1A2E' /* Azul oscuro premium — texto escrito */, fontSize: 13, marginTop: 4 },
    botones: { flexDirection: 'column', gap: 6, marginLeft: 15 },
    btn: { width: 45, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    // Texto de los botones P / A / R
    btnTxt: { color: '#FFFFFF' /* Blanco puro para estados activos */, fontWeight: '900', fontSize: 16 },
    // Botón de asistencia sin marcar (estado off)
    bgOff: { backgroundColor: '#F2F4F7' /* Gris claro suave — estado inactivo neutro */ },
    // Botones activos usando los códigos de color correctos
    bgP: { backgroundColor: '#00C853' /* Verde brillante — botón P activo */ },
    bgA: { backgroundColor: '#FF3B30' /* Rojo vivo — botón A activo */ },
    bgR: { backgroundColor: '#FF9500' /* Naranja — botón R activo */ },

    // Caja que muestra la clase ya guardada del día
    claseGuardada: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF' /* Blanco puro */, borderRadius: 14, padding: 12, marginTop: 10, borderWidth: 1, borderColor: '#E0E6ED' /* Gris sutil */, gap: 12 },
    // Ícono de libro en la caja de clase guardada
    claseGuardadaIcono: { width: 36, height: 36, backgroundColor: '#EAF6FF' /* Azul suave de marca */, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    // Etiqueta "TEMA DE HOY" en la caja de clase guardada
    claseGuardadaLabel: { color: '#009EF7' /* Azul Movistar — resalta la etiqueta de información */, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
    // Texto del tema guardado en la caja de clase
    claseGuardadaTema: { color: '#1A1A2E' /* Azul oscuro premium — texto del tema */, fontSize: 13, fontWeight: '700' },
    // Badge con el número de clase en la caja de clase guardada
    claseBadge: { backgroundColor: '#F2F4F7' /* Gris claro suave */, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#009EF7' /* Azul Movistar para el borde */ },
    // Texto del número de clase en el badge
    claseBadgeText: { color: '#009EF7' /* Azul Movistar — texto del número de clase */, fontSize: 11, fontWeight: '900' },
    
    // Formulario de registro de clase del día (cuando no hay clase guardada)
    claseForm: { backgroundColor: '#FFFFFF' /* Blanco puro — contenedor del formulario de clase */, borderRadius: 14, padding: 12, marginTop: 10, borderWidth: 1, borderColor: '#E0E6ED', gap: 10 },
    claseFormHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'space-between' },
    // Título "REGISTRAR CLASE DE HOY" del formulario
    claseFormTitulo: { color: '#009EF7' /* Azul Movistar — encabezado del formulario */, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    // Input de texto para escribir el tema de la clase
    claseInput: { backgroundColor: '#F2F4F7' /* Gris claro suave — fondo del input de clase */, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, color: '#1A1A2E' /* Azul oscuro premium — texto escrito */, fontSize: 14, borderWidth: 1, borderColor: '#E0E6ED' },
    horasRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    // Botón de selección de hora (inactivo)
    horaBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: '#F2F4F7' /* Gris claro suave */, borderWidth: 1, borderColor: '#E0E6ED' },
    // Botón de selección de hora (activo/seleccionado)
    horaBtnActivo: { backgroundColor: '#009EF7' /* Azul Movistar — resalta la hora seleccionada */, borderColor: '#009EF7' },
    // Texto del botón de hora inactivo
    horaBtnTxt: { color: '#8A9BB0' /* Gris azulado — texto de horas inactivas */, fontSize: 13, fontWeight: '700' },
    // Texto del botón de hora activo
    horaBtnTxtActivo: { color: '#FFFFFF' /* Blanco puro — excelente contraste sobre el azul principal */, fontSize: 13, fontWeight: '700' },
    // Botón principal "GUARDAR CLASE"
    claseGuardarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#009EF7' /* Azul Movistar — botón principal de acción */, paddingVertical: 11, borderRadius: 12 },
    // Texto "GUARDAR CLASE" del botón principal
    claseGuardarBtnTxt: { color: '#FFFFFF' /* Blanco puro — contraste perfecto */, fontWeight: '900', fontSize: 13 },

    // Overlay oscuro semitransparente del modal de perfil (ajustado a la nueva armonía)
    modalOverlay: { flex: 1, backgroundColor: 'rgba(26, 26, 46, 0.4)' /* Capa oscura translúcida basada en el azul oscuro premium */, justifyContent: 'flex-end' },
    // Card principal del modal de perfil del estudiante que sube desde abajo
    modalCard: { backgroundColor: '#FFFFFF' /* Blanco puro — fondo impecable para la ficha del alumno */, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 28, paddingBottom: 45, maxHeight: '90%', borderTopWidth: 1, borderColor: '#E0E6ED' },
    modalTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    // Botón de cierre (X) del modal de perfil
    modalCloseBtn: { backgroundColor: '#F2F4F7' /* Gris claro suave — botón neutro de cierre */, borderRadius: 20, padding: 6 },
    // Botón "Editar" / "Cancelar" del modal de perfil
    modalEditToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F2F4F7' /* Gris claro suave */, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    // Texto del botón "Editar" del modal (color por defecto)
    modalEditToggleTxt: { color: '#009EF7' /* Azul Movistar — cambia a '#FF3B30' (Rojo) dinámicamente en modo cancelar */, fontSize: 13, fontWeight: '700' },
    // Avatar/foto del estudiante en el modal de perfil
    modalAvatar: { width: 90, height: 90, borderRadius: 25, borderWidth: 3, borderColor: '#009EF7' /* Azul Movistar — borde de la foto de perfil */, marginBottom: 14 },
    // Nombre del estudiante en el modal de perfil
    modalNombre: { fontSize: 22, fontWeight: '900', color: '#1A1A2E' /* Azul oscuro premium — nombre del estudiante en grande */, textAlign: 'center', marginBottom: 8 },
    // Pill/badge de mención del estudiante en el modal
    modalMencionPill: { backgroundColor: '#EAF6FF' /* Azul suave de marca */, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#009EF7' /* Azul Movistar para el borde */, marginBottom: 18 },
    // Texto de la mención dentro del pill
    modalMencionText: { color: '#009EF7' /* Azul Movistar — texto de la mención */, fontSize: 12, fontWeight: '700' },
    // Títulos de sección en el modal
    seccionTitulo: { color: '#8A9BB0' /* Gris azulado secundario — títulos de sección limpios en mayúsculas */, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
    // Caja de información del estudiante/representante en el modal
    modalInfoBox: { width: '100%', backgroundColor: '#F7F9FC' /* Gris/azul muy claro — fondo del bloque interno de datos */, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E0E6ED', marginBottom: 8 },
    modalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 },
    // Cuadro del ícono en cada fila de datos del modal
    modalIconBox: { width: 34, height: 34, backgroundColor: '#EAF6FF' /* Azul suave de marca */, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
    // Etiqueta del campo en el modal (ej: "Nombre", "Cédula")
    modalLabel: { color: '#8A9BB0' /* Gris azulado secundario */, fontSize: 11, fontWeight: '600', marginBottom: 2 },
    // Valor del campo en el modal (modo vista)
    modalValue: { color: '#1A1A2E' /* Azul oscuro premium — datos de lectura del alumno */, fontSize: 15, fontWeight: '700' },
    // Input de edición en el modal
    modalEditInput: { color: '#1A1A2E' /* Azul oscuro premium */, fontSize: 15, fontWeight: '700', backgroundColor: '#FFFFFF' /* Blanco puro para diferenciar la edición */, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, flex: 1, borderWidth: 1, borderColor: '#E0E6ED' },
    // Separador horizontal entre campos del modal
    modalSep: { height: 1, backgroundColor: '#E8EDF2', marginVertical: 10 },
    modalEstadoBadge: { alignSelf: 'center', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginTop: 12, marginBottom: 8 },
    // NOTA: modalEstadoBadge recibe fondos y bordes de alerta suave dinámicamente inline:
    // Asistido → backgroundColor: '#00C85315', borderColor: '#00C853'
    // Inasistente → backgroundColor: '#FF3B3015', borderColor: '#FF3B30'
    // Retirado → backgroundColor: '#FF950015', borderColor: '#FF9500'
    modalEstadoText: { fontSize: 13, fontWeight: '800' },
    // NOTA: modalEstadoText recibe el color del texto dinámico oficial (Verde/Rojo/Naranja)
    // Botón "GUARDAR CAMBIOS" del modal de edición
    guardarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#009EF7' /* Azul Movistar — botón principal de guardado */, padding: 18, borderRadius: 16, marginTop: 20 },
    // Texto "GUARDAR CAMBIOS" del botón del modal
    guardarBtnTxt: { color: '#FFFFFF' /* Blanco puro — contraste impecable */, fontWeight: '900', fontSize: 15 },
});

const bloqueadoStyles = StyleSheet.create({
    // Círculo del ícono en la pantalla de acceso bloqueado
    iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFFFFF' /* Blanco puro */, borderWidth: 1, borderColor: '#FFE2E2' /* Borde rosa sutil de alerta */, justifyContent: 'center', alignItems: 'center', marginBottom: 28 },
    // Título principal en pantalla de acceso bloqueado
    titulo: { color: '#1A1A2E' /* Azul oscuro premium — título de alerta claro */, fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 14 },
    // Mensaje descriptivo en pantalla de acceso bloqueado
    mensaje: { color: '#8A9BB0' /* Gris azulado secundario — descripción legible */, fontSize: 15, textAlign: 'center', lineHeight: 23, marginBottom: 20 },
    // Caja informativa con instrucciones en pantalla de bloqueo
    infoBox: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#FFF5F5' /* Rosa muy claro de alerta — fondo de advertencia */, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#FFE2E2', marginBottom: 32 },
    // Texto de instrucciones dentro de la caja informativa de bloqueo
    infoText: { color: '#FF3B30' /* Rojo vivo Movistar — las instrucciones ahora se destacan en el color de alerta correcto */, fontSize: 13, flex: 1, lineHeight: 19, fontWeight: '600' },
    // Botón "Volver al menú" en pantalla de acceso bloqueado
    btnVolver: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#009EF7' /* Azul Movistar — acción de retorno principal */, paddingHorizontal: 28, paddingVertical: 15, borderRadius: 16 },
    // Texto "Volver al menú" del botón en pantalla de bloqueo
    btnVolverTxt: { color: '#FFFFFF' /* Blanco puro — legibilidad total */, fontWeight: '900', fontSize: 15 },
});

const vistaFinalStyles = StyleSheet.create({
   // Fondo de toda la pantalla de vista final (modal de lista completa)
    container: { 
        flex: 1, 
        backgroundColor: '#F7F9FC' /* Gris/azul muy claro — entorno de lectura limpio */ 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        paddingHorizontal: 20, 
        paddingTop: 60, 
        paddingBottom: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#E0E6ED' /* Gris sutil — línea inferior del encabezado */ 
    },
    // Botón de retroceso en el header de Vista Final
    backBtn: { 
        width: 38, 
        height: 38, 
        backgroundColor: '#FFFFFF' /* Blanco puro */, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#E0E6ED' 
    },
    // Título "Lista Final" en el header de Vista Final
    titulo: { 
        fontSize: 20, 
        fontWeight: '900', 
        color: '#1A1A2E' /* Azul muy oscuro — Actualizado según especificación */ 
    },
    // Subtítulo (mención · año — materia) en el header de Vista Final
    subtitulo: { 
        fontSize: 12, 
        color: '#8A9BB0' /* Gris azulado Movistar — Actualizado */, 
        marginTop: 1 
    },
    // Badge "Completa" en el header de Vista Final
    completadoBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4, 
        backgroundColor: '#00C85315' /* Nuevo verde al 8% opacidad */, 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#00C85340' /* Nuevo verde al 25% opacidad */ 
    },
    // Texto "Completa" del badge en Vista Final
    completadoText: { 
        color: '#00C853' /* Verde estado Movistar — Actualizado */, 
        fontSize: 11, 
        fontWeight: '800' 
    },
    // Bloque de resumen numérico (Presentes / Inasistentes / Retirados)
    resumen: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        marginHorizontal: 16, 
        marginVertical: 14, 
        backgroundColor: '#FFFFFF' /* Blanco puro — Fondo actualizado */, 
        borderRadius: 18, 
        padding: 16, 
        borderWidth: 1, 
        borderColor: '#E0E6ED' /* Borde sutil para acoplar al diseño claro */ 
    },
    resumenItem: { alignItems: 'center', flex: 1 },
    resumenNum: { fontSize: 28, fontWeight: '900' },
    // NOTA: Si usas colores inline dinámicos para los números del resumen, recuerda actualizarlos en el JSX:
    // Presentes: '#00C853', Inasistentes: '#FF3B30', Retirados: '#FF9500'
    
    // Etiqueta debajo del número en el resumen de Vista Final
    resumenLabel: { 
        color: '#8A9BB0' /* Gris azulado de la paleta nueva — Actualizado */, 
        fontSize: 11, 
        fontWeight: '600', 
        marginTop: 2 
    },
    // Divisor vertical entre items del resumen de Vista Final
    resumenDivider: { 
        width: 1, 
        height: 32, 
        backgroundColor: '#E8EDF2' /* Gris claro para el divisor en entornos claros */ 
    },
    // Tarjeta de cada estudiante en Vista Final
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: '#FFFFFF' /* Blanco puro — Fondo actualizado */, 
        borderRadius: 16, 
        padding: 14, 
        marginBottom: 10, 
        borderLeftWidth: 5, 
        borderWidth: 1, 
        borderColor: '#E0E6ED' /* Borde perimetral claro — Actualizado */ 
    },
    // NOTA: borderLeftColor dinámico en JSX debe usar: '#00C853' (OK), '#FF3B30' (Riesgo/Inas) o '#FF9500' (Retiro)
    cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    // Badge con el número de lista en Vista Final
    nroBadge: { 
        width: 32, 
        height: 32, 
        borderRadius: 10, 
        backgroundColor: '#F2F4F7' /* Fondo gris claro adaptado al entorno limpio */, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    // Número de lista dentro del badge en Vista Final
    nroText: { 
        color: '#009EF7' /* Azul Movistar — Actualizado */, 
        fontSize: 13, 
        fontWeight: '900' 
    },
    // Nombre del estudiante en Vista Final
    nombre: { 
        color: '#1A1A2E' /* Texto oscuro — Actualizado */, 
        fontSize: 16, 
        fontWeight: '700' 
    },
    // Observación/nota del estudiante en Vista Final
    obs: { 
        color: '#8A9BB0' /* Gris de apoyo Movistar — Actualizado */, 
        fontSize: 12, 
        marginTop: 3, 
        fontStyle: 'italic' 
    },
    estadoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
    estadoText: { fontSize: 12, fontWeight: '800' },
    
    // Footer fijo en la parte inferior de Vista Final
    footer: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: '#F7F9FC' /* Gris/azul muy claro — Actualizado */, 
        paddingHorizontal: 20, 
        paddingTop: 14, 
        borderTopWidth: 1, 
        borderTopColor: '#E0E6ED' /* Línea superior clara — Actualizado */ 
    },
    // Botón "EDITAR ASISTENCIA" en el footer de Vista Final
    editarBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 10, 
        backgroundColor: '#009EF7' /* Azul Movistar principal — Actualizado */, 
        padding: 18, 
        borderRadius: 18 
    },
    // Texto "EDITAR ASISTENCIA" del botón del footer
    editarBtnText: { 
        color: '#FFFFFF' /* Blanco puro para alto contraste — Actualizado */, 
        fontWeight: '900', 
        fontSize: 16 
    },
});
