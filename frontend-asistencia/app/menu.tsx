import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Sidebar, { MenuButton } from '../components/Sidebar';

export default function MenuScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { rol, usuario, anoFiltro: anoFiltroParam, menciones_permitidas, materia } = useLocalSearchParams();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [anoActual, setAnoActual] = useState(String(anoFiltroParam ?? '1'));
    const [showAnoPicker, setShowAnoPicker] = useState(false);

    const todosPorRol =
        rol === 'admin' ? ['1', '2', '3', '4', '5']
            : rol === 'docente_manana' ? ['1', '2', '3']
                : rol === 'docente_tarde' ? ['4', '5']
                    : ['1', '2', '3', '4', '5'];

    const mpStr = String(menciones_permitidas ?? '').trim();
    const tieneMenciones = mpStr !== '' && mpStr !== 'null' && mpStr !== 'undefined';

    const anosPermitidos: string[] = tieneMenciones
        ? [...new Set(mpStr.split(',').map(p => p.trim().split(':')[1]).filter(Boolean))]
            .filter(a => todosPorRol.includes(a))
            .sort((a, b) => Number(a) - Number(b))
        : todosPorRol;

    const etiquetasAno: Record<string, string> = {
        '1': '1er Año', '2': '2do Año', '3': '3er Año', '4': '4to Año', '5': '5to Año',
    };

    // Colores pastel de fondo para el badge/banner de cada año
    const coloresPorAno: Record<string, string> = {
        '1': '#A8DFFE', // Azul pastel — color de acento para el 1er Año (badge, banner, punto del modal)
        '2': '#A7EDD8', // Verde pastel — color de acento para el 2do Año (badge, banner, punto del modal)
        '3': '#FDDEA0', // Amarillo pastel — color de acento para el 3er Año (badge, banner, punto del modal)
        '4': '#C9CBFA', // Violeta pastel — color de acento para el 4to Año (badge, banner, punto del modal)
        '5': '#FAB8D8', // Rosa pastel — color de acento para el 5to Año (badge, banner, punto del modal)
    };

    // Colores de texto oscuro que contrastan sobre cada pastel
    const textColorPorAno: Record<string, string> = {
        '1': '#073347', // Azul petróleo oscuro — texto sobre el badge/banner azul del 1er Año
        '2': '#064033', // Verde botella oscuro — texto sobre el badge/banner verde del 2do Año
        '3': '#5A3600', // Marrón oscuro — texto sobre el badge/banner amarillo del 3er Año
        '4': '#1e1b6b', // Índigo/morado oscuro — texto sobre el badge/banner violeta del 4to Año
        '5': '#6b1040', // Burdeos oscuro — texto sobre el badge/banner rosa del 5to Año
    };

    const todasLasMenciones = [
        { nombre: 'Telemática',      color: '#A8DFFE', icon: 'code-working' }, // Azul pastel — ícono y fondo de la card de Telemática
        { nombre: 'Turismo',         color: '#A7EDD8', icon: 'airplane'      }, // Verde pastel — ícono y fondo de la card de Turismo
        { nombre: 'Administración',  color: '#FDDEA0', icon: 'business'      }, // Amarillo pastel — ícono y fondo de la card de Administración
        { nombre: 'Contabilidad',    color: '#C9CBFA', icon: 'calculator'    }, // Violeta pastel — ícono y fondo de la card de Contabilidad
    ];

    const menciones = tieneMenciones
        ? todasLasMenciones.filter(m => {
            const pares = mpStr.split(',').map(p => p.trim());
            return pares.some(p => {
                const [men, ano] = p.split(':');
                return men.trim() === m.nombre && ano.trim() === anoActual;
            });
        })
        : todasLasMenciones;

    const colorAno = coloresPorAno[anoActual] ?? '#A8DFFE';
    const textColorAno = textColorPorAno[anoActual] ?? '#0D2340';

    return (
        <View style={styles.container}>
            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
                rol={String(rol ?? '')}
                usuario={String(usuario ?? '')}
                menciones_permitidas={mpStr}
                materia={String(materia ?? '')}
                anoFiltro={anoActual}
            />

            {/* Modal selector de año */}
            <Modal visible={showAnoPicker} transparent animationType="fade" onRequestClose={() => setShowAnoPicker(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAnoPicker(false)}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Cambiar Año</Text>
                        {anosPermitidos.map(a => (
                            <TouchableOpacity
                                key={a}
                                style={[
                                    styles.modalItem,
                                    anoActual === a && { backgroundColor: coloresPorAno[a] + '66', borderColor: coloresPorAno[a] }
                                    // El color de fondo del item seleccionado viene de coloresPorAno[a] + '66' (transparencia 40%)
                                    // El borde del item seleccionado viene de coloresPorAno[a] (el pastel del año correspondiente)
                                ]}
                                onPress={() => { setAnoActual(a); setShowAnoPicker(false); }}
                            >
                                <View style={[styles.modalDot, { backgroundColor: coloresPorAno[a] }]} />
                                {/* El punto de color del item usa el pastel del año (coloresPorAno[a]) */}
                                <Text style={[styles.modalItemText, anoActual === a && { color: textColorPorAno[a], fontWeight: '900' }]}>
                                    {/* El texto del año seleccionado usa textColorPorAno[a] (oscuro del año) */}
                                    {etiquetasAno[a]}
                                </Text>
                                {anoActual === a && <Ionicons name="checkmark-circle" size={20} color={coloresPorAno[a]} />}
                                {/* El ícono de check usa el pastel del año (coloresPorAno[a]) */}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Top bar */}
            <View style={styles.topBar}>
                <MenuButton onPress={() => setSidebarVisible(true)} />
                <Text style={styles.logoText}>E.T. J.R.G.S</Text>
                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/perfil', params: { usuario, rol } })}
                    style={styles.perfilBtn}
                >
                    <Ionicons name="person-circle-outline" size={32} color="#5A9FDE" />
                    {/* Azul medio — ícono del botón de perfil en la barra superior */}
                </TouchableOpacity>
            </View>

            {/* Banner año activo */}
            <TouchableOpacity
                style={[styles.anoBanner, { borderColor: colorAno }]}
                // El borde del banner toma el color pastel del año activo (colorAno = coloresPorAno[anoActual])
                onPress={() => anosPermitidos.length > 1 && setShowAnoPicker(true)}
                activeOpacity={anosPermitidos.length > 1 ? 0.7 : 1}
            >
                <View style={[styles.anoBadge, { backgroundColor: colorAno }]}>
                    {/* El badge cuadrado toma el color pastel del año activo como fondo */}
                    <Ionicons name="school" size={18} color={textColorAno} />
                    {/* El ícono del badge toma el color oscuro del año activo (textColorAno) */}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.anoLabel}>AÑO ACTIVO</Text>
                    <Text style={[styles.anoValor, { color: textColorAno }]}>
                        {/* El texto del año activo usa el color oscuro correspondiente al año */}
                        {etiquetasAno[anoActual] ?? `${anoActual}° Año`}
                    </Text>
                </View>
                {anosPermitidos.length > 1 && (
                    <View style={[styles.cambiarBtn, { backgroundColor: colorAno + '55' }]}>
                        {/* El botón "Cambiar" usa el pastel del año activo con transparencia ~33% */}
                        <Ionicons name="swap-vertical" size={16} color={textColorAno} />
                        {/* Ícono y texto del botón "Cambiar" con el color oscuro del año activo */}
                        <Text style={[styles.cambiarText, { color: textColorAno }]}>Cambiar</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.saludo}>
                    {rol === 'admin' ? 'Panel Administrativo' : 'Panel de Control'}
                </Text>
                <Text style={styles.subtitulo}>
                    {rol === 'admin'
                        ? 'Consulta listas y gestiona estudiantes:'
                        : 'Selecciona la mención para el pase de lista:'}
                </Text>
            </View>

            <ScrollView contentContainerStyle={[styles.grid, { paddingBottom: 60 + insets.bottom }]}>

                {rol === 'admin' && (
                    <TouchableOpacity style={styles.btnAdmin} onPress={() => router.push({ pathname: '/gestion' as any, params: { anoFiltro: anoActual } })}>
                        <View style={styles.cardInfo}>
                            <View style={styles.iconCircleAdmin}>
                                <Ionicons name="person-add" size={24} color="#6B4000" />
                                {/* Marrón oscuro — ícono de "Agregar persona" dentro del círculo dorado del botón de Gestión de Matrícula */}
                            </View>
                            <View>
                                <Text style={styles.adminTextMain}>Gestión de Matrícula</Text>
                                <Text style={styles.adminTextSub}>Inscribir o editar alumnos</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#6B4000" />
                        {/* Marrón oscuro — ícono de flecha derecha al final del botón de Gestión de Matrícula */}
                    </TouchableOpacity>
                )}

                {rol === 'admin' && (
                    <TouchableOpacity style={styles.btnInasistencias} onPress={() => router.push({ pathname: '/inasistencias' as any, params: { anoFiltro: anoActual } })}>
                        <View style={styles.cardInfo}>
                            <View style={styles.iconCircleInasistencias}>
                                <Ionicons name="alert-circle" size={24} color="#EF4444" />
                                {/* Rojo vivo — ícono de alerta dentro del círculo rosado del botón de Inasistencias */}
                            </View>
                            <View>
                                <Text style={styles.inasistenciasTextMain}>Control de Inasistencias</Text>
                                <Text style={styles.inasistenciasTextSub}>Ausencias, retiros y observaciones</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#EF4444" />
                        {/* Rojo vivo — ícono de flecha al final del botón de Inasistencias */}
                    </TouchableOpacity>
                )}

                {menciones.map((m) => (
                    <View key={m.nombre} style={[styles.cardContainer, { borderLeftColor: m.color }]}>
                        {/* El borde izquierdo grueso de cada card de mención usa el color pastel de esa mención */}
                        <TouchableOpacity
                            style={styles.cardMain}
                            onPress={() => router.push({
                                pathname: '/asistencia',
                                params: {
                                    seleccion: m.nombre,
                                    rol,
                                    usuario: usuario ?? '',
                                    anoFiltro: anoActual,
                                    materia: materia ?? '',
                                    menciones_permitidas: mpStr,
                                }
                            })}
                        >
                            <View style={styles.cardInfo}>
                                <View style={[styles.iconMencion, { backgroundColor: m.color + '44' }]}>
                                    {/* El fondo del ícono de cada mención usa el pastel de esa mención con transparencia ~27% */}
                                    <Ionicons name={m.icon as any} size={22} color={m.color.replace('FE','B0').replace('D8','90').replace('A0','70').replace('FA','D0')} />
                                    {/* El ícono usa una versión más oscura del color pastel de la mención (reemplazando los componentes hex más brillantes) */}
                                </View>
                                <View>
                                    <Text style={styles.cardText}>{m.nombre}</Text>
                                    <Text style={styles.cardSub}>
                                        {rol === 'admin' ? 'Ver lista de estudiantes' : 'Registrar hoy'}
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name={rol === 'admin' ? 'people-outline' : 'chevron-forward'}
                                size={20}
                                color="#5A80A8"
                                // Azul grisáceo — ícono de flecha/personas al final de cada card de mención
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/estadisticas', params: { mencion: m.nombre, anoFiltro: anoActual } })}
                            style={[styles.statsBtn, { borderTopColor: '#99C4EF' }]}
                            // Azul celeste claro — línea divisoria entre la card principal y la franja de estadísticas
                        >
                            <Ionicons name="bar-chart" size={16} color="#5A9FDE" />
                            {/* Azul medio — ícono de gráfico de barras en la franja "VER ESTADÍSTICAS" */}
                            <Text style={styles.statsBtnText}>VER ESTADÍSTICAS</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.btnHistorial}
                    onPress={() => router.push({
                        pathname: '/historial',
                        params: { rol, menciones_permitidas: String(menciones_permitidas ?? '') }
                    })}
                >
                    <Ionicons name="calendar" size={20} color="#5A9FDE" style={{ marginRight: 10 }} />
                    {/* Azul medio — ícono de calendario en el botón de historial */}
                    <Text style={styles.btnHistorialText}>Ver Historial de Asistencias</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

   // ─────────────────────────────────────────────────────────────────────────────
    // PANTALLA COMPLETA — fondo general de todo el menú principal
    // ─────────────────────────────────────────────────────────────────────────────
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC', // Gris/azul muy claro — nuevo fondo limpio para todo el menú principal
        padding: 20,
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // BARRA SUPERIOR — contiene el botón de menú (hamburguesa), el nombre de la escuela y el acceso al perfil
    // ─────────────────────────────────────────────────────────────────────────────
    topBar: {
        marginTop: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        color: '#8A9BB0',           // Gris azulado sutil — color del texto "E.T. J.R.G.S" en la barra superior
        fontWeight: 'bold',
        fontSize: 14,
    },
    perfilBtn: { padding: 5 },

    // ─────────────────────────────────────────────────────────────────────────────
    // BANNER DE AÑO ACTIVO — tira horizontal que muestra el año seleccionado actualmente
    // ─────────────────────────────────────────────────────────────────────────────
    anoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Blanco puro — resalta sobre el fondo claro
        borderRadius: 16,
        borderWidth: 1,             // Bajado a 1 para un look más fino y elegante
        // borderColor se aplica dinámicamente con el pastel del año activo
        padding: 14,
        marginBottom: 20,
        gap: 12,
    },
    anoBadge: {
        width: 40, height: 40, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
        // backgroundColor se aplica dinámicamente con el pastel del año activo
    },
    anoLabel: {
        color: '#8A9BB0',           // Gris azulado — etiqueta "AÑO ACTIVO" en mayúsculas
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    anoValor: {
        fontSize: 18,
        fontWeight: '900',
        marginTop: 1,
        // color se aplica dinámicamente con el color oscuro del año activo (textColorPorAno)
    },
    cambiarBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 6,
        borderRadius: 10,
        // backgroundColor se aplica dinámicamente: pastel del año + '55' (transparencia ~33%)
    },
    cambiarText: {
        fontSize: 12,
        fontWeight: '800',
        // color se aplica dinámicamente con el color oscuro del año activo
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // MODAL SELECTOR DE AÑO — popup que aparece al tocar "Cambiar" en el banner
    // ─────────────────────────────────────────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(26, 26, 46, 0.4)', // Azul oscuro premium semitransparente — fondo armónico al abrir el selector
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#FFFFFF', // Blanco puro
        borderRadius: 24,
        padding: 20,
        width: '80%',
        borderWidth: 1,
        borderColor: '#E0E6ED',      // Gris sutil para los bordes del modal
    },
    modalTitle: {
        color: '#8A9BB0',            // Gris azulado — texto "Cambiar Año" en la cabecera
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 14,
        textAlign: 'center',
    },
    modalItem: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        padding: 14, borderRadius: 14, marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E8EDF2',      // Gris claro — estado no seleccionado más sutil
        // Cuando el ítem está seleccionado, borderColor y backgroundColor se sobreescriben dinámicamente
    },
    modalDot: {
        width: 10, height: 10, borderRadius: 5,
        // backgroundColor se aplica dinámicamente con el pastel del año correspondiente
    },
    modalItemText: {
        color: '#1A1A2E',            // Azul oscuro premium — texto de cada año en estado no seleccionado
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
        // Cuando está seleccionado, el color se sobreescribe con el color oscuro del año activo
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // ENCABEZADO DEL MENÚ — títulos debajo del banner de año
    // ─────────────────────────────────────────────────────────────────────────────
    header: { marginBottom: 20 },
    saludo: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1A1A2E',            // Azul oscuro premium — título "Panel de Control" con alto contraste
    },
    subtitulo: {
        fontSize: 15,
        color: '#8A9BB0',            // Gris azulado — subtítulo descriptivo del panel
        marginTop: 5,
    },
    grid: { gap: 12 },

    // ─────────────────────────────────────────────────────────────────────────────
    // BOTÓN GESTIÓN DE MATRÍCULA — solo visible para admin, fondo azul de marca
    // ─────────────────────────────────────────────────────────────────────────────
    btnAdmin: {
        backgroundColor: '#009EF7', // Azul Movistar — Reemplaza por completo el fondo dorado anterior
        padding: 20,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 4,
    },
    iconCircleAdmin: {
        width: 40, height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.25)', // Círculo blanco sutil semitransparente para que resalte el ícono sobre el azul
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    adminTextMain: {
        color: '#FFFFFF',            // Blanco puro — contraste perfecto sobre el nuevo botón azul principal
        fontSize: 18,
        fontWeight: 'bold',
    },
    adminTextSub: {
        color: 'rgba(255, 255, 255, 0.75)', // Blanco translúcido — subtexto claro y limpio para "Inscribir o editar alumnos"
        fontSize: 11,
        fontWeight: '600',
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // CARDS DE MENCIONES — tarjetas para Telemática, Turismo, Administración, Contabilidad
    // ─────────────────────────────────────────────────────────────────────────────
    cardContainer: {
        backgroundColor: '#FFFFFF', // Blanco puro
        borderRadius: 18,
        borderLeftWidth: 6,         // Mantiene el borde grueso dinámico según la mención
        borderWidth: 1,
        borderColor: '#E0E6ED',      // Gris sutil — reemplaza al azul celeste claro anterior
        marginBottom: 10,
        overflow: 'hidden',
    },
    cardMain: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfo: { flexDirection: 'row', alignItems: 'center' },
    iconMencion: {
        width: 40, height: 40, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginRight: 15,
        // backgroundColor se aplica dinámicamente: pastel de la mención + '44'
    },
    cardText: {
        color: '#1A1A2E',            // Azul oscuro premium — nombre de la mención con fuerte presencia visual
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSub: {
        color: '#8A9BB0',            // Gris azulado — subtexto descriptivo de las tarjetas
        fontSize: 11,
        marginTop: 2,
    },

    // Franja inferior de cada card con el acceso a estadísticas
    statsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#F7F9FC', // Gris/azul muy claro — fondo limpio e integrado con el layout general
        borderTopWidth: 1,
        borderColor: '#E8EDF2',      // Línea divisoria muy sutil
    },
    statsBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#009EF7',            // Azul Movistar — el botón de estadísticas ahora actúa como un link de marca activo
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // BOTÓN HISTORIAL DE ASISTENCIAS — al final del scroll
    // ─────────────────────────────────────────────────────────────────────────────
    btnHistorial: {
        backgroundColor: '#FFFFFF', // Blanco puro
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1.5,
        borderColor: '#009EF7',      // Azul Movistar — el borde ahora resalta con la identidad visual del proyecto
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btnHistorialText: {
        color: '#009EF7',            // Azul Movistar — texto en sintonía con el borde exterior
        fontWeight: '900',
        fontSize: 16,
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // BOTÓN CONTROL DE INASISTENCIAS — solo visible para admin, fondo rosado
    // ─────────────────────────────────────────────────────────────────────────────
    btnInasistencias: {
        backgroundColor: '#FFF5F5', // Rosa muy claro — se mantiene este fondo pastel de alerta suave
        padding: 20,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FFE2E2',      // Rosa claro un pelo más suave para los bordes
    },
    iconCircleInasistencias: {
        width: 40, height: 40,
        backgroundColor: '#FEE2E2', // Rosa suave para el círculo del ícono
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    inasistenciasTextMain: {
        color: '#FF3B30',            // Rojo vivo Movistar — nuevo tono exacto de la guía para el texto de errores/alertas
        fontSize: 18,
        fontWeight: 'bold',
    },
    inasistenciasTextSub: {
        color: '#8A9BB0',            // Gris azulado — subtexto descriptivo de las inasistencias
        fontSize: 11,
        fontWeight: '600',
    },
});
