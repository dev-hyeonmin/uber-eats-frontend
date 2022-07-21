import React, { FC } from "react";

interface IDishOptionsProps {
    dishId: number;
    optionName: string;
    extra?: number | null;
    isSelected: boolean;
    addOptionToItem: (dishId: number, optionName: string) => void;
    removeOptionFormItem: (dishId: number, optionName: string) => void;
}

export const DishOptiops: React.FC<IDishOptionsProps> = ({
    dishId,
    optionName,
    extra,
    isSelected,
    addOptionToItem,
    removeOptionFormItem

}) => {
    const onClick = () => {
        if (isSelected) {
            removeOptionFormItem(dishId, optionName);
        } else {
            addOptionToItem(dishId, optionName);
        }
    }

    return (
        <span
            onClick={onClick}
            className={`flex border items-center ${
                isSelected
                ? "border-gray-800"
                : ""
            }`}
        >
            <h6 className="mr-2">{optionName}</h6>
            {extra && <h6 className="text-sm opacity-75">(${extra})</h6>}
        </span>
    );
}