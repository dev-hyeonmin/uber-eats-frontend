import React from "react";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import {BrowserRouter as Router, useNavigate} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { render, RenderResult, waitFor } from "../../test-utils";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/globalTypes";

/*const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const realModule = jest.requireActual("react-router-dom");
    return {
        ...realModule,
        useNavigate: mockNavigate
    }
});*/

describe("<CreateAccount/>", () => {
    let mockedClient: MockApolloClient;
    let renderResult: RenderResult;
    
    beforeEach(async () => {
        await waitFor(() => {
            mockedClient = createMockClient();
            renderResult = render(
                <ApolloProvider client={mockedClient}>
                    <CreateAccount />
                </ApolloProvider>
            );
        })
    });

    it("renders OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Create Account | Nuber Eats");
        });        
    });

    it("renders validation errors", async () => {
        const { getByRole, getByPlaceholderText } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const button = getByRole("button");

        await act(() => {
            userEvent.type(email, "this@wont");
            userEvent.clear(email);
        });
        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/email is required/i);

        await act(() => {
            userEvent.type(email, "working@email.com");
            userEvent.type(password, "1");
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/password must be more than 4 chars./i);

        await act(() => {
            userEvent.type(email, "working@email.com");
            userEvent.clear(password);
            userEvent.click(button);
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/password is required/i);
    });

    it("submits mutation with form values", async () => {
        const { getByRole, getByPlaceholderText } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const button = getByRole("button");
        const formData = {
            email: "testDev@gmail.com",
            password: "testDev",
            role: UserRole.Client,
        }

        const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
            data: {
                createAccount: {
                    ok: true,
                    error: "mutation-error",
                }
            }
        });

        mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedLoginMutationResponse);
        jest.spyOn(window, "alert").mockImplementation(() => null);
        await act(() => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(button);
        });

        expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
            createAccountInput: {
                email: formData.email,
                password: formData.password,
                role: formData.role
            }
        });
        expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
        const mutationError = getByRole("alert");
        expect(mutationError).toHaveTextContent("mutation-error");
    });
});