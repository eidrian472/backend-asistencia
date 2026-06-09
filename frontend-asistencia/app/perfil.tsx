import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants';

export default function PerfilScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { usuario, rol } = useLocalSearchParams();
    const [docente, setDocente] = useState<any>(null);
    const [cargando, setCargando] = useState(true);

    const [avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        if (usuario) obtenerDatos();
        else setCargando(false);
    }, [usuario]);

    const obtenerDatos = async () => {
        try {
            const res = await axios.get(`${API_URL}/perfil/${usuario}`);
            if (res.data.success) setDocente(res.data.datos);
        } catch (e) {
            console.error("Error al obtener datos:", e);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#009EF7" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerNav}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#5A9FDE" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Avatar + Nombre */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        {avatarError ? (
                            <View style={[styles.avatar, styles.avatarFallback]}>
                                <Text style={styles.avatarInitials}>
                                    {(docente?.nombre?.[0] ?? 'U').toUpperCase()}{(docente?.apellido?.[0] ?? '').toUpperCase()}
                                </Text>
                            </View>
                        ) : (
                            <Image
                                source={{ uri: `https://ui-avatars.com/api/?name=${docente?.nombre || 'U'}+${docente?.apellido || ''}&background=5B9BD5&color=ffffff&bold=true&size=200` }}
                                style={styles.avatar}
                                onError={() => setAvatarError(true)}
                            />
                        )}
                        <View style={[
                            styles.rolBadge,
                            { backgroundColor: rol === 'admin' ? '#FF9500' : '#009EF7' }
                        ]}>
                            <Ionicons
                                name={rol === 'admin' ? 'shield-checkmark' : 'school'}
                                size={14}
                                color="#FFFFFF"
                            />
                        </View>
                    </View>
                    <Text style={styles.userName}>
                        {docente ? `${docente.nombre} ${docente.apellido}` : 'Usuario'}
                    </Text>
                    <Text style={styles.userHandle}>{usuario}</Text>
                    <View style={styles.nacionalidadRow}>
                        <Text style={styles.nacionalidadFlag}>
                            {docente?.nacionalidad === 'V' ? '🇻🇪' : docente?.nacionalidad === 'E' ? '🌍' : ''}
                        </Text>
                        <Text style={styles.nacionalidadText}>
                            {docente?.nacionalidad === 'V' ? 'Venezolano/a' : docente?.nacionalidad === 'E' ? 'Extranjero/a' : ''}
                        </Text>
                    </View>
                    <View style={[
                        styles.rolPill,
                        rol === 'admin'
                            ? { backgroundColor: '#FF950015', borderColor: '#FF950040' }
                            : { backgroundColor: '#009EF715', borderColor: '#009EF740' }
                    ]}>
                        <Text style={[
                            styles.rolPillText,
                            { color: rol === 'admin' ? '#FF9500' : '#009EF7' }
                        ]}>
                            {rol === 'admin' ? '🛡️ Administrador del Sistema' : '🎓 Docente de Aula'}
                        </Text>
                    </View>
                </View>

                {/* Tarjeta de información */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Información Personal</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="card-outline" size={18} color="#5A9FDE" />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Cédula</Text>
                            <Text style={styles.infoValue}>{docente?.cedula || '---'}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="book-outline" size={18} color="#5A9FDE" />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Materia</Text>
                            <Text style={styles.infoValue}>{docente?.materia || 'No especificada'}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="shield-outline" size={18} color="#5A9FDE" />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Rol en el sistema</Text>
                            <Text style={styles.infoValue}>
                                {rol === 'admin' ? 'Administrador' : 'Docente'}
                            </Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Botón Cerrar Sesión */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
                <View style={{ height: Math.max(40, insets.bottom) }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    loading: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerNav: {
        marginTop: 55,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1A1A2E',
    },
    scroll: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#009EF7',
    },
    avatarFallback: {
        backgroundColor: '#009EF7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '900',
    },
    rolBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF9500',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    userHandle: {
        fontSize: 14,
        color: '#8A9BB0',
        marginBottom: 8,
    },
    nacionalidadRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    nacionalidadFlag: { fontSize: 16 },
    nacionalidadText: {
        color: '#8A9BB0',
        fontSize: 13,
        fontWeight: '600',
    },
    rolPill: {
        backgroundColor: '#FF950015',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FF950040',
    },
    rolPillText: {
        color: '#FF9500',
        fontSize: 12,
        fontWeight: '700',
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    infoCardTitle: {
        color: '#8A9BB0',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 18,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingVertical: 4,
    },
    infoIconBox: {
        width: 38,
        height: 38,
        backgroundColor: '#EAF6FF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        color: '#8A9BB0',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    infoValue: {
        color: '#1A1A2E',
        fontSize: 15,
        fontWeight: '700',
    },
    separator: {
        height: 1,
        backgroundColor: '#E8EDF2',
        marginVertical: 14,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#E0E6ED',
        paddingTop: 15,
        paddingHorizontal: 20,
        backgroundColor: '#F7F9FC',
    },
    logoutBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FF3B3010',
        padding: 16,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FF3B3035',
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
