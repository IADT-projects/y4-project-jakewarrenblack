import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

export const LoginRegister = () => {
  const [loginSelected, setLoginSelected] = useState(true);
  const { loginUserWithEmail, loading, setLoading, register } =
    useContext(AuthContext);

  const Form = () => {
    const [form, setForm] = useState({
      username: "",
      email: "",
      password: "",
    });

    const handleForm = (e) => {
      let name = e.target.name;
      let value = e.target.value;

      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const submitForm = (type) => {
      if (type === "login") {
        loginUserWithEmail(
          {
            username: form.username,
            email: form.email,
            password: form.password,
          },
          location
        );
      } else if (type === "register") {
        register(
          {
            username: form.username,
            email: form.email,
            password: form.password,
          },
          location
        );
      }
    };

    const content = () => {
      if (loginSelected) {
        return (
          <>
            <Input
              name={"username"}
              value={form.username}
              handleForm={handleForm}
              label={"Username"}
              type={"text"}
            />
            <Input
              name={"email"}
              value={form.email}
              handleForm={handleForm}
              label={"Email"}
              type={"email"}
            />
            <Input
              name={"password"}
              value={form.password}
              handleForm={handleForm}
              label={"Password"}
              type={"password"}
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                window.location.href =
                  "https://raid-middleman.herokuapp.com/api/auth/google";
              }}
              btnText={"Sign in with Google"}
            />
            <Button
              onClick={async (e) => {
                e.preventDefault();
                submitForm("login");
              }}
              btnText={"Login"}
            />
          </>
        );
      } else {
        return (
          <>
            <Input
              name={"username"}
              value={form.username}
              handleForm={handleForm}
              label={"Username"}
              type={"text"}
            />
            <Input
              name={"email"}
              value={form.email}
              handleForm={handleForm}
              label={"Email"}
              type={"email"}
            />
            <Input
              name={"password"}
              value={form.password}
              handleForm={handleForm}
              label={"Password"}
              type={"password"}
            />
            <Button
              onClick={async (e) => {
                e.preventDefault();
                submitForm("register");
              }}
              btnText={"Sign Up"}
            />
          </>
        );
      }
    };

    return (
      <form className={"flex flex-col"}>
        <h1 className={"mb-5 text-4xl font-semibold text-white"}>
          {loginSelected ? "Login" : "Create an Account"}
        </h1>
        {content()}
        <p
          onClick={() => setLoginSelected(!loginSelected)}
          className={"mt-3 font-medium text-cyberYellow underline"}
        >
          {loginSelected ? "Register" : "Login"}
        </p>
      </form>
    );
  };

  return (
    <div className={"px-1"}>
      <Form />
    </div>
  );
};
