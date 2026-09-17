function authenticate(tokenService) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = header.slice("Bearer ".length);
    try {
      const payload = tokenService.verify(token);
      req.user = { id: payload.sub, username: payload.username, role: payload.role };
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = authenticate;
