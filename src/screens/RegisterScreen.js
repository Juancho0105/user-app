import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Input from '../components/Input';
import { useTheme } from '../hooks/useTheme';
import { LoginService } from '../services/Login.service';

function isValidEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).toLowerCase());
}

function hasNumber(value) {
  return /\d/.test(value);
}

export default function RegisterScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    terms: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleDisabled = true;

  const validate = () => {
    const errors = { firstName: '', lastName: '', email: '', password: '', terms: '' };

    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();

    if (!fn) errors.firstName = 'El nombre es obligatorio.';
    else if (fn.length < 2) errors.firstName = 'El nombre es muy corto.';

    if (!ln) errors.lastName = 'Los apellidos son obligatorios.';
    else if (ln.length < 2) errors.lastName = 'Los apellidos son muy cortos.';

    if (!em) errors.email = 'El email es obligatorio.';
    else if (!isValidEmail(em)) errors.email = 'Ingresa un email válido.';

    if (!password) errors.password = 'La contraseña es obligatoria.';
    else if (password.length < 8) errors.password = 'Mínimo 8 caracteres.';
    else if (!hasNumber(password)) errors.password = 'Incluye al menos un número.';

    if (!termsAccepted) errors.terms = 'Debes aceptar los términos y condiciones.';

    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const clearError = (key) => {
    if (fieldErrors[key]) setFieldErrors(prev => ({ ...prev, [key]: '' }));
    if (formError) setFormError('');
  };

  const handleTermsPress = () => {
    Alert.alert(
      'Términos y condiciones',
      'Aquí abrirías tu pantalla o webview de términos.\n\nPor ahora es un placeholder.'
    );
  };

  const handleRegister = async () => {
    setFormError('');

    const ok = validate();
    if (!ok) return;

    try {
      setIsSubmitting(true);

      const response = await LoginService.register(
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password
      );

      if (response?.status) {
        Alert.alert('Cuenta creada', 'Ya puedes iniciar sesión.');
        navigation.navigate('Login');
        return;
      }

      const msg = response?.message || 'No se pudo crear la cuenta.';
      if (msg.toLowerCase().includes('email')) {
        setFieldErrors(prev => ({ ...prev, email: msg }));
      } else {
        setFormError(msg);
      }
    } catch (err) {
      setFormError('Ocurrió un error de red. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { justifyContent: 'space-between' }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- TOP CONTENT --- */}
          <View style={styles.topContent}>
            <Text style={[styles.title, { color: colors.text }]}>Crear Cuenta</Text>
            <Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
              Completa tus datos para comenzar
            </Text>

            {!!formError && (
              <View style={styles.formErrorBox}>
                <Text style={styles.formErrorText}>{formError}</Text>
              </View>
            )}

            <View style={styles.formContainer}>
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    placeholder="Nombre"
                    value={firstName}
                    onChangeText={(t) => { setFirstName(t); clearError('firstName'); }}
                    autoCapitalize="words"
                    errorMessage={fieldErrors.firstName}
                    returnKeyType="next"
                    autoComplete="name"
                    textContentType="givenName"
                  />
                </View>

                <View style={{ width: 12 }} />

                <View style={styles.flex1}>
                  <Input
                    placeholder="Apellidos"
                    value={lastName}
                    onChangeText={(t) => { setLastName(t); clearError('lastName'); }}
                    autoCapitalize="words"
                    errorMessage={fieldErrors.lastName}
                    returnKeyType="next"
                    autoComplete="name"
                    textContentType="familyName"
                  />
                </View>
              </View>

              <Input
                placeholder="Email"
                value={email}
                onChangeText={(t) => { setEmail(t); clearError('email'); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                errorMessage={fieldErrors.email}
                returnKeyType="next"
                autoComplete="email"
                textContentType="emailAddress"
              />

              <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={(t) => { setPassword(t); clearError('password'); }}
                secureTextEntry={!showPassword}
                errorMessage={fieldErrors.password}
                returnKeyType="done"
                autoComplete="password-new"
                textContentType="newPassword"
                rightElement={
                  <TouchableOpacity
                    onPress={() => setShowPassword(v => !v)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                }
              />

              <Text style={styles.passwordHint}>
                Mínimo 8 caracteres y al menos 1 número.
              </Text>

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkboxBase,
                    { borderColor: fieldErrors.terms ? '#EF4444' : '#9CA3AF' },
                    termsAccepted && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => { setTermsAccepted(v => !v); clearError('terms'); }}
                  activeOpacity={0.9}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: termsAccepted }}
                  accessibilityLabel="Aceptar términos y condiciones"
                >
                  {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    Acepto los{' '}
                    <Text
                      style={{ color: colors.primary, fontWeight: '700' }}
                      onPress={handleTermsPress}
                    >
                      términos y condiciones
                    </Text>
                  </Text>

                  {!!fieldErrors.terms && <Text style={styles.termsError}>{fieldErrors.terms}</Text>}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.btnBase,
                styles.registerButton,
                { backgroundColor: colors.primary },
                isSubmitting && { opacity: 0.75 }
              ]}
              onPress={handleRegister}
              disabled={isSubmitting}
              activeOpacity={0.9}
            >
              {isSubmitting ? <ActivityIndicator /> : <Text style={styles.textBtn}>Registrarme</Text>}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />

              <View style={[styles.dividerBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.dividerText, { color: colors.text, opacity: 0.2 }]}>
                  o
                </Text>
              </View>

              <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>

            <TouchableOpacity
              style={[
                styles.btnBase,
                styles.googleButton,
                { borderColor: colors.border, backgroundColor: '#fff' },
                googleDisabled && { opacity: 0.55 }
              ]}
              disabled={googleDisabled}
              onPress={() => Alert.alert('Próximamente', 'Registro con Google estará disponible pronto.')}
              activeOpacity={0.9}
            >
              <Image source={require('../../assets/googleIcon.png')} style={styles.googleIcon} />
              <Text style={[styles.googleText, { color: '#374151' }]}>Continuar con Google</Text>
            </TouchableOpacity>

            {googleDisabled && <Text style={styles.helperText}>Google estará disponible pronto.</Text>}
          </View>

          {/* --- FOOTER (ALWAYS BOTTOM) --- */}
          <View style={styles.footerContainer}>
            <Text style={styles.linkText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
              <Text style={[styles.linkText, { color: colors.primary, fontWeight: '700' }]}> Inicia sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // IMPORTANTE: sin alignItems global para no “centrar todo” y romper layout
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },

  topContent: {
    width: '100%',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    alignSelf: 'flex-start',
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
    alignSelf: 'flex-start',
  },

  formErrorBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  formErrorText: { color: '#B91C1C', fontWeight: '700' },

  formContainer: { width: '100%', gap: 16, marginBottom: 18 },
  row: { flexDirection: 'row', width: '100%' },
  flex1: { flex: 1 },

  passwordHint: {
    marginTop: -6,
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 13,
  },

  termsContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 },
  checkboxBase: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10, marginTop: 2,
  },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  termsTextContainer: { flex: 1 },
  termsText: { fontSize: 14, color: '#6B7280' },
  termsError: { marginTop: 6, color: '#EF4444', fontSize: 13, fontWeight: '600' },

  btnBase: {
    height: 56,
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  registerButton: { marginBottom: 18 },
  textBtn: { color: '#fff', fontWeight: '600', fontSize: 16 },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  line: { flex: 1, height: 1 },
  dividerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginHorizontal: 12,
  },
  dividerText: { fontSize: 14, fontWeight: '700', letterSpacing: 1 },

  googleButton: { borderWidth: 1, gap: 12 },
  googleIcon: { width: 24, height: 24, resizeMode: 'contain' },
  googleText: { fontWeight: '500', fontSize: 16 },
  helperText: { marginTop: 10, color: '#6B7280', fontSize: 13 },

  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  linkText: { color: '#6B7280', fontSize: 14 },
});
