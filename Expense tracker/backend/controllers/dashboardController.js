const Expense = require("../models/Expense");
const Income = require("../models/Income");

const getDashboardStats = async (req, res)=>{
try {
    const userId = req.user.id;

    const incomes = await Income.find({ user: userId});
    const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
    
    const expense = await Expense.find({ user: userId});
    const totalExpense = expense.reduce((acc, item) => acc + item.amount, 0);

    const totalBalance = totalIncome - totalExpense;
      
    res.status(200).json({
      totalIncome,
      totalExpense,
      totalBalance
    });


} catch (error) {
    console.log("Get Dashboard Stats Error :", error.message);
       res.status(500).json({ message: error.message }); 
}
}

module.exports = {
    getDashboardStats
}