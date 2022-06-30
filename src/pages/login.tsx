import { gql, useMutation } from "@apollo/client";
import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { loginMutation, loginMutationVariables } from "../__generated__/loginMutation";

export const LOGIN_MUTATION = gql`
    mutation loginMutation ($loginInput: LoginInput!) {
        login(input: $loginInput) {
            ok,
            error,
            token
        }        
    }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
    const inputEl = useRef({ required: "email is required" });
    const {
        register,
        getValues,
        handleSubmit,
        formState: { isValid, errors }
    } = useForm<ILoginForm>({
        mode: 'onChange'
    });

    const onCompleted = (data: loginMutation) => {
        const {
            login: { error, ok, token }
        } = data;

        if (ok && token) {
            //console.log(token);
            localStorage.setItem(LOCALSTORAGE_TOKEN, token);
            authTokenVar(token);
            isLoggedInVar(true);
        }
    };
    const [loginMutation, {data: loginMutationResult, loading}] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
        onCompleted
    });
    const onSubmit = () => {
        if (!loading) {
            const { email, password } = getValues();
            loginMutation({
                variables: {
                    loginInput: {
                        email,
                        password,
                    }
                },
            });
        }
      };
    return (
        <div className="h-screen flex items-center justify-center">
            <Helmet>
                <title>Login | Nuber Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src="https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg" className="w-52 mb-10" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">
                Welcome back
                </h4>

                <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-3 mt-5 w-full"
                >
                <input
                    {...register("email", {required: "Email is required", pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,})}
                    name="email"
                    required
                    type="email"
                    placeholder="Email"
                    className="input"
                />
                {errors.email?.type === "pattern" && (
                    <FormError errorMessage={"Please enter a valid email"} />
                )}
                {errors.email?.message && (
                    <FormError errorMessage={errors.email?.message} />
                )}
                <input
                    {...register("password", {required: "Password is required", minLength: 4})}
                    required
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="input"
                />
                {errors.password?.message && (
                    <FormError errorMessage={errors.password?.message}/>
                )}
                {/*errors.password?.type === "minLength" && (
                    <FormError errorMessage="Password must be more than 4 chars."/>
                )*/}
                <Button
                    canClick = {isValid}
                    loading = {loading}
                    actionText="Log in"/>
                {loginMutationResult?.login.error && (
                    <FormError errorMessage={loginMutationResult.login.error} />
                )}
                </form>

                <div className="mt-3">
                    New to Nuber?{" "}
                    <Link to="/signup" className="text-lime-600 hover:underline">
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
};