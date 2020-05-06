export default async (req, res, next) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden',
    });
  }
  return next();
};
