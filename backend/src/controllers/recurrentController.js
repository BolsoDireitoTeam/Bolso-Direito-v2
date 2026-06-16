const RecurrentTransaction = require('../models/recurrentModel');

exports.getAll = async (req, res) => {
  try {
    const userId = req.user;
    const recs = await RecurrentTransaction.find({ userId });
    res.status(200).json({ success: true, data: recs });
  } catch (error) {
    throw error;
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.user;
    const newRec = await RecurrentTransaction.create({ ...req.body, userId });
    res.status(201).json({ success: true, data: newRec });
  } catch (error) {
    throw error;
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await RecurrentTransaction.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Removido com sucesso.' });
  } catch (error) {
    throw error;
  }
};
