import { gql, useQuery } from "@apollo/client";
import { restaurantsPageQuery, restaurantsPageQueryVariables } from "../../__generated__/restaurantsPageQuery";
import React, { useState } from "react";
import { Restaurant } from "../../components/restaurant";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";

const RESTAURANT_QUERY = gql`
    query restaurantsPageQuery ($input: RestaurantsInput!) {
        allCategories {
            ok
            error
            categories {
                ...CategoryParts
            }
        }
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`;

interface IFromProps {
    searchTerm: string;
}

export const Restuarants = () => {
    const [page, setPage] = useState(1);
    const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANT_QUERY, {
        variables: {
            input: {
                page: 1   
            }
        }
    });
    const { register, handleSubmit, getValues } = useForm<IFromProps>();
    const navigate = useNavigate();
    const onSearchSubmit = () => {
        console.log("hi");
        var { searchTerm } = getValues();
        navigate({
            pathname: "/search",
            search: `?term=${searchTerm}`,
        });
        /*
         * search: URL에 표시
         * state: URL에서 데이터를 숨겨서 가져올 수 있다. 메모리에 저장됨
        */
    };

    const onNextPageClick = () => setPage((current) => current + 1);
    const onPrevPageClick = () => setPage((current) => current - 1);
    
    return (
        <div>
            <Helmet>
                <title>Home | Nuber Eats</title>
            </Helmet>
            <form
                onSubmit={handleSubmit(onSearchSubmit)}
                className="flex justify-center items-center bg-gray-800 w-full py-40">
                <input
                    {...register("searchTerm", {required: true, min: 3})}
                    name="searchTerm"
                    type="Search"
                    className="input rounded-md border-0 w-3/4 md:w-3/12"
                    placeholder="Search restaurants" /> 
            </form>

            {!loading &&
                <div className="max-w-screen-2xl mx-auto mt-8">
                    <ul className="flex justify-around max-w-sm mx-auto">
                        {data?.allCategories.categories?.map((category) => (
                            <Link to={`/category/${category.slug}`} key={category.id}>
                            <li                                
                                className="flex flex-col items-center cursor-pointer group">
                                <div
                                    className="w-14 h-14 bg-cover group-hover:bg-gray-100 rounded-full"
                                    style={{ backgroundImage: `url(${category.coverImage})` }}
                                ></div>
                                <span className="mt-1 text-sm text-center font-medium">
                                {category.name}
                                </span>
                            </li>
                            </Link>
                        ))}
                    </ul>

                    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.restaurants.results?.map((restaurant) => (
                            <Restaurant
                                key={restaurant.id}
                                id={restaurant.id + ""}
                                name={restaurant.name}
                                coverImg={restaurant.coverImage}
                                categoryName={restaurant.category?.name}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center items-center mt-10">
                        {page > 1 && (
                            <button
                                onClick={onPrevPageClick}
                                className="focus font-medium test-2xl">
                                &larr;
                            </button>
                        )}
                        <span className="mx-5">
                            Page {page} of {data?.restaurants.totalPages}
                        </span>
                        {page != data?.restaurants.totalPages && (
                            <button
                                onClick={onNextPageClick}
                                className="focus font-medium test-2xl">
                                &rarr;
                            </button>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};