import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'

import Input from '../components/Input';
import { useTheme } from '../hooks/useTheme'; 
import { LoginService } from '../services/Login.service';

import * as Google from 'expo-auth-session/providers/google'

const GOOGLE_ID = process.env.EXPO_PUBLIC_GOOGLE_ID;

function isValidEmail(value) {
  // Simple y suficiente para UI
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).toLowerCase());
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { colors, isDark } = useTheme();

  const handleLogin = async () => {
    // limpiar error previo
    setErrorMessage('');

    const cleanEmail = email.trim();

    // Validaciones UI
    if (!cleanEmail || !password) {
      setErrorMessage('Por favor ingresa tu email y contraseña.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Ingresa un email válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await LoginService.login(cleanEmail, password);

      // Caso éxito (depende de tu servicio; me baso en tu back: response.status)
      if (response?.status) {
        // Aquí normalmente guardarías el token en almacenamiento seguro (luego te digo cómo)
        navigation.navigate('Enter');
        return;
      }

      // Caso: backend responde status false con message
      const msg = response?.message || 'Credenciales inválidas.';
      setErrorMessage(msg);

    } catch (err) {
      // Caso: axios/fetch lanza error
      // Intentamos extraer mensaje del server
      const serverMsg =
        err?.response?.data?.message ||
        err?.message ||
        'No se pudo iniciar sesión. Intenta de nuevo.';

      setErrorMessage(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('Forgot')
    // Alert.alert('Recuperación', 'Funcionalidad de recuperación en construcción.');
  };

  const [ request, response, prompAsync ] = Google.useAuthRequest({
    androidClientId: GOOGLE_ID,
    iosClientId: ''
  })

  const handleGooglePress = async () => {
    console.log(GOOGLE_ID)
    const responseG = await prompAsync()
    console.log(responseG)
    console.log(response)
    console.log(request)
    // Alert.alert('Próximamente', 'Inicio de sesión con Google estará disponible pronto.');
  };

  const googleDisabled = false;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.genericIcon, { backgroundColor: isDark ? '#374151' : '#EEF2FF' }]} />
          
          <Text style={[styles.textLogin, { color: colors.text }]}>Iniciar Sesión</Text>

          <View style={styles.formContainer}>
            <Input 
              placeholder="Email"
              value={email}
              onChangeText={(t) => setEmail(t)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <Input
              placeholder="Contraseña"
              value={password}
              onChangeText={(t) => { setPassword(t); }}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              autoComplete="password"
              textContentType="password"
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

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
            </TouchableOpacity>

            {!!errorMessage && (
              <View style={[styles.errorBox, { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }]}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={[
              styles.btnBase,
              styles.loginButton,
              { backgroundColor: colors.primary },
              isSubmitting && { opacity: 0.75 }
            ]}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.textLoginBtn}>Login</Text>
            )}
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
            onPress={handleGooglePress}
          >
            <Image 
              source={require('../../assets/googleIcon.png')} 
              style={styles.googleIcon} 
            />
            <Text style={[styles.googleText, { color: '#374151' }]}>
              Continuar con Google
            </Text>
          </TouchableOpacity>

          {googleDisabled && (
            <Text style={styles.helperText}>
              Google Sign-In estará disponible pronto.
            </Text>
          )}
          
          <View style={styles.footerContainer}>
            <Text style={styles.linkText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.linkText, { color: colors.primary, fontWeight: '600' }]}> Regístrate</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  genericIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 30,
  },
  textLogin: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 8,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  btnBase: {
    height: 56,
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loginButton: { marginBottom: 24 }, 
  textLoginBtn: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },

  line: {
    flex: 1,
    height: 1,
  },

  dividerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginHorizontal: 12,
  },

  dividerText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  googleButton: {
    borderWidth: 1,
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  googleText: {
    fontWeight: '500',
    fontSize: 16,
  },
  helperText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 13,
  },
  footerContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  linkText: {
    color: '#6B7280',
    fontSize: 14,
  }
});