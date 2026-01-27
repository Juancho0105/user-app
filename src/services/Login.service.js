const API_URL = process.env.EXPO_PUBLIC_URL;

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export const LoginService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return {
        status: false,
        message: data?.message || 'No se pudo iniciar sesión.',
      };
    }

    return data;
  },

  register: async (name, lastName, email, password) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lastName, email, password }),
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return {
        status: false,
        message: data?.message || 'No se pudo crear la cuenta.',
      };
    }

    return data;
  },
};