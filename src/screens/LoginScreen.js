import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes personalizados
import Input from '../components/Input';

// Configuración de diseño
const COLORS = {
  primary: '#3576E0',
  background: '#FFFFFF',
  textDark: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB'
};

export default function LoginScreen({ navigation }) {
  // Estado del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log("Login attempt:", { email, password });
    // Aquí iría la lógica de autenticación
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Header Visual */}
          <View style={styles.genericIcon} />
          <Text style={styles.textLogin}>Iniciar Sesión</Text>
          
          {/* Campos del Formulario */}
          <View style={styles.formContainer}>
            <Input 
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input 
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            
            <TouchableOpacity onPress={() => console.log("Navigate to Recovery")}>
              <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
            </TouchableOpacity>
          </View>
          
          {/* Botón Principal */}
          <TouchableOpacity 
            style={[styles.btnBase, styles.loginButton]} 
            onPress={handleLogin}
          >
            <Text style={styles.textLoginBtn}>Login</Text>
          </TouchableOpacity>

          {/* Divisor */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} /> 
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.line} />
          </View>

          {/* Botón Social */}
          <TouchableOpacity style={[styles.btnBase, styles.googleButton]}>
            <Image 
              source={require('../../assets/googleIcon.png')} 
              style={styles.googleIcon} 
            />
            <Text style={styles.googleText}>Continuar con Google</Text>
          </TouchableOpacity>
          
          {/* Footer de Registro */}
          <View style={styles.footerContainer}>
             <Text style={styles.linkText}>¿No tienes cuenta?</Text>
             <TouchableOpacity onPress={() => console.log("Navigate to Register")}>
                <Text style={[styles.linkText, styles.registerText]}> Regístrate</Text>
             </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  genericIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 30,
  },
  textLogin: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
    gap: 16, // Espaciado automático entre inputs
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: COLORS.textLight,
    fontWeight: '500',
    marginTop: 8,
  },
  // Botones Generales
  btnBase: {
    height: 56,
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    marginBottom: 24,
  }, 
  textLoginBtn: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Sección Divisor
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#9CA3AF',
    fontSize: 14,
  },
  // Botón Google
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12, // Mantiene icono y texto juntos
  },
  googleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  googleText: {
    fontWeight: '500',
    color: '#374151',
    fontSize: 16,
  },
  // Footer
  footerContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  linkText: {
    color: '#6B7280',
    fontSize: 14,
  },
  registerText: {
    color: COLORS.primary,
    fontWeight: '600',
  }
});