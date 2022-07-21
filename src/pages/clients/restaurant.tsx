import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOptiops } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { createOrder, createOrderVariables } from "../../__generated__/createOrder";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";

const RESTAURANT_QUERY = gql`
    query restaurant ($input: RestaurantInput!) {
        restaurant (input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
            ok
            error
            orderId
        }
    }
`;

type IRestaurantParams = {
    id: string;
}

export const Restaurant = () => {
    const navigation = useNavigate();
    const { id } = useParams() as IRestaurantParams;
    const { loading, data } = useQuery<restaurant, restaurantVariables>(
        RESTAURANT_QUERY,
        {
            variables: {
                input: {
                    restaurantId: +id,
                },
            },
        }
    );

    const [orderStarted, setOrderStrated] = useState(false);
    const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
    const triggerStartOrder = () => {
        setOrderStrated(true);
    };

    const onCompleted = (data: createOrder) => {
        const {
            createOrder: { ok, orderId },
        } = data;

        if (ok) {
            alert("order created!");
            navigation(`/orders/${orderId}`)
        }
    }

    const [createOrderMutation, { loading: placingOrder }] = useMutation<createOrder, createOrderVariables>(CREATE_ORDER_MUTATION, {
        onCompleted: onCompleted
    })
    const getItem = (dishId: number) => {
        return orderItems.find((order) => order.dishId === dishId);
    };
    
    const isSelected = (dishId: number) => {
        return Boolean(orderItems.find((order) => order.dishId === dishId));
    };

    const addItemToOrder = (dishId: number) => {
        if (isSelected(dishId)) {
            return;
        }

        setOrderItems((current) => [{ dishId, options: [] }, ...current]);
    };

    const removeItemToOrder = (dishId: number) => {
        setOrderItems((current) =>
            current.filter((dish) => dish.dishId !== dishId)
        );
    }

    const addOptionToItem = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) {
            return;
        }

        const oldItem = getItem(dishId);
        if (oldItem) {
            const hasOption = Boolean(oldItem.options?.find((aOption) => aOption.name === optionName));

            if (!hasOption) {
                removeItemToOrder(dishId);
                setOrderItems((current) => [
                    { dishId, options: [{name: optionName}, ...oldItem.options!] },
                    ...current,
                ]);   
            }      
        }
    };

    const getOption = (item: CreateOrderItemInput, optionName: string) => {
        return Boolean(item.options?.find((option) => option.name == optionName))
    };

    const isOptionSelected = (dishId: number, optionName: string) => {
        const item = getItem(dishId);
        if (item) {
            return getOption(item, optionName);
        } else {
            return false;
        }
    }

    const removeOptionFormItem = (dishId: number, optionName: string) => {
        const item = getItem(dishId);
        if (item) {
            const option = item.options?.filter((option) => option.name !== optionName);
            setOrderItems((current) => [
                { dishId, options: option},
                ...current,
            ]); 
        }
    }

    const triggerConfirmOrder= () => {
        if (orderItems.length === 0) {
            alert("Can't place empty order");
            return;
        }

        const ok = window.confirm("You are about to place an order");

        if (ok) {
            createOrderMutation({
                variables: {
                    input: {
                        restaurantId: +id,
                        items: orderItems
                    }
                }
            })
        }
    }

    const triggerCancelOrder = () => {
        setOrderStrated(false);
        setOrderItems([]);
    }

    console.log(orderItems);
    return (
        <div>
            <Helmet>
                <title>{data?.restaurant.restaurant?.name || ""} | Nuber Eats</title>
            </Helmet>
            <div
                className=" bg-gray-800 bg-center bg-cover py-48"
                style={{
                backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
                }}
            >
                <div className="bg-white w-3/12 py-8 pl-48">
                <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
                <h5 className="text-sm font-light mb-2">
                    {data?.restaurant.restaurant?.category?.name}
                </h5>
                <h6 className="text-sm font-light">
                    {data?.restaurant.restaurant?.address}
                </h6>
                </div>
            </div>

            <div className="container pb-32 flex flex-col items-end mt-20">
            {!orderStarted && (
                <button onClick={triggerStartOrder} className="btn px-10">
                    Start Order
                </button>
            )}
            {orderStarted && (
                <div className="flex items-center">
                    <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
                        Confirm Order
                    </button>
                    <button
                        onClick={triggerCancelOrder}
                        className="btn px-10 bg-black hover:bg-black"
                        >
                        Cancel Order
                    </button>
                </div>
                )}      
                
                {data?.restaurant.restaurant?.menu.length === 0 ? (
                    <h4 className="text-xl mb-5">Please upload a dish!</h4>
                    ) : (
                    <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.restaurant.restaurant?.menu.map((dish, index) => (
                            <Dish
                                id={dish.id}
                                orderStarted={orderStarted}
                                key={index}
                                name={dish.name}
                                description={dish.description}
                                price={dish.price}
                                isCustomer={true}
                                isSelected={isSelected(dish.id)}
                                options={dish.options}
                                addItemToOrder={addItemToOrder}
                                removeItemToOrder={removeItemToOrder}
                            >
                                {dish.options?.map((option, index) => (
                                    <DishOptiops
                                        key={index}
                                        dishId={dish.id}
                                        optionName={option.name}
                                        extra={option.extra}
                                        addOptionToItem={addOptionToItem}
                                        removeOptionFormItem={removeOptionFormItem}
                                        isSelected={isOptionSelected(dish.id, option.name)}
                                    />
                                ))}
                            </Dish>
                        ))}
                    </div>   
                )}
            </div>
        </div>
    )
}