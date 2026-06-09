import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
    ActivityIndicator, ScrollView, Linking, Alert,
    Modal, Image, KeyboardAvoidingView, TextInput, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { API_URL } from '../constants';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface RegistroAusencia {
    id: number;
    nombre: string;
    apellido: string;
    cedula?: string;
    nro_lista: number;
    mencion: string;
    ano: number;
    estado: string;           // descripción de texto (puede variar según la BD)
    estado_codigo: 'P' | 'A' | 'R'; // código confiable: P=Presente, A=Inasistente, R=Retirado
    observaciones: string | null;
    fecha: string;
    materia: string;
}

interface ResumenEstudiante {
    nombre: string;
    apellido: string;
    cedula?: string;
    nro_lista: number;
    mencion: string;
    ano: number;
    totalInasistencias: number;
    totalRetirados: number;
    registros: RegistroAusencia[];
    // Datos del representante (pueden venir del acumulado o buscarse por cédula)
    rep_telefono?: string;
    rep_nombre?: string;
    rep_apellido?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const etiquetasAno: Record<string, string> = {
    '1': '1er Año', '2': '2do Año', '3': '3er Año', '4': '4to Año', '5': '5to Año',
};

const coloresMencion: Record<string, string> = {
    'Telemática': '#38BDF8',
    'Turismo': '#10B981',
    'Administración': '#F59E0B',
    'Contabilidad': '#818CF8',
};

// ─── Función para enviar WhatsApp ─────────────────────────────────────────────
/**
 * Envía notificación por WhatsApp al representante.
 * Primero intenta usar los datos del representante ya disponibles (rep_telefono, rep_nombre).
 * Si no están, los busca en la API usando la cédula del estudiante.
 */
const enviarWhatsApp = async (
    cedula: string | undefined,
    nombreEstudiante: string,
    apellidoEstudiante: string,
    items: { estado: string; materia: string; observaciones: string | null; fecha: string }[],
    modo: 'dia' | 'acumulado',
    totalInasistencias?: number,
    totalRetirados?: number,
    repTelefonoDirecto?: string,
    repNombreDirecto?: string
) => {
    let telefono: string | null = repTelefonoDirecto ?? null;
    let repNombre = repNombreDirecto ?? 'Representante';

    // Si ya tenemos el teléfono directo, no hace falta llamar a la API
    if (!telefono) {
        if (!cedula) {
            // Fallback: intentar buscar el estudiante por nombre y apellido
            try {
                const resBusqueda = await axios.get(`${API_URL}/estudiantes`);
                const lista: any[] = resBusqueda.data ?? [];
                const encontrado = lista.find(
                    (e: any) =>
                        (e.nombre ?? '').toLowerCase() === nombreEstudiante.toLowerCase() &&
                        (e.apellido ?? '').toLowerCase() === apellidoEstudiante.toLowerCase()
                );
                if (encontrado) {
                    telefono = encontrado.rep_telefono ?? null;
                    repNombre = encontrado.rep_nombre
                        ? `${encontrado.rep_nombre} ${encontrado.rep_apellido ?? ''}`.trim()
                        : 'Representante';
                }
            } catch {
                // Si falla el fallback, continúa y mostrará el alert de sin teléfono
            }
            if (!telefono) {
                Alert.alert('Sin cédula', 'No se pudo obtener la cédula del estudiante para buscar al representante.');
                return;
            }
        } else {
            try {
                const res = await axios.get(`${API_URL}/admin/estudiantes/${cedula}`);
                if (res.data.success && res.data.estudiante) {
                    const est = res.data.estudiante;
                    telefono = est.rep_telefono ?? null;
                    repNombre = est.rep_nombre ? `${est.rep_nombre} ${est.rep_apellido ?? ''}`.trim() : 'Representante';
                }
            } catch (e) {
                Alert.alert('Error', 'No se pudo obtener los datos del representante.');
                return;
            }
        }
    }

    if (!telefono) {
        Alert.alert('Sin teléfono', `No hay número de representante registrado para ${nombreEstudiante} ${apellidoEstudiante}.`);
        return;
    }

    // Normalizar teléfono para WhatsApp Venezuela: quitar todo excepto dígitos,
    // luego asegurar que empiece con 58 (sin duplicar)
    let telefonoLimpio = telefono.replace(/\D/g, ''); // solo dígitos
    if (telefonoLimpio.startsWith('58')) {
        // ya tiene código de país, usar tal cual
    } else if (telefonoLimpio.startsWith('0')) {
        // formato local venezolano (ej. 0412...) → quitar 0 y agregar 58
        telefonoLimpio = '58' + telefonoLimpio.substring(1);
    } else if (telefonoLimpio.length >= 10) {
        // número sin prefijo ni cero → agregar 58
        telefonoLimpio = '58' + telefonoLimpio;
    } else {
        Alert.alert('Teléfono inválido', `El número "${telefono}" no tiene el formato esperado.`);
        return;
    }

    let mensaje = '';

    if (modo === 'acumulado') {
        // Mensaje para vista acumulada
        mensaje =
            `Estimado/a *${repNombre}*, le informamos que el/la estudiante ` +
            `*${nombreEstudiante} ${apellidoEstudiante}* presenta el siguiente registro acumulado de inasistencias:\n\n` +
            `📋 *Inasistencias:* ${totalInasistencias ?? 0}\n` +
            `🚪 *Retiros:* ${totalRetirados ?? 0}\n` +
            `📊 *Total:* ${(totalInasistencias ?? 0) + (totalRetirados ?? 0)}\n\n` +
            `Le solicitamos comunicarse con la institución para recibir más información.\n\n` +
            `_E.T. J.R.G.S — Sistema de Asistencia_`;
    } else {
        // Mensaje para vista por día — detallar cada registro
        const hoy = items[0]?.fecha
            ? new Date(items[0].fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
            : 'hoy';

        const detalles = items.map(reg => {
            if (reg.estado === 'A' || reg.estado === 'Inasistente') {
                return `• *No asistió* a la clase de *${reg.materia}*${reg.observaciones ? `\n  📝 ${reg.observaciones}` : ''}`;
            } else if (reg.estado === 'R' || reg.estado === 'Retirado') {
                return `• Se *retiró anticipadamente* de la clase de *${reg.materia}*${reg.observaciones ? `\n  📝 ${reg.observaciones}` : ''}`;
            }
            return '';
        }).filter(Boolean).join('\n');

        mensaje =
            `Estimado/a *${repNombre}*, le informamos que el día *${hoy}*, ` +
            `el/la estudiante *${nombreEstudiante} ${apellidoEstudiante}* presentó la siguiente situación:\n\n` +
            `${detalles}\n\n` +
            `Si tiene alguna consulta, comuníquese con la institución.\n\n` +
            `_E.T. J.R.G.S — Sistema de Asistencia_`;
    }

    const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;

    try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('WhatsApp no disponible', 'No se pudo abrir WhatsApp en este dispositivo.');
        }
    } catch (e) {
        Alert.alert('Error', 'No se pudo abrir WhatsApp.');
    }
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function InasistenciasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [modo, setModo] = useState<'dia' | 'acumulado'>('dia');
    const [fecha, setFecha] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [mencionFiltro, setMencionFiltro] = useState('Todas');
    const [anoFiltro, setAnoFiltro] = useState('Todos');

    const [registrosDia, setRegistrosDia] = useState<RegistroAusencia[]>([]);
    const [resumenAcumulado, setResumenAcumulado] = useState<ResumenEstudiante[]>([]);
    const [cargando, setCargando] = useState(false);
    const [enviandoWA, setEnviandoWA] = useState<string | null>(null); // key del estudiante en carga

    // ── Estado modal de perfil ────────────────────────────────────────────────
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const menciones = ['Todas', 'Telemática', 'Turismo', 'Administración', 'Contabilidad'];
    const anos = ['Todos', '1', '2', '3', '4', '5'];

    // ── Cargar registros del día ──────────────────────────────────────────────
    const cargarDia = async (
        fechaSel: Date = fecha,
        filtroMencion: string = mencionFiltro,
        filtroAno: string = anoFiltro
    ) => {
        setCargando(true);
        try {
            const fechaStr = fechaSel.toISOString().split('T')[0];
            const params: any = { fecha: fechaStr };
            if (filtroMencion !== 'Todas') params.mencion = filtroMencion;
            if (filtroAno !== 'Todos') params.ano = filtroAno;

            const res = await axios.get(`${API_URL}/historial`, { params });
            const ausentes = (res.data as RegistroAusencia[]).filter(
                r => r.estado_codigo === 'A' || r.estado_codigo === 'R'
            );
            setRegistrosDia(ausentes);
        } catch (e) {
            console.error('Error al cargar inasistencias del día', e);
        } finally {
            setCargando(false);
        }
    };

    // ── Cargar acumulado ──────────────────────────────────────────────────────
    const cargarAcumulado = async (
        filtroMencion: string = mencionFiltro,
        filtroAno: string = anoFiltro
    ) => {
        setCargando(true);
        try {
            const params: any = {};
            if (filtroMencion !== 'Todas') params.mencion = filtroMencion;
            if (filtroAno !== 'Todos') params.ano = filtroAno;

            const res = await axios.get(`${API_URL}/inasistencias-acumuladas`, { params });
            setResumenAcumulado(res.data);
        } catch (e) {
            console.error('Error al cargar acumulado', e);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (modo === 'dia') cargarDia();
        else cargarAcumulado();
    }, [modo]);

    const cambiarMencion = (m: string) => {
        setMencionFiltro(m);
        if (modo === 'dia') cargarDia(fecha, m, anoFiltro);
        else cargarAcumulado(m, anoFiltro);
    };

    const cambiarAno = (a: string) => {
        setAnoFiltro(a);
        if (modo === 'dia') cargarDia(fecha, mencionFiltro, a);
        else cargarAcumulado(mencionFiltro, a);
    };

    const onChangeFecha = (_: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFecha(selectedDate);
            cargarDia(selectedDate, mencionFiltro, anoFiltro);
        }
    };

    // ── Agrupar registros del día por estudiante ──────────────────────────────
    const registrosAgrupados = () => {
        const mapa: Record<string, {
            nombre: string; apellido: string; cedula?: string;
            nro_lista: number; mencion: string; ano: number; items: RegistroAusencia[]
        }> = {};

        const ordenados = [...registrosDia].sort((a, b) => {
            if (a.mencion < b.mencion) return -1;
            if (a.mencion > b.mencion) return 1;
            if (Number(a.ano) !== Number(b.ano)) return Number(a.ano) - Number(b.ano);
            return (a.nro_lista ?? 0) - (b.nro_lista ?? 0);
        });

        ordenados.forEach(r => {
            const key = `${r.mencion}-${r.ano}-${r.nombre}-${r.apellido}`;
            if (!mapa[key]) {
                mapa[key] = {
                    nombre: r.nombre, apellido: r.apellido,
                    cedula: r.cedula,
                    nro_lista: r.nro_lista, mencion: r.mencion, ano: r.ano, items: []
                };
            }
            mapa[key].items.push(r);
        });

        return Object.values(mapa);
    };

    // ── Abrir modal de perfil ─────────────────────────────────────────────────
    const abrirPerfil = async (cedula: string | undefined, nombre: string, apellido: string) => {
        if (!cedula) {
            Alert.alert('Sin cédula', 'Este estudiante no tiene cédula registrada.');
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/admin/estudiantes/${cedula}`);
            if (res.data.success) {
                setEstudianteSeleccionado(res.data.estudiante);
                setModalVisible(true);
            } else {
                Alert.alert('No encontrado', 'No se encontraron datos del estudiante.');
            }
        } catch (e) {
            Alert.alert('Error', 'No se pudo obtener el perfil del estudiante.');
        }
    };

    // ── Renders ───────────────────────────────────────────────────────────────
    const colorMencion = (m: string) => coloresMencion[m] ?? '#64748B';

    const renderCardDia = ({ item }: { item: ReturnType<typeof registrosAgrupados>[0] }) => {
        const esInasistente = item.items.some(i => i.estado_codigo === 'A');
        const esRetirado = item.items.some(i => i.estado_codigo === 'R');
        const borderColor = esInasistente ? '#EF4444' : '#F59E0B';
        const color = colorMencion(item.mencion);
        const waKey = `${item.mencion}-${item.ano}-${item.nombre}-${item.apellido}`;
        const cargandoEste = enviandoWA === waKey;

        const handleWhatsApp = async () => {
            setEnviandoWA(waKey);
            await enviarWhatsApp(
                item.cedula,
                item.nombre,
                item.apellido,
                item.items.map(r => ({
                    estado: r.estado_codigo, // usar codigo confiable: 'A' | 'R'
                    materia: r.materia,
                    observaciones: r.observaciones,
                    fecha: r.fecha,
                })),
                'dia'
            );
            setEnviandoWA(null);
        };

        return (
            <View style={[styles.card, { borderLeftColor: borderColor }]}>
                {/* Encabezado */}
                <View style={styles.cardTop}>
                    <View style={[styles.numBadge, { backgroundColor: borderColor + '22', borderColor }]}>
                        <Text style={[styles.numBadgeTxt, { color: borderColor }]}>{item.nro_lista}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => abrirPerfil(item.cedula, item.nombre, item.apellido)} activeOpacity={0.7}>
                            <Text style={styles.cardNombre}>{item.nombre} {item.apellido}</Text>
                        </TouchableOpacity>
                        <View style={styles.cardMeta}>
                            <View style={[styles.mencionPill, { borderColor: color }]}>
                                <Text style={[styles.mencionPillTxt, { color }]}>{item.mencion}</Text>
                            </View>
                            <Text style={styles.cardAno}>{etiquetasAno[String(item.ano)]}</Text>
                        </View>
                    </View>
                    <View style={styles.estadoBadges}>
                        {esInasistente && (
                            <View style={[styles.estadoPill, { backgroundColor: '#EF444422', borderColor: '#EF4444' }]}>
                                <Text style={[styles.estadoPillTxt, { color: '#EF4444' }]}>Inasistente</Text>
                            </View>
                        )}
                        {esRetirado && (
                            <View style={[styles.estadoPill, { backgroundColor: '#F59E0B22', borderColor: '#F59E0B' }]}>
                                <Text style={[styles.estadoPillTxt, { color: '#F59E0B' }]}>Retirado</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Detalle por materia */}
                {item.items.map((reg, idx) => (
                    <View key={idx} style={styles.detalleRow}>
                        <View style={styles.detalleMateriaBadge}>
                            <Ionicons name="book-outline" size={11} color="#64748B" />
                            <Text style={styles.detalleMateriaText}>{reg.materia}</Text>
                        </View>
                        {reg.observaciones ? (
                            <View style={styles.obsBox}>
                                <Ionicons name="chatbubble-ellipses-outline" size={12} color="#94A3B8" />
                                <Text style={styles.obsText}>{reg.observaciones}</Text>
                            </View>
                        ) : (
                            <Text style={styles.sinObs}>Sin observaciones</Text>
                        )}
                    </View>
                ))}

                {/* ── Botón WhatsApp ── */}
                <TouchableOpacity
                    style={[styles.waBtn, cargandoEste && styles.waBtnCargando]}
                    onPress={handleWhatsApp}
                    disabled={cargandoEste}
                    activeOpacity={0.75}
                >
                    {cargandoEste ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
                    )}
                    <Text style={styles.waBtnText}>
                        {cargandoEste ? 'Buscando representante...' : 'Notificar al representante'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderCardAcumulado = ({ item }: { item: ResumenEstudiante }) => {
        const color = colorMencion(item.mencion);
        const total = item.totalInasistencias + item.totalRetirados;
        const alerta = total >= 5;
        const waKey = `${item.mencion}-${item.ano}-${item.nombre}-${item.apellido}`;
        const cargandoEste = enviandoWA === waKey;

        const handleWhatsApp = async () => {
            setEnviandoWA(waKey);
            await enviarWhatsApp(
                item.cedula,
                item.nombre,
                item.apellido,
                item.registros.map(r => ({
                    estado: r.estado,
                    materia: r.materia,
                    observaciones: r.observaciones,
                    fecha: r.fecha,
                })),
                'acumulado',
                item.totalInasistencias,
                item.totalRetirados,
                item.rep_telefono,
                item.rep_nombre ? `${item.rep_nombre} ${item.rep_apellido ?? ''}`.trim() : undefined
            );
            setEnviandoWA(null);
        };

        return (
            <View style={[styles.card, { borderLeftColor: alerta ? '#EF4444' : '#F59E0B' }]}>
                <View style={styles.cardTop}>
                    <View style={[styles.numBadge, { backgroundColor: (alerta ? '#EF4444' : '#F59E0B') + '22', borderColor: alerta ? '#EF4444' : '#F59E0B' }]}>
                        <Text style={[styles.numBadgeTxt, { color: alerta ? '#EF4444' : '#F59E0B' }]}>{item.nro_lista}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => abrirPerfil(item.cedula, item.nombre, item.apellido)} activeOpacity={0.7}>
                            <Text style={styles.cardNombre}>{item.nombre} {item.apellido}</Text>
                        </TouchableOpacity>
                        <View style={styles.cardMeta}>
                            <View style={[styles.mencionPill, { borderColor: color }]}>
                                <Text style={[styles.mencionPillTxt, { color }]}>{item.mencion}</Text>
                            </View>
                            <Text style={styles.cardAno}>{etiquetasAno[String(item.ano)]}</Text>
                        </View>
                    </View>
                    {alerta && (
                        <Ionicons name="warning" size={20} color="#EF4444" />
                    )}
                </View>

                {/* Contadores */}
                <View style={styles.contadoresRow}>
                    <View style={styles.contadorBox}>
                        <Text style={[styles.contadorNum, { color: '#EF4444' }]}>{item.totalInasistencias}</Text>
                        <Text style={styles.contadorLabel}>Inasistencias</Text>
                    </View>
                    <View style={styles.contadorDivider} />
                    <View style={styles.contadorBox}>
                        <Text style={[styles.contadorNum, { color: '#F59E0B' }]}>{item.totalRetirados}</Text>
                        <Text style={styles.contadorLabel}>Retirados</Text>
                    </View>
                    <View style={styles.contadorDivider} />
                    <View style={styles.contadorBox}>
                        <Text style={[styles.contadorNum, { color: alerta ? '#EF4444' : '#F8FAFC' }]}>{total}</Text>
                        <Text style={styles.contadorLabel}>Total</Text>
                    </View>
                </View>

                {/* Observaciones acumuladas */}
                {item.registros.filter(r => r.observaciones).length > 0 && (
                    <View style={styles.obsAcumContainer}>
                        <Text style={styles.obsAcumTitulo}>OBSERVACIONES REGISTRADAS</Text>
                        {item.registros.filter(r => r.observaciones).map((r, i) => (
                            <View key={i} style={styles.obsAcumRow}>
                                <Text style={styles.obsAcumFecha}>{r.fecha}</Text>
                                <View style={[styles.detalleMateriaBadge, { marginBottom: 4 }]}>
                                    <Text style={styles.detalleMateriaText}>{r.materia}</Text>
                                </View>
                                <Text style={styles.obsAcumTexto}>"{r.observaciones}"</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Botón WhatsApp ── */}
                <TouchableOpacity
                    style={[styles.waBtn, cargandoEste && styles.waBtnCargando]}
                    onPress={handleWhatsApp}
                    disabled={cargandoEste}
                    activeOpacity={0.75}
                >
                    {cargandoEste ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
                    )}
                    <Text style={styles.waBtnText}>
                        {cargandoEste ? 'Buscando representante...' : 'Notificar al representante'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    // ── Resumen del día ───────────────────────────────────────────────────────
    const totalInasistentesHoy = registrosDia.filter(r => r.estado === 'Inasistente').length;
    const totalRetiradosHoy = registrosDia.filter(r => r.estado === 'Retirado').length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#38BDF8" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.titulo}>Inasistencias</Text>
                    <Text style={styles.subtitulo}>Control de ausencias y retiros</Text>
                </View>
            </View>

            {/* Tabs: Día / Acumulado */}
            <View style={styles.tabsRow}>
                <TouchableOpacity
                    style={[styles.tab, modo === 'dia' && styles.tabActivo]}
                    onPress={() => setModo('dia')}
                >
                    <Ionicons name="calendar-outline" size={15} color={modo === 'dia' ? '#020617' : '#64748B'} />
                    <Text style={[styles.tabTxt, modo === 'dia' && styles.tabTxtActivo]}>Por Día</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, modo === 'acumulado' && styles.tabActivo]}
                    onPress={() => setModo('acumulado')}
                >
                    <Ionicons name="stats-chart" size={15} color={modo === 'acumulado' ? '#020617' : '#64748B'} />
                    <Text style={[styles.tabTxt, modo === 'acumulado' && styles.tabTxtActivo]}>Acumulado</Text>
                </TouchableOpacity>
            </View>

            {/* Selector de fecha (solo en modo día) */}
            {modo === 'dia' && (
                <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
                    <Ionicons name="calendar-outline" size={18} color="#F8FAFC" />
                    <Text style={styles.dateText}>
                        {fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#38BDF8" />
                </TouchableOpacity>
            )}
            {showDatePicker && (
                <DateTimePicker value={fecha} mode="date" display="default" onChange={onChangeFecha} />
            )}

            {/* Filtros */}
            <Text style={styles.filtroLabel}>AÑO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll} contentContainerStyle={{ alignItems: 'center', paddingRight: 8 }}>
                {anos.map(a => (
                    <TouchableOpacity
                        key={a}
                        onPress={() => cambiarAno(a)}
                        style={[styles.filtroBtn, anoFiltro === a && styles.filtroBtnAnoActivo]}
                    >
                        <Text style={[styles.filtroBtnTxt, anoFiltro === a && styles.filtroBtnTxtActivo]}>
                            {a === 'Todos' ? 'Todos' : etiquetasAno[a]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.filtroLabel}>MENCIÓN</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll} contentContainerStyle={{ alignItems: 'center', paddingRight: 8 }}>
                {menciones.map(m => (
                    <TouchableOpacity
                        key={m}
                        onPress={() => cambiarMencion(m)}
                        style={[styles.filtroBtn, mencionFiltro === m && styles.filtroBtnActivo]}
                    >
                        <Text style={[styles.filtroBtnTxt, mencionFiltro === m && styles.filtroBtnTxtActivo]}>{m}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Resumen rápido (solo modo día) */}
            {modo === 'dia' && !cargando && (
                <View style={styles.resumenRow}>
                    <View style={styles.resumenBox}>
                        <Text style={[styles.resumenNum, { color: '#EF4444' }]}>{totalInasistentesHoy}</Text>
                        <Text style={styles.resumenLabel}>Inasistentes</Text>
                    </View>
                    <View style={styles.resumenDivider} />
                    <View style={styles.resumenBox}>
                        <Text style={[styles.resumenNum, { color: '#F59E0B' }]}>{totalRetiradosHoy}</Text>
                        <Text style={styles.resumenLabel}>Retirados</Text>
                    </View>
                    <View style={styles.resumenDivider} />
                    <View style={styles.resumenBox}>
                        <Text style={[styles.resumenNum, { color: '#F8FAFC' }]}>{totalInasistentesHoy + totalRetiradosHoy}</Text>
                        <Text style={styles.resumenLabel}>Total</Text>
                    </View>
                </View>
            )}

            {cargando ? (
                <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
            ) : modo === 'dia' ? (
                <FlatList
                    data={registrosAgrupados()}
                    keyExtractor={(item, i) => `${item.mencion}-${item.ano}-${item.nombre}-${i}`}
                    renderItem={renderCardDia}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="checkmark-circle-outline" size={50} color="#10B981" />
                            <Text style={styles.emptyTitulo}>¡Sin ausencias!</Text>
                            <Text style={styles.emptyTexto}>Todos los estudiantes asistieron este día.</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 30 + insets.bottom }}
                />
            ) : (
                <FlatList
                    data={resumenAcumulado}
                    keyExtractor={(item, i) => `${item.mencion}-${item.ano}-${item.nombre}-${i}`}
                    renderItem={renderCardAcumulado}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="checkmark-circle-outline" size={50} color="#10B981" />
                            <Text style={styles.emptyTitulo}>Sin registros</Text>
                            <Text style={styles.emptyTexto}>No hay inasistencias acumuladas.</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 30 + insets.bottom }}
                />
            )}

            {/* ── MODAL DE PERFIL ── */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <View style={styles.modalTopBar}>
                                <View style={{ width: 70 }} />
                                <TouchableOpacity
                                    style={styles.modalCloseBtn}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Ionicons name="close" size={22} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                    <Image
                                        source={{ uri: `https://ui-avatars.com/api/?name=${estudianteSeleccionado?.nombre}+${estudianteSeleccionado?.apellido}&background=1e293b&color=38bdf8&bold=true&size=200` }}
                                        style={styles.modalAvatar}
                                    />
                                    <Text style={styles.modalNombre}>
                                        {estudianteSeleccionado?.nombre} {estudianteSeleccionado?.apellido}
                                    </Text>
                                    <View style={styles.modalMencionPill}>
                                        <Text style={styles.modalMencionText}>{estudianteSeleccionado?.mencion}</Text>
                                    </View>
                                </View>

                                <Text style={styles.modalSeccionTitulo}>DATOS DEL ESTUDIANTE</Text>
                                <View style={styles.modalInfoBox}>
                                    {[
                                        { icono: 'list-outline', label: 'Nro. de Lista', valor: `#${estudianteSeleccionado?.nro_lista ?? '—'}` },
                                        { icono: 'card-outline', label: 'Cédula', valor: estudianteSeleccionado?.cedula || '—' },
                                        { icono: 'school-outline', label: 'Año de Estudio', valor: estudianteSeleccionado?.ano ? `${estudianteSeleccionado.ano}°` : '—' },
                                    ].map((campo, i, arr) => (
                                        <View key={campo.label}>
                                            <View style={styles.modalRow}>
                                                <View style={styles.modalIconBox}>
                                                    <Ionicons name={campo.icono as any} size={16} color="#38BDF8" />
                                                </View>
                                                <View>
                                                    <Text style={styles.modalLabel}>{campo.label}</Text>
                                                    <Text style={styles.modalValue}>{campo.valor}</Text>
                                                </View>
                                            </View>
                                            {i < arr.length - 1 && <View style={styles.modalSep} />}
                                        </View>
                                    ))}
                                </View>

                                <Text style={[styles.modalSeccionTitulo, { marginTop: 16 }]}>DATOS DEL REPRESENTANTE</Text>
                                <View style={styles.modalInfoBox}>
                                    {[
                                        { icono: 'person-outline', label: 'Nombre', valor: estudianteSeleccionado?.rep_nombre ? `${estudianteSeleccionado.rep_nombre} ${estudianteSeleccionado.rep_apellido ?? ''}`.trim() : '—' },
                                        { icono: 'card-outline', label: 'Cédula', valor: estudianteSeleccionado?.rep_cedula || '—' },
                                        { icono: 'call-outline', label: 'Teléfono', valor: estudianteSeleccionado?.rep_telefono || '—' },
                                        { icono: 'location-outline', label: 'Dirección', valor: estudianteSeleccionado?.direccion || '—' },
                                    ].map((campo, i, arr) => (
                                        <View key={campo.label}>
                                            <View style={styles.modalRow}>
                                                <View style={styles.modalIconBox}>
                                                    <Ionicons name={campo.icono as any} size={16} color="#38BDF8" />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.modalLabel}>{campo.label}</Text>
                                                    <Text style={styles.modalValue}>{campo.valor}</Text>
                                                </View>
                                            </View>
                                            {i < arr.length - 1 && <View style={styles.modalSep} />}
                                        </View>
                                    ))}
                                </View>
                                <View style={{ height: 20 }} />
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    // Fondo principal de toda la pantalla — Gris/azul muy claro (entorno claro de lectura)
    container: { 
        flex: 1, 
        backgroundColor: '#F7F9FC', 
        paddingHorizontal: 20 
    },

    header: { 
        marginTop: 60, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20, 
        gap: 14 
    },
    // Fondo del botón de retroceso (flecha ←) en el header — Azul muy claro Movistar
    backBtn: { 
        padding: 10, 
        backgroundColor: '#EAF6FF', 
        borderRadius: 12 
    },
    // Color del texto del título principal "Inasistencias" — Azul muy oscuro de alta densidad
    titulo: { 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#1A1A2E' 
    },
    // Color del subtítulo debajo del título — Gris de apoyo Movistar
    subtitulo: { 
        fontSize: 12, 
        color: '#8A9BB0', 
        marginTop: 2 
    },

    // Tabs (Selector de modo "Por Día" / "Acumulado")
    // Fondo del contenedor de los tabs — Blanco puro con borde gris sutil
    tabsRow: { 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 14, 
        padding: 4, 
        marginBottom: 14, 
        borderWidth: 1, 
        borderColor: '#E0E6ED' 
    },
    tab: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 6, 
        paddingVertical: 10, 
        borderRadius: 10 
    },
    // Fondo del tab activo seleccionado — Azul Movistar principal
    tabActivo: { 
        backgroundColor: '#009EF7' 
    },
    // Texto de los tabs inactivos — Gris de apoyo Movistar
    tabTxt: { 
        color: '#8A9BB0', 
        fontSize: 13, 
        fontWeight: '700' 
    },
    // Texto del tab activo — Blanco puro (alto contraste sobre el fondo azul)
    tabTxtActivo: { 
        color: '#FFFFFF' 
    },

    // Selector de fecha (Botón con el calendario)
    // Fondo del selector de fecha — Blanco puro con borde gris sutil
    dateSelector: {
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        padding: 12,
        borderRadius: 12, 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderWidth: 1, 
        borderColor: '#E0E6ED', 
        marginBottom: 14,
    },
    // Color del texto de la fecha mostrada en el selector — Azul muy oscuro
    dateText: { 
        color: '#1A1A2E', 
        fontSize: 15, 
        fontWeight: '700' 
    },

    // Filtros
    // Color de las etiquetas "AÑO" y "MENCIÓN" sobre los filtros — Gris de apoyo Movistar
    filtroLabel: { 
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 1.5, 
        marginBottom: 6, 
        marginLeft: 2 
    },
    filtroScroll: { 
        marginBottom: 12, 
        height: 40, 
        flexGrow: 0, 
        flexShrink: 0 
    },
    // Fondo de cada botón de filtro inactivo — Gris suave neutro con borde sutil
    filtroBtn: { 
        height: 34, 
        paddingHorizontal: 14, 
        borderRadius: 20, 
        backgroundColor: '#F2F4F7', 
        marginRight: 8, 
        borderWidth: 1, 
        borderColor: '#E0E6ED', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    // Fondo y borde del botón de filtro de MENCIÓN activo — Azul Movistar principal
    filtroBtnActivo: { 
        backgroundColor: '#009EF7', 
        borderColor: '#009EF7' 
    },
    // Fondo y borde del botón de filtro de AÑO activo — Azul Movistar principal (Unificado)
    filtroBtnAnoActivo: { 
        backgroundColor: '#009EF7', 
        borderColor: '#009EF7' 
    },
    // Texto de los botones de filtro inactivos — Gris de apoyo Movistar
    filtroBtnTxt: { 
        color: '#8A9BB0', 
        fontSize: 12, 
        fontWeight: '700' 
    },
    // Texto de los botones de filtro activos — Blanco puro
    filtroBtnTxtActivo: { 
        color: '#FFFFFF' 
    },

    // Resumen rápido superior
    // Fondo de la fila de resumen rápido — Blanco puro con borde gris sutil
    resumenRow: { 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 14, 
        padding: 12, 
        borderWidth: 1, 
        borderColor: '#E0E6ED', 
        marginBottom: 14, 
        justifyContent: 'space-around' 
    },
    resumenBox: { 
        alignItems: 'center' 
    },
    // Nota JSX: resumenNum recibe colores inline: '#FF3B30' (Rojo Alerta), '#FF9500' (Ámbar), y '#1A1A2E' (Oscuro para el Total)
    resumenNum: { 
        fontSize: 22, 
        fontWeight: '900' 
    },
    // Etiquetas del resumen — Gris de apoyo Movistar
    resumenLabel: { 
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '700', 
        marginTop: 2 
    },
    // Línea divisora vertical entre las cajas del resumen — Gris sutil de estructura
    resumenDivider: { 
        width: 1, 
        backgroundColor: '#E0E6ED' 
    },

    // Cards de alumnos con incidencias
    // Fondo de cada card de estudiante — Blanco puro con borde gris sutil
    // Nota JSX: borderLeftColor se aplica inline: '#FF3B30' (Rojo Alerta) o '#FF9500' (Ámbar) según estado
    card: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 18, 
        padding: 16,
        marginBottom: 14, 
        borderLeftWidth: 5, 
        borderWidth: 1, 
        borderColor: '#E0E6ED',
    },
    cardTop: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        gap: 12, 
        marginBottom: 12 
    },
    // Nota JSX: numBadge recibe colores claros inline: backgroundColor: '#FF3B301A' o '#FF95001A', borderColor: '#FF3B30' o '#FF9500'
    numBadge: { 
        width: 36, 
        height: 36, 
        borderRadius: 10, 
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    numBadgeTxt: { 
        fontSize: 14, 
        fontWeight: '900' 
    },
    // Color del nombre del estudiante en la card — Azul muy oscuro
    cardNombre: { 
        color: '#1A1A2E', 
        fontSize: 16, 
        fontWeight: '800', 
        marginBottom: 4 
    },
    cardMeta: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8 
    },
    // Nota JSX: mencionPill recibe borderColor inline según especialidad mapeada con tonos Movistar claros
    mencionPill: { 
        paddingHorizontal: 8, 
        paddingVertical: 2, 
        borderRadius: 8, 
        borderWidth: 1,
        backgroundColor: '#FFFFFF'
    },
    mencionPillTxt: { 
        fontSize: 10, 
        fontWeight: '800' 
    },
    // Color del texto del año en la card — Gris de apoyo Movistar
    cardAno: { 
        color: '#8A9BB0', 
        fontSize: 11, 
        fontWeight: '600' 
    },
    estadoBadges: { 
        gap: 4, 
        alignItems: 'flex-end' 
    },
    // Nota JSX: estadoPill recibe colores inline claros (ej: fondo '#FF3B301A', borde '#FF3B30' para inasistencias)
    estadoPill: { 
        paddingHorizontal: 8, 
        paddingVertical: 3, 
        borderRadius: 8, 
        borderWidth: 1 
    },
    estadoPillTxt: { 
        fontSize: 10, 
        fontWeight: '800' 
    },

    // Detalle por materia (Modo día)
    // Borde superior del separador entre materias — Gris sutil de estructura
    detalleRow: { 
        marginBottom: 8, 
        paddingTop: 8, 
        borderTopWidth: 1, 
        borderTopColor: '#E0E6ED' 
    },
    detalleMateriaBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 5, 
        marginBottom: 5 
    },
    // Color del texto de la materia — Gris de apoyo Movistar
    detalleMateriaText: { 
        color: '#8A9BB0', 
        fontSize: 11, 
        fontWeight: '700' 
    },
    // Fondo del recuadro de observaciones en modo día — Gris suave neutro
    obsBox: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        gap: 6, 
        backgroundColor: '#F2F4F7', 
        padding: 8, 
        borderRadius: 8 
    },
    // Color del texto de observaciones — Gris de apoyo Movistar
    obsText: { 
        color: '#8A9BB0', 
        fontSize: 12, 
        fontStyle: 'italic', 
        flex: 1 
    },
    // Color del texto "Sin observaciones" — Gris de apoyo Movistar desvanecido
    sinObs: { 
        color: '#8A9BB0', 
        fontSize: 11, 
        fontStyle: 'italic' 
    },

    // Contadores (Modo acumulado)
    // Fondo del panel de contadores dentro de la card acumulada — Gris suave de lectura con borde sutil
    contadoresRow: { 
        flexDirection: 'row', 
        backgroundColor: '#F2F4F7', 
        borderRadius: 12, 
        padding: 12, 
        marginBottom: 12, 
        justifyContent: 'space-around', 
        borderWidth: 1, 
        borderColor: '#E0E6ED' 
    },
    contadorBox: { 
        alignItems: 'center' 
    },
    // Nota JSX: contadorNum recibe color inline: '#FF3B30' (Inasistencias), '#FF9500' (Retirados) o '#1A1A2E' (Total neutro)
    contadorNum: { 
        fontSize: 24, 
        fontWeight: '900' 
    },
    // Etiquetas de los contadores — Gris de apoyo Movistar
    contadorLabel: { 
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '700', 
        marginTop: 2 
    },
    // Línea divisora vertical entre los contadores — Gris sutil de estructura
    contadorDivider: { 
        width: 1, 
        backgroundColor: '#E0E6ED' 
    },

    // Observaciones acumuladas (Historial extendido)
    // Fondo del bloque de observaciones acumuladas — Gris suave de lectura con borde sutil
    obsAcumContainer: { 
        backgroundColor: '#F2F4F7', 
        borderRadius: 12, 
        padding: 12, 
        borderWidth: 1, 
        borderColor: '#E0E6ED' 
    },
    // Color de la etiqueta de la sección de acumulados — Gris de apoyo Movistar
    obsAcumTitulo: { 
        color: '#8A9BB0', 
        fontSize: 9, 
        fontWeight: '800', 
        letterSpacing: 1.5, 
        marginBottom: 10 
    },
    // Borde inferior de cada fila de observación acumulada — Gris sutil de estructura
    obsAcumRow: { 
        marginBottom: 10, 
        paddingBottom: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#E0E6ED' 
    },
    // Color de la fecha en cada observación acumulada — Azul Movistar principal
    obsAcumFecha: { 
        color: '#009EF7', 
        fontSize: 11, 
        fontWeight: '700', 
        marginBottom: 4 
    },
    // Color del texto de la observación acumulada — Gris de apoyo Movistar
    obsAcumTexto: { 
        color: '#8A9BB0', 
        fontSize: 12, 
        fontStyle: 'italic' 
    },

    // Empty state (Pantalla vacía sin reportes)
    emptyContainer: { 
        alignItems: 'center', 
        marginTop: 60, 
        gap: 10 
    },
    // Color del título "¡Sin ausencias!" — Verde Movistar de éxito limpio
    emptyTitulo: { 
        color: '#00C853', 
        fontSize: 18, 
        fontWeight: '900' 
    },
    // Color del texto descriptivo del estado vacío — Gris de apoyo Movistar
    emptyTexto: { 
        color: '#8A9BB0', 
        fontSize: 14, 
        textAlign: 'center' 
    },

    // ── Notificación vía WhatsApp ──
    // Fondo del botón "Notificar al representante" — Verde oficial WhatsApp estandarizado
    waBtn: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#25D366',
        paddingVertical: 12,
        borderRadius: 12,
    },
    // Fondo del botón de WhatsApp mientras está procesando
    waBtnCargando: {
        backgroundColor: '#1EBE57',
        opacity: 0.8,
    },
    // Texto del botón de WhatsApp — Blanco puro para alto contraste
    waBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },

    // ── Modal inferior de Perfil de Alumno ──
    // Fondo del overlay semitransparente — Oscurecido ligero balanceado para entorno claro
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(26, 26, 46, 0.45)', 
        justifyContent: 'flex-end' 
    },
    // Fondo del panel inferior del modal — Blanco puro con borde superior sutil
    modalCard: {
        backgroundColor: '#FFFFFF', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30,
        padding: 28, 
        paddingBottom: 45, 
        maxHeight: '90%', 
        borderTopWidth: 1, 
        borderColor: '#E0E6ED',
    },
    modalTopBar: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        marginBottom: 16 
    },
    // Fondo del botón de cierre "✕" del modal — Gris suave neutro
    modalCloseBtn: { 
        backgroundColor: '#F2F4F7', 
        borderRadius: 20, 
        padding: 6 
    },
    // Borde del avatar circular del estudiante en el modal — Azul Movistar principal
    modalAvatar: { 
        width: 90, 
        height: 90, 
        borderRadius: 25, 
        borderWidth: 3, 
        borderColor: '#009EF7', 
        marginBottom: 14 
    },
    // Color del nombre del estudiante en el modal — Azul muy oscuro
    modalNombre: { 
        fontSize: 22, 
        fontWeight: '900', 
        color: '#1A1A2E', 
        textAlign: 'center', 
        marginBottom: 8 
    },
    // Fondo de la pastilla de mención en el modal — Gris sutil con borde Azul Movistar
    modalMencionPill: {
        backgroundColor: '#F2F4F7', 
        paddingHorizontal: 14, 
        paddingVertical: 5,
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#009EF7', 
        marginBottom: 18,
    },
    // Color del texto de la mención en la pastilla del modal — Azul Movistar principal
    modalMencionText: { 
        color: '#009EF7', 
        fontSize: 12, 
        fontWeight: '700' 
    },
    // Color de los títulos de sección dentro del modal — Gris de apoyo Movistar
    modalSeccionTitulo: {
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 1.5,
        textTransform: 'uppercase', 
        marginBottom: 8, 
        marginLeft: 4,
    },
    // Fondo del recuadro de datos en el modal — Blanco puro con borde sutil estructurado
    modalInfoBox: {
        width: '100%', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 18,
        padding: 16, 
        borderWidth: 1, 
        borderColor: '#E0E6ED', 
        marginBottom: 8,
    },
    modalRow: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        gap: 12, 
        paddingVertical: 4 
    },
    // Fondo del cuadro del ícono en cada fila del modal — Gris suave neutro
    modalIconBox: {
        width: 34, 
        height: 34, 
        backgroundColor: '#F2F4F7', 
        borderRadius: 9,
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 2,
    },
    // Color de la etiqueta del campo en el modal — Gris de apoyo Movistar
    modalLabel: { 
        color: '#8A9BB0', 
        fontSize: 11, 
        fontWeight: '600', 
        marginBottom: 2 
    },
    // Color del valor del campo en el modal — Azul muy oscuro
    modalValue: { 
        color: '#1A1A2E', 
        fontSize: 15, 
        fontWeight: '700' 
    },
    // Color del separador horizontal entre filas del modal — Gris sutil de estructura
    modalSep: { 
        height: 1, 
        backgroundColor: '#E0E6ED', 
        marginVertical: 10 
    },
});