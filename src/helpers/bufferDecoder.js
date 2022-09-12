function toBase64(buffer) {
  if (!Buffer.isBuffer(buffer)) return;
  const data = buffer.toString("binary");
  return data;
}

module.exports = {
  toBase64,
};
