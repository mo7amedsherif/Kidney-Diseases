const jwt = require('jsonwebtoken');

// 1. دالة للتحقق من أن المستخدم مسجل دخول ومعه توكن سليم
const verifyToken = (req, res, next) => {
    // استخراج التوكن من الهيدر (عادة يكون بالشكل: Bearer xxxxx.yyyy.zzzz)
    const authHeader = req.headers.token || req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1]; // نأخذ الجزء الثاني بعد كلمة Bearer

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            // إذا كان التوكن سليم، نضع بيانات المستخدم (التي كانت داخل التوكن) في الـ Request
            req.user = user;
            next(); // انتقل للدالة التالية
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

// 2. دالة للتحقق من أن المستخدم هو Admin
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        // هنا نفحص الـ role الموجود داخل التوكن (تأكد أنك خزنته باسم role أو isAdmin عند إنشاء التوكن)
        if (req.user.role === 'admin') {
            next(); // تمام، هو أدمن، كمل
        } else {
            res.status(403).json("You are not allowed to do that! Admins only.");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAdmin//دا الي هستحدمه عشان احمي اي روتر 
};