import Wallet from './Wallet';
import { Link } from 'react-router-dom';
export default function Menu() {

    return (
        <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-[#161b22]">
            <div className="flex items-center space-x-4">
                <img
                    alt="VeChain Logo"
                    className="h-10"
                    height="40"
                    src="/placeholder.svg"
                    style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                    }}
                    width="40"
                />
                <h1 className="text-xl font-bold">VeChain Slayers Guild</h1>
            </div>
            <div className="flex items-center space-x-8">
                <Link to='/' className="block text-white hover:text-gray-300">
                    Home
                </Link>
                <Link to='/my-slayer' className="block text-white hover:text-gray-300">
                    My Slayer
                </Link>
                <Link to='/gallery' className="block text-white hover:text-gray-300">
                    Slayer Gallery
                </Link>
                <Link to='/altar' className="block text-white hover:text-gray-300">
                    Altar of Sacrifice
                </Link>
                <Link to='/about' className="block text-white hover:text-gray-300">
                    About
                </Link>
                <div>
                    <Wallet />
                </div>
            </div>
        </nav>
    )
}