import { useState, useCallback } from 'react';
import { wpPost } from '@/lib/wordpress';
import type { CF7Response } from '@/types/wordpress';

interface ContactFormData {
  nome: string;
  email: string;
  empresa: string;
  telefone: string;
  mensagem: string;
}

const DEFAULT_CF7_FORM_ID = '529';
const DEFAULT_CF7_VERSION = '6.0.6';
const DEFAULT_CF7_LOCALE = 'pt_BR';
const DEFAULT_CF7_CONTAINER_POST = '16';
const envFormId = import.meta.env.VITE_CF7_FORM_ID?.trim();
const envContainerPost = import.meta.env.VITE_CF7_CONTAINER_POST?.trim();
const CF7_FORM_ID = /^\d+$/.test(envFormId ?? '')
  ? envFormId
  : DEFAULT_CF7_FORM_ID;
const CF7_CONTAINER_POST = /^\d+$/.test(envContainerPost ?? '')
  ? envContainerPost
  : DEFAULT_CF7_CONTAINER_POST;
const CF7_UNIT_TAG = `wpcf7-f${CF7_FORM_ID}-p${CF7_CONTAINER_POST}-o1`;

export function useContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: ContactFormData) => {
    if (!CF7_FORM_ID) {
      setError('Formulário não configurado. Entre em contato por email.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // CF7 expects FormData with field names matching the form tags
    const formData = new FormData();
    formData.append('your-name', data.nome);
    formData.append('your-email', data.email);
    formData.append('your-company', data.empresa);
    formData.append('your-phone', data.telefone);
    formData.append('your-message', data.mensagem);
    formData.append('_wpcf7', CF7_FORM_ID);
    formData.append('_wpcf7_version', DEFAULT_CF7_VERSION);
    formData.append('_wpcf7_locale', DEFAULT_CF7_LOCALE);
    formData.append('_wpcf7_unit_tag', CF7_UNIT_TAG);
    formData.append('_wpcf7_container_post', CF7_CONTAINER_POST);
    formData.append('_wpcf7_posted_data_hash', '');

    try {
      const res = await wpPost<CF7Response>(
        `/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`,
        formData
      );

      if (res.status === 'mail_sent') {
        setSuccess(true);
      } else {
        setError(res.message || 'Erro ao enviar mensagem. Tente novamente.');
      }
    } catch {
      setError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSuccess(false);
    setError(null);
  }, []);

  return { submit, submitting, success, error, reset };
}
