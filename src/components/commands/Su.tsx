import React, { useContext} from "react";
import { termContext } from "../Terminal";


const Su:React.FC = () => {
    const {arg} =useContext(termContext);

    return(
        <div>
            <h1>user changed as {arg[0]}</h1>
        </div>
    )
}

export default Su;