import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';

const checkBlockedAndClearToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Access token from the cookie

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId; // Use the correct property name
            const user = await User.findById(userId);

            if (user && user.isBlocked) {
                res.cookie('jwt', '', {
                    httpOnly: true,
                    expires: new Date(0)
                })
                console.log('JWT token cleared.');
                return res.status(403).json({ message: 'User is blocked. Access denied.' });
            }
        }

        next();
    } catch (error) {
        console.error('Error:', error);
        return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
};

export default checkBlockedAndClearToken;
