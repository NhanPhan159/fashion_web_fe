import { supabase } from "@/utils/supabase";
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setMessage(error.message);
            setEmail("");
            setPassword("");
            return;
        }

        if (data) {
            navigate("/dashboard");
            return null;
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <br></br>
            {message && <span>{message}</span>}
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Email"
                    required
                />
                <br />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Password"
                    required
                />
                <br />
                <button type="submit">Log in</button>
            </form>
            <span>Don't have an account?</span>
            <Link to="/auth/register">Register.</Link>
        </div>
    );
}

export default Login;