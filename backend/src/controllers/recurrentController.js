const RecurrentTransaction = require('../models/recurrentModel');

exports.getAll = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const recs = await RecurrentTransaction.find({ userId });
    res.status(200).json({ success: true, data: recs });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const newRec = await RecurrentTransaction.create({ ...req.body, userId });
    res.status(201).json({ success: true, data: newRec });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await RecurrentTransaction.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Removido com sucesso.' });
  } catch (error) {
    next(error);
  }
};
