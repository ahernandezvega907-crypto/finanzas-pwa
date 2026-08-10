import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
      <h1 className="text-4xl font-black text-primary">404</h1>
      <p className="text-sm text-text-muted">La página que buscas no existe o ha sido movida.</p>
      <Button variant="outline" size="sm" onClick={() => navigate('/')}>
        Volver al Inicio
      </Button>
    </div>
  );
};

export default NotFound;