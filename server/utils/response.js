exports.success = (res, message, data = {}) => {
    return res.status(200).json({
        success: true,
        message,
        data
    });
};

exports.error = (res, message) => {
    return res.status(400).json({
        success: false,
        message
    });
};