import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants';

// Campos obligatorios y sus etiquetas legibles
const CAMPOS_REQUERIDOS: { key: string; label: string }[] = [
    { key: 'nombre',       label: 'Nombre del estudiante'      },
    { key: 'apellido',     label: 'Apellido del estudiante'    },
    { key: 'cedula',       label: 'Cédula del estudiante'      },
    { key: 'rep_nombre',   label: 'Nombre del representante'   },
    { key: 'rep_apellido', label: 'Apellido del representante' },
    { key: 'rep_cedula',   label: 'Cédula del representante'   },
    { key: 'rep_telefono', label: 'Teléfono del representante' },
    { key: 'direccion',    label: 'Dirección de vivienda'      },
];

type TipoCedula = 'V' | 'E';

type FormState = {
    nombre: string;
    apellido: string;
    cedula: string;
    mencion: string;
    ano: string;
    rep_nombre: string;
    rep_apellido: string;
    rep_cedula: string;
    rep_telefono: string;
    direccion: string;
};

type Errores = Partial<Record<keyof FormState, string>>;

const FORM_VACIO: FormState = {
    nombre: '',
    apellido: '',
    cedula: '',
    mencion: 'Telemática',
    ano: '1',
    rep_nombre: '',
    rep_apellido: '',
    rep_cedula: '',
    rep_telefono: '',
    direccion: '',
};

// ── CampoTexto definido FUERA del componente para evitar que React lo
// recree en cada render y pierda el foco del teclado letra por letra ──────────
type CampoTextoProps = {
    campo: keyof FormState;
    placeholder: string;
    keyboardType?: any;
    multiline?: boolean;
    value: string;
    error?: string;
    onChange: (campo: keyof FormState, valor: string) => void;
};

const CampoTexto = ({
    campo, placeholder, keyboardType = 'default',
    multiline = false, value, error, onChange,
}: CampoTextoProps) => (
    <View style={styles.campoWrapper}>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={error ? '#EF444488' : '#475569'}
            style={[
                styles.input,
                !!error && styles.inputError,
                multiline && { minHeight: 70, textAlignVertical: 'top' },
            ]}
            keyboardType={keyboardType}
            multiline={multiline}
            onChangeText={t => onChange(campo, t)}
            value={value}
        />
        {!!error && (
            <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={13} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        )}
    </View>
);
// ─────────────────────────────────────────────────────────────────────────────

export default function GestionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [form, setForm] = useState<FormState>(FORM_VACIO);
    const [errores, setErrores] = useState<Errores>({});
    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [cedulaBorrar, setCedulaBorrar] = useState('');
    const [cedulaTipoEst, setCedulaTipoEst] = useState<TipoCedula>('V');
    const [cedulaTipoRep, setCedulaTipoRep] = useState<TipoCedula>('V');

    // ── Validación de rango para cédulas venezolanas ──────────────────────────
    const validarRangoCedula = (val: string, tipo: TipoCedula): string | null => {
        if (tipo !== 'V') return null; // extranjeros no tienen rango fijo
        const n = parseInt(val, 10);
        if (n < 1000000)  return 'La cédula venezolana debe ser mayor a 1.000.000';
        if (n > 80000000) return 'La cédula venezolana no puede superar 80.000.000';
        return null;
    };

    // ── Validación ────────────────────────────────────────────────────────────
    const validar = (): Errores => {
        const nuevosErrores: Errores = {};
        CAMPOS_REQUERIDOS.forEach(({ key, label }) => {
            if (!form[key as keyof FormState].trim()) {
                nuevosErrores[key as keyof FormState] = `${label} es obligatorio`;
            }
        });

        // Cédula del estudiante
        const cedVal = form.cedula.trim();
        if (cedVal && !/^\d+$/.test(cedVal)) {
            nuevosErrores.cedula = 'La cédula debe contener solo números';
        } else if (cedVal && cedulaTipoEst === 'V' && cedVal.length !== 8) {
            nuevosErrores.cedula = 'La cédula venezolana debe tener exactamente 8 dígitos';
        } else if (cedVal && cedulaTipoEst === 'E' && (cedVal.length < 6 || cedVal.length > 12)) {
            nuevosErrores.cedula = 'La cédula extranjera debe tener entre 6 y 12 dígitos';
        } else if (cedVal) {
            const rangoErr = validarRangoCedula(cedVal, cedulaTipoEst);
            if (rangoErr) nuevosErrores.cedula = rangoErr;
        }

        // Cédula del representante
        const repVal = form.rep_cedula.trim();
        if (repVal && !/^\d+$/.test(repVal)) {
            nuevosErrores.rep_cedula = 'La cédula debe contener solo números';
        } else if (repVal && cedulaTipoRep === 'V' && repVal.length !== 8) {
            nuevosErrores.rep_cedula = 'La cédula venezolana debe tener exactamente 8 dígitos';
        } else if (repVal && cedulaTipoRep === 'E' && (repVal.length < 6 || repVal.length > 12)) {
            nuevosErrores.rep_cedula = 'La cédula extranjera debe tener entre 6 y 12 dígitos';
        } else if (repVal) {
            const rangoErr = validarRangoCedula(repVal, cedulaTipoRep);
            if (rangoErr) nuevosErrores.rep_cedula = rangoErr;
        }

        // Validar que el estudiante y su representante no tengan la misma cédula
        if (cedVal && repVal && !nuevosErrores.cedula && !nuevosErrores.rep_cedula) {
            if (cedulaTipoEst === cedulaTipoRep && cedVal === repVal) {
                nuevosErrores.rep_cedula = `La cédula del representante (${cedulaTipoRep}-${repVal}) no puede ser igual a la del estudiante`;
            }
        }

        return nuevosErrores;
    };

    // Limpiar error de un campo cuando el usuario empieza a escribir
    // Los campos de nombre/apellido se convierten automáticamente a mayúsculas
    const CAMPOS_MAYUS: (keyof FormState)[] = ['nombre', 'apellido', 'rep_nombre', 'rep_apellido'];
    const actualizarCampo = (key: keyof FormState, valor: string) => {
        const valorFinal = CAMPOS_MAYUS.includes(key) ? valor.toUpperCase() : valor;
        setForm(prev => ({ ...prev, [key]: valorFinal }));
        if (intentoGuardar && errores[key]) {
            setErrores(prev => {
                const copia = { ...prev };
                delete copia[key];
                return copia;
            });
        }
    };

    const [ultimoGuardado, setUltimoGuardado] = useState<string | null>(null);

    const guardarEstudiante = async () => {
        setIntentoGuardar(true);
        const nuevosErrores = validar();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }
        setErrores({});

        // Convertir el número de año (ej. '1') al nombre de grado que tiene la DB (ej. '1er Año')
        const gradoMapUI: Record<string, string> = {
            '1': '1er Año', '2': '2do Año', '3': '3er Año',
            '4': '4to Año', '5': '5to Año', '6': '6to Año',
        };
        const anoNombre = gradoMapUI[form.ano] || form.ano;

        try {
            const res = await axios.post(`${API_URL}/admin/estudiantes`, {
                nombre:              form.nombre.trim(),
                apellido:            form.apellido.trim(),
                cedula:              `${cedulaTipoEst}-${form.cedula.trim()}`,   // ej. "V-12345678"
                mencion:             form.mencion,
                ano:                 anoNombre,
                rep_nombre:          form.rep_nombre.trim(),
                rep_apellido:        form.rep_apellido.trim(),
                rep_cedula:          form.rep_cedula.trim(),
                rep_nacionalidad_id: cedulaTipoRep === 'V' ? 1 : 2,              // 1=venezolano, 2=extranjero
                rep_telefono:        form.rep_telefono.trim(),
                direccion:           form.direccion.trim(),
            });
            if (res.data.success) {
                const nombreCompleto = `${form.nombre.trim()} ${form.apellido.trim()}`;
                setUltimoGuardado(`✅ ${nombreCompleto} inscrito correctamente — Nro. ${res.data.nro_lista}`);
                setForm(FORM_VACIO);
                setCedulaTipoEst('V');
                setCedulaTipoRep('V');
                setIntentoGuardar(false);
            } else {
                Alert.alert('Error', res.data.error || 'No se pudo guardar.');
            }
        } catch (e: any) {
            const msg = e?.response?.data?.error || 'No se pudo conectar al servidor.';
            Alert.alert('Error de red', msg);
        }
    };

    // ── Eliminación ───────────────────────────────────────────────────────────
    const confirmarEliminacion = async () => {
        const cedula = cedulaBorrar.trim();

        // Validar que el campo no esté vacío
        if (!cedula) {
            Alert.alert('Campo vacío', 'Ingresa la cédula del estudiante a eliminar.');
            return;
        }

        // Validar que sea solo números y tenga 8 dígitos
        if (!/^\d{8}$/.test(cedula)) {
            Alert.alert(
                'Cédula inválida',
                'La cédula debe tener exactamente 8 dígitos numéricos.\nEjemplo: 25678901\n\n(Sin letras ni guiones — solo el número).'
            );
            return;
        }

        try {
            const info = await axios.get(`${API_URL}/admin/estudiantes/${cedula}`);
            if (info.data.success) {
                const est = info.data.estudiante;
                Alert.alert(
                    '⚠️ ¿Eliminar Estudiante?',
                    `Verifica que sea el estudiante correcto antes de continuar:\n\n` +
                    `👤 Nombre:          ${est.nombre} ${est.apellido}\n` +
                    `🪪 Cédula:           ${est.cedula}\n` +
                    `📚 Año:              ${est.ano}\n` +
                    `🏫 Mención:         ${est.mencion}\n\n` +
                    `─────────────────────────\n` +
                    `👨‍👩‍👦 Representante:  ${est.rep_nombre} ${est.rep_apellido}\n` +
                    `🪪 C.I. Rep.:         ${est.rep_cedula}\n` +
                    `📞 Teléfono:        ${est.rep_telefono}\n` +
                    `🏠 Dirección:       ${est.direccion}\n\n` +
                    `⚠️ Esta acción no se puede deshacer fácilmente.`,
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                            text: 'SÍ, ELIMINAR',
                            style: 'destructive',
                            onPress: () => borrarRealmente(est),
                        },
                    ]
                );
            } else {
                // Limpiar el campo para que el admin no confunda y busque de nuevo
                setCedulaBorrar('');
                Alert.alert('No encontrado', 'No existe ningún estudiante con esa cédula.\n\nEl campo fue limpiado para que puedas ingresar otra cédula.');
            }
        } catch {
            Alert.alert(
                'Error de red',
                'No se pudo conectar con el servidor al buscar el estudiante.\nVerifica tu conexión e inténtalo de nuevo.'
            );
        }
    };

    const borrarRealmente = async (est: any) => {
        try {
            const res = await axios.delete(`${API_URL}/admin/estudiantes/${cedulaBorrar}`);
            if (res.data.success) {
                Alert.alert(
                    '✅ Eliminado',
                    `${est.nombre} ${est.apellido} fue eliminado correctamente.`
                );
                setCedulaBorrar('');
            } else {
                Alert.alert('Error', res.data.error || 'No se pudo eliminar.');
            }
        } catch {
            Alert.alert('Error', 'No se pudo conectar al servidor.');
        }
    };

    const cantidadErrores = Object.keys(errores).length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                    <Ionicons name="arrow-back" size={24} color="#38BDF8" />
                </TouchableOpacity>
                <Text style={styles.titulo}>Administrar Matrícula</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Inscripción de Alumnos</Text>

                {/* Banner de errores resumen */}
                {intentoGuardar && cantidadErrores > 0 && (
                    <View style={styles.errorBanner}>
                        <Ionicons name="warning" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text style={styles.errorBannerText}>
                            {cantidadErrores === 1
                                ? '1 campo obligatorio sin completar'
                                : `${cantidadErrores} campos obligatorios sin completar`}
                        </Text>
                    </View>
                )}

                {/* Año */}
                <Text style={styles.label}>Año de Estudio:</Text>
                <View style={styles.row}>
                    {['1', '2', '3', '4', '5', '6'].map(a => (
                        <TouchableOpacity
                            key={a}
                            onPress={() => actualizarCampo('ano', a)}
                            style={[styles.miniTab, form.ano === a && styles.miniTabA]}
                        >
                            <Text style={{ color: form.ano === a ? '#020617' : '#94A3B8', fontWeight: 'bold' }}>{a}°</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Mención */}
                <Text style={styles.label}>Mención:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                    {['Telemática', 'Turismo', 'Administración', 'Contabilidad'].map(m => (
                        <TouchableOpacity
                            key={m}
                            onPress={() => actualizarCampo('mencion', m)}
                            style={[styles.mTab, form.mencion === m && styles.mTabA]}
                        >
                            <Text style={{ color: form.mencion === m ? '#020617' : '#94A3B8', fontSize: 12, fontWeight: 'bold' }}>{m}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ── Datos del estudiante ── */}
                <Text style={styles.seccionLabel}>DATOS DEL ESTUDIANTE</Text>
                <CampoTexto campo="nombre"   placeholder="Nombre"   value={form.nombre}   error={errores.nombre}   onChange={actualizarCampo} />
                <CampoTexto campo="apellido" placeholder="Apellido" value={form.apellido} error={errores.apellido} onChange={actualizarCampo} />

                {/* Tipo de cédula + campo — estudiante */}
                <View style={styles.cedulaRow}>
                    {(['V', 'E'] as TipoCedula[]).map(t => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setCedulaTipoEst(t)}
                            style={[styles.tipoBtn, cedulaTipoEst === t && styles.tipoBtnA]}
                        >
                            <Text style={[styles.tipoBtnTxt, cedulaTipoEst === t && styles.tipoBtnTxtA]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={{ flex: 1 }}>
                        <CampoTexto campo="cedula" placeholder="Cédula" value={form.cedula} error={errores.cedula} onChange={actualizarCampo} keyboardType="numeric" />
                    </View>
                </View>

                {/* ── Datos del representante ── */}
                <Text style={[styles.seccionLabel, { marginTop: 6 }]}>DATOS DEL REPRESENTANTE</Text>
                <CampoTexto campo="rep_nombre"   placeholder="Nombre del Representante"   value={form.rep_nombre}   error={errores.rep_nombre}   onChange={actualizarCampo} />
                <CampoTexto campo="rep_apellido" placeholder="Apellido del Representante" value={form.rep_apellido} error={errores.rep_apellido} onChange={actualizarCampo} />

                {/* Tipo de cédula + campo — representante */}
                <View style={styles.cedulaRow}>
                    {(['V', 'E'] as TipoCedula[]).map(t => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setCedulaTipoRep(t)}
                            style={[styles.tipoBtn, cedulaTipoRep === t && styles.tipoBtnA]}
                        >
                            <Text style={[styles.tipoBtnTxt, cedulaTipoRep === t && styles.tipoBtnTxtA]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={{ flex: 1 }}>
                        <CampoTexto campo="rep_cedula" placeholder="Cédula del Representante" value={form.rep_cedula} error={errores.rep_cedula} onChange={actualizarCampo} keyboardType="numeric" />
                    </View>
                </View>
                <CampoTexto campo="rep_telefono" placeholder="Teléfono del Representante" value={form.rep_telefono} error={errores.rep_telefono} onChange={actualizarCampo} keyboardType="phone-pad" />
                <CampoTexto campo="direccion"    placeholder="Dirección de Vivienda"       value={form.direccion}    error={errores.direccion}    onChange={actualizarCampo} multiline />

                {/* Banner de éxito visible tras guardar — persiste hasta el próximo intento */}
                {ultimoGuardado ? (
                    <View style={styles.bannerExito}>
                        <Text style={styles.bannerExitoText}>{ultimoGuardado}</Text>
                        <TouchableOpacity onPress={() => setUltimoGuardado(null)}>
                            <Ionicons name="close-circle-outline" size={18} color="#065F46" />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TouchableOpacity style={styles.btnG} onPress={guardarEstudiante}>
                    <Ionicons name="save-outline" size={18} color="#020617" style={{ marginRight: 8 }} />
                    <Text style={styles.btnText}>GUARDAR ESTUDIANTE</Text>
                </TouchableOpacity>
            </View>

            {/* ── Baja de estudiante ── */}
            <View style={[styles.card, { marginTop: 20, borderColor: '#7F1D1D' }]}>
                <Text style={[styles.cardTitle, { color: '#EF4444' }]}>Baja de Estudiante</Text>
                <TextInput
                    placeholder="Cédula a buscar"
                    placeholderTextColor="#475569"
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={setCedulaBorrar}
                    value={cedulaBorrar}
                />
                <TouchableOpacity style={styles.btnB} onPress={confirmarEliminacion}>
                    <Ionicons name="search" size={20} color="#FFF" style={{ marginRight: 10 }} />
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>BUSCAR Y ELIMINAR</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Fondo principal de toda la pantalla — Gris/azul muy claro (entorno claro de lectura)
    container: { 
        flex: 1, 
        backgroundColor: '#F7F9FC', 
        padding: 20 
    },

    header: { 
        marginTop: 50, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20 
    },
    // Fondo del botón de retroceso (flecha ←) en el header — Azul muy claro Movistar
    back: { 
        padding: 10, 
        backgroundColor: '#EAF6FF', 
        borderRadius: 12, 
        marginRight: 15 
    },
    // Nota: El componente Ionicons de la flecha dentro de este botón debe usar color: '#009EF7'

    // Color del título "Administrar Matrícula" — Azul muy oscuro para alta legibilidad
    titulo: { 
        fontSize: 22, 
        color: '#1A1A2E', 
        fontWeight: '900' 
    },

    // Fondo de cada card (formulario de inscripción) — Blanco puro con borde gris sutil
    // IMPORTANTE: En tu JSX, la card de "Baja de Estudiante" debe sobreescribir el borderColor con '#FF3B30' (Rojo Alerta) inline
    card: { 
        backgroundColor: '#FFFFFF', 
        padding: 20, 
        borderRadius: 25, 
        borderWidth: 1, 
        borderColor: '#E0E6ED' 
    },
    // Color del título de cada card (ej. "Inscripción de Alumnos") — Azul Movistar principal
    // IMPORTANTE: En tu JSX, la card de "Baja de Estudiante" debe sobreescribir este color con '#FF3B30' inline
    cardTitle: { 
        color: '#009EF7', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 15 
    },

    // Color de las etiquetas simples "Año de Estudio:" y "Mención:" — Gris de apoyo Movistar
    label: { 
        color: '#8A9BB0', 
        fontSize: 11, 
        fontWeight: 'bold', 
        marginBottom: 8 
    },
    // Color de las etiquetas de sección en mayúsculas "DATOS DEL ESTUDIANTE" — Gris de apoyo Movistar
    seccionLabel: {
        color: '#8A9BB0',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 4,
    },

    row: { flexDirection: 'row', gap: 8, marginBottom: 15 },
    
    // Fondo de cada botón de año (1°–6°) inactivo — Gris suave neutro
    miniTab: { 
        width: 40, 
        height: 40, 
        borderRadius: 10, 
        backgroundColor: '#F2F4F7', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    // Fondo del botón de año activo/seleccionado — Azul Movistar principal
    // Nota JSX: El texto del número activo debe pasar a '#FFFFFF' inline para contraste
    miniTabA: { 
        backgroundColor: '#009EF7' 
    },
    
    // Fondo de cada botón de mención inactivo — Gris suave neutro
    mTab: { 
        padding: 12, 
        borderRadius: 12, 
        backgroundColor: '#F2F4F7', 
        marginRight: 8 
    },
    // Fondo del botón de mención activo/seleccionado — Azul Movistar principal
    // Nota JSX: El texto de la mención activa debe pasar a '#FFFFFF' inline para contraste
    mTabA: { 
        backgroundColor: '#009EF7' 
    },

    // Campo con wrapper para mensaje de error
    campoWrapper: { marginBottom: 4 },

    // ─── Selector de tipo de cédula (V / E) ─────────────────────────────────
    // Fila que contiene los botones V/E + el TextInput de cédula
    cedulaRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 4,
    },
    // Botón V o E — inactivo: fondo gris suave neutro
    tipoBtn: {
        width: 44,
        height: 52,
        borderRadius: 12,
        backgroundColor: '#F2F4F7',
        borderWidth: 1.5,
        borderColor: '#E0E6ED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Botón V o E — activo: fondo Azul Movistar
    tipoBtnA: {
        backgroundColor: '#009EF7',
        borderColor: '#009EF7',
    },
    // Texto del botón inactivo — Gris de apoyo Movistar
    tipoBtnTxt: {
        color: '#8A9BB0',
        fontSize: 14,
        fontWeight: '800',
    },
    // Texto del botón activo — Blanco puro
    tipoBtnTxtA: {
        color: '#FFFFFF',
    },
    
    // Fondo del campo de texto (input) en estado normal — Gris suave neutro con borde sutil
    // Color del texto escrito en el input — Azul muy oscuro
    // Nota JSX: Modifica placeholderTextColor inline a: '#8A9BB0' (normal) y '#FF3B3088' (cuando hay error)
    input: {
        backgroundColor: '#F2F4F7',
        color: '#1A1A2E',
        padding: 15,
        borderRadius: 12,
        marginBottom: 4,
        borderWidth: 1.5,
        borderColor: '#E0E6ED',
    },
    // Fondo del input cuando hay error — Rojo Alerta Movistar al 6% de opacidad con borde rojo puro
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FF3B3010',
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 8,
        marginLeft: 4,
    },
    // Color del texto del mensaje de error — Rojo Alerta Movistar
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        fontWeight: '600',
    },

    // Banner resumen de errores superiores
    // Fondo del banner — Rojo Alerta al 6% de opacidad con borde Rojo Alerta puro
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B3010',
        borderWidth: 1,
        borderColor: '#FF3B30',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    // Color del texto dentro del banner de errores — Rojo Alerta Movistar
    errorBannerText: {
        color: '#FF3B30',
        fontWeight: '#700',
        fontSize: 13,
        flex: 1,
    },

    // Botón "GUARDAR ESTUDIANTE" — Fondo Azul Movistar principal
    btnG: {
        backgroundColor: '#009EF7',
        padding: 18,
        borderRadius: 15,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    // Botón "BUSCAR Y ELIMINAR" en la card de baja — Fondo Rojo Alerta Movistar
    btnB: {
        backgroundColor: '#FF3B30',
        padding: 18,
        borderRadius: 15,
        marginTop: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    // Color del texto de los botones principales — Blanco puro (alto contraste)
    btnText: { 
        color: '#FFFFFF', 
        fontWeight: '900' 
    },
    bannerExito: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#D1FAE5',
        borderColor: '#10B981',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        gap: 8,
    },
    bannerExitoText: {
        flex: 1,
        color: '#065F46',
        fontWeight: '700',
        fontSize: 13,
    },
});