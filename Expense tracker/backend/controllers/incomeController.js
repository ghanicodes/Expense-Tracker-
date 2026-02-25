const Income = require("../models/Income");

// Add Income 
const addIncome = async (req, res) => {
  try {
    const {title, amount, source, date} = req.body;

    if (!title || !amount || !source) {
        return res.status(400).json({
        message: "All fields are required"
      });
    }

        const income = await Income.create({
          title,
          amount,
          source,
          date: date || Date.now(),
          user: req.user.id,
        });
    
    res.status(201).json(income);

  } catch (error) {
    console.log("Add Income Error :", error.message);
    res.status(500).send({
        message: "Add Income Error",
        error: error.message 
    });
  }
}

// Get Income 
const getIncome = async (req, res) => {
     try {
     
        const income = await Income.find({ user: req.user.id })
              .sort({ date: -1 });

    res.status(200).json(income);
        
     } catch (error) {
    console.log("Add Expense Error :", error.message);
    res.status(500).send({
        message: "Get Income Error",
        error: error.message 
    });
        
     }
}



module.exports = {
    addIncome,
    getIncome
}