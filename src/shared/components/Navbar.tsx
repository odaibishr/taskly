import Logo from "../../assets/Logo.svg";

export default function Navbar() {
    return (
        <nav className="w-full bg-background mb-15 px-10 fixed">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
                <img src={Logo} alt="Taskly Logo" className="h-7 mr-2" />
            </div>
        </nav>
    )
}