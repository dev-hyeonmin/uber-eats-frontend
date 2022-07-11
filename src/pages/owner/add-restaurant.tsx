import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { createRestaurant, createRestaurantVariables } from "../../__generated__/createRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant ($input: CreateRestaurantInput!) {
        createRestaurant (input: $input) {
            ok
            error
            restaurantId
        }
    }
`;

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
    file: FileList;
}

export const AddRestaurant = () => {
    const client = useApolloClient();
    const navigation = useNavigate();
    const [imageUrl, setImageUrl] = useState("");

    const onCompleted = (data: createRestaurant) => {
        const { createRestaurant: { ok, error, restaurantId } } = data;
        const { name, categoryName, address } = getValues();

        if (ok) {
            setUploading(false);
            const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
            client.writeQuery({
                query: MY_RESTAURANTS_QUERY,
                data: {
                    myRestaurants: {
                        ...queryResult.myRestaurants,
                        restaurants: [
                            {
                                address,
                                category: {
                                    name: categoryName,
                                    __typename: "Category",
                                },
                                coverImage: imageUrl,
                                id: restaurantId,
                                isPromoted: false,
                                name,
                                __typename: "Restaurant",
                            },
                            ...queryResult.myRestaurants.restaurants,
                        ],
                    },
                }
            });
            navigation("/");
        }
    }
    const [createRestaurantMutation, { loading, data }] = useMutation<
        createRestaurant,
        createRestaurantVariables
        >(CREATE_RESTAURANT_MUTATION, {
            onCompleted,
            //refetchQueries: [{query: MY_RESTAURANTS_QUERY}],
        }
    );
    
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, getValues, formState } = useForm({
        mode: "onChange"
    });
    const onSubmit = async () => {
        try {
            setUploading(true);
            const { file, name, address, categoryName } = getValues();
            const actualFile = file[0];
            const formBody = new FormData();
            formBody.append("file", actualFile);
            const { url: coverImage } = await (
                await fetch("http://localhost:4000/uploads/", {
                    method: "POST",
                    body: formBody
                })
            ).json();
            setImageUrl(coverImage);

            createRestaurantMutation({
                variables: {
                    input: {
                        name,
                        address,
                        categoryName,
                        coverImage,
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }        
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("name", {required: "Name is required"})}
                    type="text"
                    className="input"
                    placeholder="name"
                    name="name"
                />

                <input
                    {...register("address", {required: "Address is required"})}
                    type="text"
                    className="input"
                    placeholder="address"
                    name="address"
                />

                <input
                    {...register("categoryName", {required: "CategoryName is required"})}
                    type="text"
                    className="input"
                    placeholder="categoryName"
                    name="categoryName"
                />

                <div>
                    <input
                        {...register("file", {required: true})}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                </div>
                
                <Button
                    loading={loading}
                    canClick={formState.isValid}
                    actionText="Create Restaurant"
                />
            </form>
        </div>
    );
}