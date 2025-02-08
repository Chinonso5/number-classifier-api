const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper Functions

// Check if a number is prime
function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    const sqrt = Math.sqrt(num);
    for (let i = 3; i <= sqrt; i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

// Check if a number is perfect
function isPerfect(num) {
    let sum = 0;
    for (let i = 1; i < num; i++) {
        if (num % i === 0) sum += i;
    }
    return sum === num;
}

// Check if a number is Armstrong
function isArmstrong(num) {
    const digits = num.toString().split('').map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
    return sum === num;
}

// Get properties of a number
function getProperties(num) {
    const properties = [];
    if (isArmstrong(num)) properties.push("armstrong");
    if (num % 2 !== 0) properties.push("odd");
    else properties.push("even");
    return properties;
}

// Get digit sum
function getDigitSum(num) {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

// Endpoint: /api/classify-number
app.get('/api/classify-number', async (req, res) => {
    try {
        const { number } = req.query;

        // Input validation
        if (!number || isNaN(number)) {
            return res.status(400).json({
                number: "Alphabet",
                error: true,
            });
        }

        const num = parseInt(number, 10);

        // Calculate properties
        const isPrimeResult = isPrime(num);
        const isPerfectResult = isPerfect(num);
        const properties = getProperties(num);
        const digitSum = getDigitSum(num);

        // Fetch fun fact from Numbers API
        const funFactResponse = await axios.get(`http://numbersapi.com/${num}/trivia`);
        const funFact = funFactResponse.data;

        // Construct response
        const response = {
            number: num,
            is_prime: isPrimeResult,
            is_perfect: isPerfectResult,
            properties,
            digit_sum: digitSum,
            fun_fact: funFact,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
