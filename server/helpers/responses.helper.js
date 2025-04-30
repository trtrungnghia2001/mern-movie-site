export const handleError = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message

  return res.status(status).json({
    status: status,
    message: message,
  })
}

export const handleResponse = (res, { data, message, status = 200 }) => {
  return res.status(status).json({
    status,
    message,
    data,
  })
}
