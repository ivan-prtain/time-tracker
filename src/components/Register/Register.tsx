import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FirebaseConfig.ts";

import "./Register.css"

type UserInfoType = {
    email: string
    password: string
}

const RegisterForm = () => {


    const navigate = useNavigate()

    const createUser = async (userInfo: UserInfoType) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
            const user = userCredential.user
            if (user) {
                alert("Registration successful")
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const validatePassword = (password: string) => {
        //validate password for at least one letter and one number
        const validFormat = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/
        return validFormat.test(password)

    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")
        console.log(email, password)
        if (validatePassword(password as string)) {
            createUser({ email: email as string, password: password as string })
        } else {
            alert("Password must contain at least one letter and one number and length of at least 6 characters")
        }
        //createUser({ email: email as string, password: password as string })
    }

    return (
        <div className="register-form-container">
            <h1>Register Form</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <input placeholder="Email" type="email" name="email" required />
                <input placeholder="Password" type="password" name="password" required />
                <button type="submit">Submit registration</button>
            </form>
        </div>
    )
}

export default RegisterForm