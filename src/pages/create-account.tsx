import { gql, useMutation } from "@apollo/client";
import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { createAccountMutation, createAccountMutationVariables } from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";

const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccountMutation ($createAccountInput: CreateAccountInput!) {
        createAccount(input: $createAccountInput) {
            ok,
            error
        }        
    }
`;

interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole;
}

export const CreateAccount = () => {
    const inputEl = useRef({ required: "email is required" });
    const {
        register,
        getValues,
        handleSubmit,
        formState: { isValid, errors }
    } = useForm<ICreateAccountForm>({
        mode: 'onChange',
        defaultValues: {
            role: UserRole.Client
        }
    });

    const navigate = useNavigate();
    const onCompleted = (data: createAccountMutation) => {
        const { createAccount: { ok } } = data;
        if (ok) {
            navigate("/login");
        }
    };

    const [
        createAccountMutation,
        { data: createAccountMutationResult, loading }
    ] = useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
        onCompleted
    });
    
    const onSubmit = () => {
        if (!loading) {
            const { email, password, role } = getValues();

            createAccountMutation({
                variables: {
                    createAccountInput: {email, password, role}
                }
            })
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <Helmet>
                <title>Create Account | Nuber Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src="https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg" className="w-52 mb-10" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">
                    Let's get started
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
                    {errors.email?.message && (           
                        <FormError errorMessage={errors.email?.message}/>
                    )}
                    <input
                        {...register("password", {required: "Password is required", minLength: 4})}
                        required
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="input"
                    />
                    <select
                        {...register("role", {required: true})}
                        name="role"
                        className="input"
                    >
                        {Object.keys(UserRole).map((role, index) => (
                            <option key={index}>{role}</option>    
                        ))}        
                    </select>
                    
                    {errors.password?.message && (
                        <FormError errorMessage={errors.password?.message}/>
                    )}
                    {errors.password?.type === "minLength" && (
                        <FormError errorMessage="Password must be more than 4 chars."/>
                    )}
                    <Button
                        canClick = {isValid}
                        loading = {loading}
                        actionText="Log in" />
                    {createAccountMutationResult?.createAccount.error && (
                        <FormError errorMessage={createAccountMutationResult.createAccount.error} />
                    )}
                </form>

                <div className="mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="text-lime-600 hover:underline">
                        Log in now
                    </Link>
                </div>
            </div>
        </div>
    );
};