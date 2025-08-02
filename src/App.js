import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import * as yup from 'yup';

export default function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const validationSchema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: yup.string().required('E-mail é obrigatório').email('Digite um e-mail válido'),
    telefone: yup.string().required('Telefone é obrigatório').min(15, 'Telefone incompleto'),
    senha: yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: yup.string().oneOf([yup.ref('senha'), null], 'Senhas não conferem').required('Confirmação de senha é obrigatória')
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Dados enviados:', formData);
      setSubmitSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
      });
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Cadastro de Usuário</h2>

      {submitSuccess && (
        <Alert variant="success" className="mb-4">
          Cadastro realizado com sucesso!
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>Nome completo</Form.Label>
          <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} isInvalid={!!errors.nome}
            placeholder="Digite seu nome"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.nome}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email}
            placeholder="Digite seu e-mail"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              const formatted = raw
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .slice(0, 15);
              setFormData({ ...formData, telefone: formatted });
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.telefone}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control type="password" name="senha" value={formData.senha} onChange={handleChange} isInvalid={!!errors.senha}
            placeholder="Digite sua senha"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.senha}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Confirmar Senha</Form.Label>
          <Form.Control type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} isInvalid={!!errors.confirmarSenha}
            placeholder="Confirme sua senha"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmarSenha}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isSubmitting}
          className="w-100"
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </Form>
    </div>
  );
}