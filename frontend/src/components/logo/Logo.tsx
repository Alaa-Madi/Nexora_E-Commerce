
import { motion } from 'framer-motion'
import logogo from '../../assets/logogo.png';

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 12 },
    },
  }

  interface LogoProps {
    width?: number,
    height?: number,
    className?: string,
    textDirection?: "Row" | "Column",
  }

const Logo = ({width = 0, height = 0, className= "", textDirection = "Column"} : LogoProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex items-center justify-center ${className}`}
      style={{
        background: 'radial-gradient(circle at 60% 40%, #0A1833 70%, #1769FA 100%)',
        borderRadius: '50%',
        padding: '0.5rem',
        boxShadow: '0 0 24px 4px #1769FA88',
        width: width ? width + 24 : 124,
        height: height ? height + 24 : 124,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={logogo}
        alt="Nexora Logo"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          boxShadow: '0 0 8px 0 #1769FA44',
          objectFit: 'cover',
          background: 'transparent',
          display: 'block',
        }}
      />
    </motion.div>
  )
}

export default Logo