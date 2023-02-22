const validateSauce = (sauce) => {
    let isValid = true;

    const sauceTextInputRegex = new RegExp(/^[ a-zA-ZÀ-úœ'\-\’]{2,25}$/, 'g');
    const sauceDescTextInputRegex = new RegExp(/^[ a-zA-ZÀ-úœ'\-\’]{2,1000}$/, 'g');

    if(!sauce.userId) {
        isValid = false;
    }
    if(sauceTextInputRegex.test(sauce.name && sauce.manufacturer && sauce.mainPepper) === false) {
        isValid = false;
    }   
    if(sauceDescTextInputRegex.test(sauce.description) === false) {
        isValid = false;
    }
    if(sauce.heat<0) {
        isValid = false;
    }
    if(sauce.heat>10) {
        isValid = false;
    }

    return isValid;
};

module.exports = validateSauce;
