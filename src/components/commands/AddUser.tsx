import React, { useContext} from "react";
import { termContext } from "../Terminal";
//import { useUser } from "../../hooks/useUsers";
//import UserCollection from "../../../public/Users.json"
//import { set } from "lodash";

const AddUser: React.FC = () => {
    const { arg } = useContext(termContext);


    return (
        <div>
            <h1>Create an account as {arg[0]}</h1>
        </div>
    )
}

export default AddUser;