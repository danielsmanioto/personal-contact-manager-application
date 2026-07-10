export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  MAX_SIZE: 100,
};

export const VALIDATION = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 255,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^[0-9]{10,20}$/,
};

export const TIMEOUT = {
  API_TIMEOUT: 30000,
  DEBOUNCE_DELAY: 300,
};

export const MESSAGES = {
  SUCCESS_CREATE: 'Contato criado com sucesso',
  SUCCESS_UPDATE: 'Contato atualizado com sucesso',
  SUCCESS_DELETE: 'Contato deletado com sucesso',
  ERROR_GENERIC: 'Ocorreu um erro ao processar sua solicitação',
  ERROR_NOT_FOUND: 'Contato não encontrado',
  ERROR_EMAIL_EXISTS: 'Este email já está cadastrado',
};
