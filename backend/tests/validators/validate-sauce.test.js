const validateSauce = require("../../validators/validate-sauce");

describe("testing `validateSauce`", () => {

    test("empty object provided returns false", () => {
        const actual = validateSauce({});
        expect(actual).toBe(false);
    });

    test("undefined user id provided returns false", () => {
        const actual = validateSauce({
            userId: undefined,
            heat : 5
        });
        expect(actual).toBe(false);
    });

    test("heat between 1-10 returns true", () => {
        const actual = validateSauce({
            userId: "raymond",
            heat : 5
        });
        expect(actual).toBe(true);
    });

    test("heat > 10 returns false", () => {
        const actual = validateSauce({
            userId: "raymond",
            heat : 12
        });
        expect(actual).toBe(false);
    });

    test("normal payload should return true", () => {
        const actual = validateSauce({
            userId: "dadazdzadaz",
            heat : 9
        });
        expect(actual).toBe(true);
    });

    // test("heat < 0 returns false", () => {
    //     const actual = validateSauce({
    //         userId: "raymond",
    //         heat : -20
    //     });
    //     expect(actual).toBe(false);
    // });

    // test("heat as random string returns false", () => {
    //     const actual = validateSauce({
    //         userId: "raymond",
    //         heat : "random string"
    //     });
    //     expect(actual).toBe(false);
    // });
});

