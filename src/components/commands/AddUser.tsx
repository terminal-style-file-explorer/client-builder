import React, { useContext} from "react";
import { termContext } from "../Terminal";


const AddUser:React.FC = () => {
    const {arg} =useContext(termContext);

    return(
        <div>
            <h1>Create an account as {arg[0]}</h1>
        </div>
    )
}

export default AddUser;