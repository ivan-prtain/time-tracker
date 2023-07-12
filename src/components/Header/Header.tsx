import { signOut } from "firebase/auth"
import { auth } from "../../FirebaseConfig"
import DevotLogo from "../../assets/svgs/devot-logo.svg"

import "./Header.scss"

type HeaderProps = {
    isLogged: boolean
}

const Header = ({ isLogged }: HeaderProps) => {
    const logOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="header">
            <div className="header__logo-wrapper">

                <img className="header__logo" src={DevotLogo} alt="" />
                <span>Tracking tool</span>
            </div>
            {isLogged && <button className="header__logout-btn" onClick={logOut}>Logout</button>}
        </div >
    )
}

export default Header