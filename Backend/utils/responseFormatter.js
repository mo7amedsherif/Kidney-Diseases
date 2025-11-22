// utils/responseFormatter.js

// دالة بتاخد الحالة (نجاح ولا فشل)، والرسالة، والبيانات (لو فيه)
const formatResponse = (success, message, data = null) => {
    // وترجعلنا كائن (Object) منسق
    return {
        success,
        message,
        data
    };
};

module.exports = formatResponse;