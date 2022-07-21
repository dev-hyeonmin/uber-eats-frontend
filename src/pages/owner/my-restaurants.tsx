import { gql, useQuery } from "@apollo/client"
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { client } from "../../apollo";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaruants } from "../../__generated__/myRestaruants";

export const MY_RESTAURANTS_QUERY = gql`
    query myRestaruants {
        myRestaurants {
            ok
            error
            restaurants {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
    const { data } = useQuery<myRestaruants>(MY_RESTAURANTS_QUERY); 

    return (
        <div>
            <Helmet>
                <title>My Restaurants | Nuber Eats</title>
            </Helmet>
            <div className="max-w-screen-2xl mx-auto mt-32">
                <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
                {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
                <>
                    <h4 className="text-xl mb-5">You have no restaurants.</h4>
                    <Link
                    className="text-lime-600 hover:underline"
                    to="/add-restaurant"
                    >
                    Create one &rarr;
                    </Link>
                </>
                ) : (
                <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                    {data?.myRestaurants.restaurants.map((restaurant) => (
                        <Restaurant
                            key={restaurant.id}
                            id={restaurant.id + ""}
                            name={restaurant.name}
                            coverImg={restaurant.coverImage}
                            categoryName={restaurant.category?.name}
                        />
                    ))}
                </div>
                )}
            </div>
        </div>
    )
}