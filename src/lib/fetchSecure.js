import { authApi } from './auth';

export async function fetchSecure(url, init = {}) {
  try {
    console.log('Iniciando requisição segura para:', url);
    console.log('Método:', init.method || 'GET');
    
    const token = await authApi.getIdToken(false);
    console.log('Token obtido com sucesso');
    console.log('Token:', token);
    
    const headers = {
      ...init.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('Fazendo requisição com token válido');
    
    const response = await fetch(url, {
      ...init,
      headers
    });

    console.log('Resposta recebida com status:', response.status);

    // Se o status for 404, endpoint não encontrado (pode ser esperado)
    if (response.status === 404) {
      console.warn('Erro 404 - Nenhum dado encontrado para:', url);
      const errorText = await response.text();
      console.log('Resposta do servidor:', errorText);
      // Retornar a resposta mesmo assim para o código tratar
      return response;
    }

    // Se o status for 500, é erro do servidor
    if (response.status === 500) {
      console.error('Erro 500 do servidor ao chamar:', url);
      const errorText = await response.text();
      console.error('Resposta do servidor:', errorText);
      throw new Error(`Erro do servidor: ${errorText}`);
    }

    // Se o status for 401, significa token inválido/expirado
    if (response.status === 401) {
      console.warn('Token inválido ou expirado (401), tentando renovar');
      
      try {
        const newToken = await authApi.getIdToken(true);
        
        const retryHeaders = {
          ...init.headers,
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json'
        };

        console.log('Tentando novamente com novo token');
        
        const retryResponse = await fetch(url, {
          ...init,
          headers: retryHeaders
        });

        if (retryResponse.status === 500) {
          throw new Error('Erro do servidor');
        }

        return retryResponse;
      } catch (tokenError) {
        console.error('Erro ao renovar token:', tokenError);
        await authApi.signOut();
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
    }

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      console.error(`Erro HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Erro na requisição segura:', error.message);
    
    // Se for erro de token expirado
    if (error.message.includes('Token expirado') || error.message.includes('Sessão expirada')) {
      try {
        await authApi.signOut();
      } catch (e) {
        console.error('Erro ao fazer logout:', e);
      }
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }
    
    throw error;
  }
}