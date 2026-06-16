exports.uploadExtrato = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
    }

    res.status(200).json({
      success: true,
      message: 'Extrato recebido com sucesso.',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.uploadFatura = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
    }

    res.status(200).json({
      success: true,
      message: 'Fatura recebida com sucesso.',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    throw error;
  }
};
