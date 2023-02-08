const validateSauce = (sauce) => {
    let isValid = true;
    
    if(!sauce.userId) {
        isValid = false;
    }
    if(sauce.heat>10) {
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
