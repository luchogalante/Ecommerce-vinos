const authorization = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: "No autenticado" });
    }

    if (req.user.role !== role) {
      return res.status(403).send({ error: "No autorizado" });
    }

    next();
  };
};

export default authorization;
