// Middleware to check if user has the required role(s)
const protect = require('./protect'); // Make sure 'protect' is always run before this

const roleProtect = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      const allowedRolesList = allowedRoles.join(' or ');
      return res.status(403).json({ 
        message: `Access denied. This action requires role: ${allowedRolesList}. Your role: ${req.user.role}` 
      });
    }

    next(); // Authorized ✅
  };
};

module.exports = roleProtect;
