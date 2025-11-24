//mohamed
const jwt = require('jsonwebtoken');
const generateToken = (id,role) => {
    return jwt.sign({ id,role }, process.env.JWT_SECRET ||"token_valu_2004", {
        expiresIn: '30d',
    });
}
module.exports = generateToken;
