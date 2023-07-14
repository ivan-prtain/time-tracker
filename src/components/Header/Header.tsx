import { signOut } from "firebase/auth"
import { auth } from "../../FirebaseConfig"
import DevotLogo from "../../assets/svgs/devot-logo.svg"
import { Link, useLocation } from "react-router-dom"

import "./Header.scss"
import { useEffect, useState } from "react"

type HeaderProps = {
    isLogged: boolean
}

const Header = ({ isLogged }: HeaderProps) => {

    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    const location = useLocation()

    useEffect(() => {
        console.log("location change", location.pathname)
        setCurrentPath(location.pathname)
    }, [location])



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
            <div className="header__links">
                <span className="header__link-wrapper">
                    <i className="pi pi-clock"></i>
                    <Link to={"/"}>Trackers</Link>
                </span>
                <span className="header__link-wrapper">
                    <i className="pi pi-history"></i>
                    <Link to={"/history"}>History</Link>
                </span>
                <div className="header__links-highlight">
                    <span className={currentPath === "/" ? "header__links-highlight--active" : ""}></span>
                    <span className={currentPath === "/history" ? "header__links-highlight--active" : ""}></span>
                </div>
            </div>
            {isLogged && <button className="header__logout-btn" onClick={logOut}>Logout</button>}
        </div >
    )
}

export default Header