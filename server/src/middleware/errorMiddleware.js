export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    message: err.message || 'Internal Server Error',
    statusCode
  });
};
