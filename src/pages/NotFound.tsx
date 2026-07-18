import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-4">
      <h2 className="text-6xl font-bold text-danger">404</h2>
      <p className="text-text-muted text-lg">La página que buscas no existe o ha sido movida.</p>
      <Button variant="outline" onClick={() => navigate('/')}>Regresar al inicio</Button>
    </div>
  );
}