import React, { useEffect, useRef, useState, forwardRef } from "react";

const CustomSelect = forwardRef(({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    showClear = false,
    classNames,
    isDisabled = false,
    prefix = "",
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        if (!isDisabled) {
            const selectedValue = typeof option === "string" ? option : option.value;
            onChange(selectedValue);
            setIsOpen(false);
        }
    };

    const handleClear = (event) => {
        event.stopPropagation();
        if (!isDisabled) {
            onChange("");
        }
    };

    return (
        <div ref={ref || selectRef} className={`relative ${classNames}`}>
            <div
                className={`font-medium text-black bg-white border rounded-md py-2 px-4 flex justify-between items-center text-sm h-10
          ${isDisabled ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300" : "cursor-pointer border-gray-300"}`}
                onClick={() => !isDisabled && setIsOpen((prev) => !prev)}
            >
                <span
                    className={`${!value ? 'text-gray-400' : 'text-black'
                        } inline-block whitespace-nowrap`}
                    style={{ minWidth: '120px' }}
                >
                    {(() => {
                        const selectedOption = options.find(opt =>
                            typeof opt === 'string' ? opt === value : opt.value === value
                        );

                        return selectedOption
                            ? `${prefix}${typeof selectedOption === 'string' ? selectedOption : selectedOption.label}`
                            : placeholder;
                    })()}
                </span>

                {showClear && value && !isDisabled ? (
                    <svg /* close icon */ onClick={handleClear} />
                ) : (
                    <svg /* down arrow icon */ />
                )}
            </div>

            {isOpen && !isDisabled && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-10 shadow-lg">
                    {options.map((option, index) => {
                        const label = typeof option === "string" ? option : option.label;
                        return (
                            <li
                                key={index}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer transition-all"
                                onClick={() => handleSelect(option)}
                            >
                                {label}
                            </li>
                        );
                    })}
                </ul>
            )}

            {isDisabled && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(243, 244, 246, 0.6)",
                        cursor: "not-allowed",
                        zIndex: 10,
                        borderRadius: "inherit",
                    }}
                    aria-hidden="true"
                />
            )}
        </div>
    );
});

export default CustomSelect;