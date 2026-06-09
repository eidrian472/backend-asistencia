import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Pressable,
    ScrollView,
    Modal,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;

interface SidebarProps {
    visible: boolean;
    onClose: () => void;
    rol: string;
    usuario: string;
    menciones_permitidas?: string;
    materia?: string;
    anoFiltro?: string;
}

interface NavItem {
    label: string;
    sublabel: string;
    icon: string;
    color: string;
    roles: string[];
    action: () => void;
}

export default function Sidebar({
    visible,
    onClose,
    rol,
    usuario,
    menciones_permitidas = '',
    materia = '',
    anoFiltro = '',
}: SidebarProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 22,
                    stiffness: 200,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(translateX, {
                    toValue: -SIDEBAR_WIDTH,
                    useNativeDriver: true,
                    damping: 22,
                    stiffness: 200,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const nav = (path: string, params?: Record<string, string>) => {
        onClose();
        setTimeout(() => {
            router.push({ pathname: path as any, params });
        }, 180);
    };

    const navItems: NavItem[] = [
        {
            label: 'Inicio',
            sublabel: 'Seleccionar año',
            icon: 'home',
            color: '#38BDF8',
            roles: ['admin', 'docente', 'docente_manana', 'docente_tarde'],
            action: () => nav('/ano', { rol, usuario, menciones_permitidas, materia }),
        },
        {
            label: 'Pasar Lista',
            sublabel: 'Registrar asistencia',
            icon: 'checkbox',
            color: '#10B981',
            roles: ['admin', 'docente', 'docente_manana', 'docente_tarde'],
            action: () => nav('/menu', { rol, usuario, anoFiltro, menciones_permitidas, materia }),
        },
        {
            label: 'Historial',
            sublabel: 'Asistencias por fecha',
            icon: 'calendar',
            color: '#818CF8',
            roles: ['admin', 'docente', 'docente_manana', 'docente_tarde'],
            action: () => nav('/historial', { rol, menciones_permitidas }),
        },
        {
            label: 'Inasistencias',
            sublabel: 'Control de ausencias',
            icon: 'alert-circle',
            color: '#EF4444',
            roles: ['admin'],
            action: () => nav('/inasistencias'),
        },
        {
            label: 'Docentes',
            sublabel: 'Asistencia del personal',
            icon: 'people',
            color: '#F59E0B',
            roles: ['admin'],
            action: () => nav('/asistencia-docentes', { usuario }),
        },
        {
            label: 'Matrícula',
            sublabel: 'Gestión de estudiantes',
            icon: 'person-add',
            color: '#38BDF8',
            roles: ['admin'],
            action: () => nav('/gestion'),
        },
        {
            label: 'Mi Perfil',
            sublabel: 'Información personal',
            icon: 'person-circle',
            color: '#94A3B8',
            roles: ['admin', 'docente', 'docente_manana', 'docente_tarde'],
            action: () => nav('/perfil', { usuario, rol }),
        },
    ];

    const itemsVisibles = navItems.filter(item => item.roles.includes(rol));

    const rolLabel: Record<string, string> = {
        admin: 'Administrador',
        docente: 'Docente',
        docente_manana: 'Turno Mañana',
        docente_tarde: 'Turno Tarde',
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.root}>
                {/* Overlay oscuro */}
                <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                </Animated.View>

                {/* Panel lateral */}
                <Animated.View
                    style={[
                        styles.sidebar,
                        {
                            transform: [{ translateX }],
                            paddingTop: insets.top + 16,
                            paddingBottom: insets.bottom + 20,
                        },
                    ]}
                >
                    {/* Cabecera */}
                    <View style={styles.sidebarHeader}>
                        <View style={styles.logoBox}>
                            <Ionicons name="school" size={22} color="#020617" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.logoText}>E.T. J.R.G.S</Text>
                            <Text style={styles.rolText}>{rolLabel[rol] ?? rol}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={22} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* Usuario */}
                    <View style={styles.userBox}>
                        <View style={styles.avatarSmall}>
                            <Text style={styles.avatarLetter}>
                                {usuario ? usuario.charAt(0).toUpperCase() : '?'}
                            </Text>
                        </View>
                        <Text style={styles.usuarioText} numberOfLines={1}>{usuario}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Items de navegación */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.navList}
                    >
                        {itemsVisibles.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.navItem}
                                onPress={item.action}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.navIcon, { backgroundColor: item.color + '20' }]}>
                                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.navLabel}>{item.label}</Text>
                                    <Text style={styles.navSub}>{item.sublabel}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#334155" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.divider} />

                    {/* Cerrar sesión */}
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={() => {
                            onClose();
                            setTimeout(() => router.replace('/'), 180);
                        }}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

// Botón hamburguesa reutilizable
export function MenuButton({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} style={menuBtnStyles.btn}>
            <View style={menuBtnStyles.line} />
            <View style={[menuBtnStyles.line, { width: 14 }]} />
            <View style={menuBtnStyles.line} />
        </TouchableOpacity>
    );
}

const menuBtnStyles = StyleSheet.create({
    // Botón de hamburguesa para abrir el menú
    btn: {
        width: 40,
        height: 40,
        backgroundColor: '#F2F4F7', // Fondo gris neutro suave
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: '#E0E6ED', // Borde sutil estructurado
    },
    // Líneas del ícono de hamburguesa
    line: {
        width: 18,
        height: 2,
        backgroundColor: '#009EF7', // Azul oficial Movistar
        borderRadius: 2,
    },
});

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    // Capa oscura de fondo al abrir el menú lateral
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Sombra de fondo ligeramente más suave para entornos claros
    },
    // Contenedor principal del Sidebar
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: '#FFFFFF', // Fondo blanco puro premium
        borderRightWidth: 1,
        borderRightColor: '#E0E6ED', // Borde lateral sutil
        paddingHorizontal: 18,
        shadowColor: '#1A1A2E', // Sombra basada en la nueva paleta oscura
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    sidebarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        marginTop: 50, // Margen superior añadido para salvar el notch/status bar de forma limpia
    },
    // Caja contenedora del logo (E.T. J.R.G.S)
    logoBox: {
        width: 40,
        height: 40,
        backgroundColor: '#EAF6FF', // Azul claro traslúcido de marca
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#009EF7', // Borde en azul insignia
    },
    logoText: {
        color: '#009EF7', // Texto del logo en azul Movistar
        fontSize: 14,
        fontWeight: '900',
    },
    // Texto del rol (ej: "Administrador" o "Docente")
    rolText: {
        color: '#8A9BB0', // Gris de apoyo Movistar
        fontSize: 11,
        fontWeight: '600',
        marginTop: 1,
    },
    closeBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Ficha contenedora de los datos rápidos del usuario conectado
    userBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#F2F4F7', // Fondo gris neutro de lectura
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    avatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EAF6FF', 
        borderWidth: 1,
        borderColor: '#009EF7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarLetter: {
        color: '#009EF7',
        fontSize: 14,
        fontWeight: '900',
    },
    usuarioText: {
        color: '#1A1A2E', // Texto del nombre en azul oscuro de alta densidad
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    // Separadores horizontales del menú
    divider: {
        height: 1,
        backgroundColor: '#E8EDF2', // Borde suave de división
        marginVertical: 10,
    },
    navList: {
        gap: 4,
        paddingVertical: 4,
    },
    // Elemento base de la lista de navegación
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    navIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Nombre de la sección del menú
    navLabel: {
        color: '#1A1A2E', // Texto oscuro para lectura perfecta
        fontSize: 15,
        fontWeight: '700',
    },
    // Descripción corta debajo del nombre de la sección
    navSub: {
        color: '#8A9BB0', // Gris de apoyo Movistar
        fontSize: 11,
        fontWeight: '500',
        marginTop: 1,
    },
    // Botón de salida
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#FFF5F5', // Rojo traslúcido suave de advertencia
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        color: '#FF3B30', // Rojo de estado vibrante de la marca
        fontWeight: '700',
        fontSize: 14,
    },
});