// ForgotPasswordScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Input from "../components/Input";
import { useTheme } from "../hooks/useTheme";

// Ajusta esto a tu servicio real (ej: AuthService.forgotPassword(email))
/*
import { AuthService } from "../services/Auth.service";
*/

function isValidEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).toLowerCase());
}

export default function ForgotPasswordScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanEmail = useMemo(() => email.trim(), [email]);

  const handleSend = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!cleanEmail) {
      setErrorMessage("Por favor ingresa tu email.");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setErrorMessage("Ingresa un email válido.");
      return;
    }

    try {
      setIsSubmitting(true);

      // ✅ Reemplaza este bloque por tu llamada real al backend:
      // const res = await AuthService.forgotPassword(cleanEmail);
      // if (!res?.status) throw new Error(res?.message || "No se pudo enviar el correo.");
      await new Promise((r) => setTimeout(r, 900)); // demo

      // Mensaje genérico (buena práctica de seguridad)
      setSuccessMessage(
        "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo procesar la solicitud. Intenta de nuevo.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
              style={[styles.backBtn, { borderColor: colors.border }]}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <View style={{ flex: 1 }} />
          </View>

          {/* Icon */}
          <View
            style={[
              styles.heroIcon,
              { backgroundColor: isDark ? "#374151" : "#EEF2FF" },
            ]}
          >
            <Ionicons name="lock-closed-outline" size={28} color={colors.text} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>Recuperar contraseña</Text>
          <Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errorMessage) setErrorMessage("");
                if (successMessage) setSuccessMessage("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="send"
              autoComplete="email"
              textContentType="emailAddress"
            />

            {!!errorMessage && (
              <View style={[styles.messageBox, styles.errorBox]}>
                <Ionicons name="alert-circle-outline" size={18} color="#B91C1C" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {!!successMessage && (
              <View style={[styles.messageBox, styles.successBox]}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#065F46" />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.btnBase,
              { backgroundColor: colors.primary },
              isSubmitting && { opacity: 0.75 },
            ]}
            onPress={handleSend}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            {isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <>
                <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>Enviar enlace</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Secondary actions */}
          <View style={styles.footerBox}>
            <Text style={[styles.footerText, { color: colors.text, opacity: 0.6 }]}>
              ¿Recordaste tu contraseña?
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Login")} activeOpacity={0.8}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Volver al login</Text>
            </TouchableOpacity>
          </View>

          {/* Help / hint */}
          <TouchableOpacity
            style={[styles.helpCard, { borderColor: colors.border }]}
            activeOpacity={0.9}
            onPress={() =>
              Alert.alert(
                "Ayuda",
                "Revisa tu bandeja de entrada y spam. Si no llega, confirma que el correo esté bien escrito."
              )
            }
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.text} />
            <Text style={[styles.helpText, { color: colors.text, opacity: 0.75 }]}>
              Consejos para encontrar el correo
            </Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-forward" size={18} color={colors.text} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 18,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    alignSelf: "flex-start",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 0.2,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 22,
  },

  formContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 16,
  },

  messageBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },

  errorBox: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },

  successBox: {
    borderColor: "#6EE7B7",
    backgroundColor: "#ECFDF5",
  },

  errorText: {
    flex: 1,
    color: "#B91C1C",
    fontWeight: "700",
    lineHeight: 18,
  },

  successText: {
    flex: 1,
    color: "#065F46",
    fontWeight: "700",
    lineHeight: 18,
  },

  btnBase: {
    height: 56,
    width: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  footerBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    marginBottom: 14,
  },

  footerText: {
    fontSize: 14,
    fontWeight: "500",
  },

  footerLink: {
    fontSize: 14,
    fontWeight: "800",
  },

  helpCard: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  helpText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
