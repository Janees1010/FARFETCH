

const validateProductData = (data) => {
    const errors = [];
    // Validate product name
    if (!data.productName || typeof data.productName !== 'string' || data.productName.trim().length === 0) {
        errors.push("Product name is required and must be a valid string.");
    }

    // Validate description
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
        errors.push("Description is required and must be a valid string.");
    }

    // Validate price
    if (!data.price || isNaN(data.price) || data.price <= 0) {
        errors.push("Price must be a positive number.");
    }

    // Validate quantity
    if (data.quantity < 0) {
        errors.push("Quantity must be a non-negative integer.");
    }

    // Validate offer price
    if (data.offerPrice && (isNaN(data.offerPrice) || data.offerPrice < 0)) {
        errors.push("Offer price must be a non-negative number if provided.");
    }

    // Validate category
    if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
        errors.push("Category is required and must be a valid string.");
    }

    // Validate size (should be an array of strings)
    if (!Array.isArray(data.size) || data.size.some(size => typeof size !== 'string' || size.trim().length === 0)) {
        errors.push("Size must be an array of valid strings.");
    }

    // Validate color (should be an array of strings)
    if (!Array.isArray(data.color) || data.color.some(color => typeof color !== 'string' || color.trim().length === 0)) {
        errors.push("Color must be an array of valid strings.");
    }
    return errors;
};

module.exports = {validateProductData}