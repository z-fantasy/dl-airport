module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "@vue/prettier"],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-unused-vars": 0,
        'prettier/prettier': 0,
        'indent': 0,
        'space-before-function-paren': 0,
        'camelcase': 0,
        'no-useless-escape': 0,
        'no-undef': 0,
        'no-unneeded-ternary': 0
    },
    parserOptions: {
        parser: "babel-eslint"
    }
};
