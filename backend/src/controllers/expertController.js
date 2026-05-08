const Expert = require("../models/Expert");

const getExperts = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page || "1", 10);
    const limit = Number.parseInt(req.query.limit || "6", 10);
    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }

    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: experts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found." });
    }

    res.status(200).json(expert);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperts,
  getExpertById,
};
