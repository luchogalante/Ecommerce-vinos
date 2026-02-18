const authorization = (roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).send({ error: "No autenticado" });
    }

    // Convertimos a array por si mandan un solo rol
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send({ error: "No autorizado" });
    }

    next();
  };
};

export default authorization;
