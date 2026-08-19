export function requireAdmin(req, res) {
  const provided = req.headers['x-admin-password'];
  if (!provided || provided !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
