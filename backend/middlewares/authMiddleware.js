import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const authenticate = async (req, res, next) => {
    try {
        // Assuming the Authorization header is formatted as "Bearer <token>"
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({success: false, message: 'Auth token is not provided or malformed'});
        }
        
        const token = authHeader.split(' ')[1];
        JWT.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({success: false, message: 'Auth Failed!'});
            } else {
                req.userId = decoded.id; // Assuming the payload contains an id
                next();
            }
        });
    } catch (error) {
        console.error(error);
        res.status(401).send({success: false, message: 'Auth Failed!'});
    }
};

export default authenticate;
