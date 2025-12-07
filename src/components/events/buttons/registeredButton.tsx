import React from 'react'
import { useTranslation } from 'react-i18next';

interface RegisteredButtonProps {
    handleUnregister: () => void;
    common: string;
    }

const RegisteredButton : React.FC<RegisteredButtonProps>  = ({ handleUnregister, common }: RegisteredButtonProps) => {
    const { t } = useTranslation("common");

    const [isRegisteredHovering, setIsRegisteredHovering] = React.useState(false);

  return (
    <button
        onClick={handleUnregister}
        onMouseEnter={() => setIsRegisteredHovering(true)}
        onMouseLeave={() => setIsRegisteredHovering(false)}
        className={`${common} bg-blue-600 hover:bg-gray-700 transition-colors duration-300`}
        >
        {isRegisteredHovering ? t("UNREGISTER") : t("REGISTERED")}
        </button>
  )
}

export default RegisteredButton