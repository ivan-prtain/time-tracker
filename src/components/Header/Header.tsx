import { signOut } from "firebase/auth"
import { auth } from "../../FirebaseConfig"
import DevotLogo from "../../assets/svgs/devot-logo.svg"
import { Link, useLocation, useNavigate } from "react-router-dom"

import "./Header.scss"
import { useEffect, useState } from "react"

type HeaderProps = {
    isLogged: boolean
}

const Header = ({ isLogged }: HeaderProps) => {

    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    const location = useLocation()
    const navigate = useNavigate()


    useEffect(() => {
        console.log("location change", location.pathname)
        setCurrentPath(location.pathname)
    }, [location])



    const logOut = async () => {
        try {
            await signOut(auth)
            navigate("/")
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
            {isLogged &&
                <>

                    <div className="header__links">
                        <span className="header__link-wrapper">
                            <i className="pi pi-clock"></i>
                            <Link className={currentPath === "/" ? "header__link--active" : ""} to={"/"}>Trackers</Link>
                        </span>
                        <span className="header__link-wrapper">
                            <i className="pi pi-history"></i>
                            <Link className={currentPath === "/history" ? "header__link--active" : ""} to={"/history"}>History</Link>
                        </span>
                        <div className="header__links-highlight">
                            <span className={currentPath === "/" ? "header__links-highlight--active" : ""}></span>
                            <span className={currentPath === "/history" ? "header__links-highlight--active" : ""}></span>
                        </div>
                    </div>
                    <span className="header__link-wrapper">

                        <button className="header__logout-btn" onClick={logOut}>
                            <i className="pi pi-power-off"></i>
                            <span className="header__logout-btn-txt">Logout</span></button>
                    </span>
                </>
            }
        </div >
    )
}

export default Header