export const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void; 
  }> = ({ children, className = '', onClick }) => {
    return (
      <div
        className={`bg-white rounded-lg shadow-md p-6 ${className} ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick} 
      >
        {children}
      </div>
    );
  };
  