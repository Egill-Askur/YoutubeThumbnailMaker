import React from "react";
import { useInput } from "./inputContext";

const InputField = () => {
    const { inputValue, setInputValue, inputValue2, setInputValue2 } = useInput()

    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Insert tournament name..."
            />

                <input 
                type="text"
                value={inputValue2}
                onChange={(e) => setInputValue2(e.target.value)}
                placeholder="Insert tournament date..."
            />
        </div>
    );
};

export default InputField;