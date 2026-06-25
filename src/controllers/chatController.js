const axios = require("axios");

const chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const response = await axios.post("http://127.0.0.1:8001/chat", {
      question,
    });

    return res.status(200).json({
      success: true,
      answer: response.data.answer,
    });
  } catch (err) {
    console.log("===== CHAT ERROR =====");
    console.log(err.message);

    if (err.response) {
      console.log(err.response.data);
    }

    return res.status(500).json({
      success: false,
      message: "Unable to contact AI service",
    });
  }
};

module.exports = {
  chat,
};
