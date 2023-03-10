import { Rule } from "ant-design-vue/es/form";

export const passwordValidator: Rule = {
  message:
    "Password is not valid. Password can contain A-Z, a-z, 0-9, ';./|' characters",
  validator: (_, value) =>
    /^[A-Za-z\d;\\./|,]{8,}$/gm.test(value)
      ? Promise.resolve()
      : Promise.reject(),
};

export const emailValidator: Rule = {
  message: "Email is not valid",
  pattern: /^[\w%+-]+(\.[\w%+-]+)*@[\w%+-]+(\.[\w%+-]+)+$/gm,
};

export const requiredValidator: Rule = {
  message: "This field is required",
  required: true,
};
