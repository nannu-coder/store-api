const Product = require("../models/product-model");

exports.getAllProductsStatic = async (req, res, next) => {
  const products = await Product.find({}).sort("name");
  res.status(200).json({ products, nbhits: products.length });
};

exports.getAllProducts = async (req, res, next) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }

  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  const limit = req.query.limit || 1;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ products, nbhits: products.length });
};
