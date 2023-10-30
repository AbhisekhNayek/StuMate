import React from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

// Custom hook for toggling password visibility
const usePasswordToggler = () => {
    const [visible, setVisibility] = React.useState(false)

    // Toggle password visibility icon
    const Icon = (
        visible ? <AiOutlineEye onClick={() => setVisibility(false)} /> : <AiOutlineEyeInvisible onClick={() => setVisibility(true)} />
    )

    // Determine input type based on visibility
    const inputType = visible ? "text" : "password"

    return [Icon, inputType]
}

export default usePasswordToggler;
