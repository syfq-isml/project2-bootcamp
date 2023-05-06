import React, { useState, useEffect, useContext } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

import { ref as dbRef, push } from "firebase/database";
import { database } from "../firebase";

const DB_USERINFO_KEY = "user_info";

function CreateProfile() {
    const navigate = useNavigate();
    const [state, setState] = useState({ displayName: "" });
    const context = useContext(UserContext);
    const userInfoRef = dbRef(database, DB_USERINFO_KEY);

    //   useEffect(() => {
    //       if (context.loggedInUser != null) {
    //           navigate("/");
    //       }
    //   }, [context.loggedInUser]);

    const addUserName = (displayName) => {
        const auth = getAuth();
        const user = auth.currentUser;
        const userInfo = {
            displayName: state.displayName,
            email: user.email,
        };

        return updateProfile(user, {
            displayName,
        })
            .then(() => {
                push(userInfoRef, userInfo);
            })
            .then(() => {
                console.log("Profile updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        addUserName(state.displayName).then(() => {
            navigate("/");
        });
    };

    const handleChange = (e) => {
        setState({ ...state, [e.target.id]: e.target.value });
        console.log(state);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={state.displayName}
                    id="displayName"
                    type="displayName"
                    placeholder="enter your username here"
                    onChange={handleChange}
                ></input>

                <button type="submit">Submit Username</button>
            </form>
        </div>
    );
}
export default CreateProfile;
