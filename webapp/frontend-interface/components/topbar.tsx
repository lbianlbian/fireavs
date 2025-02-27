import Link from "next/link";

function Navbar(){
    return (
        <header className="fixed w-full top-0 bg-black/30 backdrop-blur-sm border-b border-orange-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex-none">
            <Link href="/" className="text-orange-500 font-bold text-xl hover:text-orange-400 transition-colors">
            BlazeSentry AVS
            </Link>
            </div>
            <nav className="hidden md:flex gap-4 ml-auto">
            {" "}
            <Link href="/form" className="px-4 py-2 text-white hover:text-orange-400 transition-colors">
                Verify Fire Data 
            </Link>
            <Link href="https://x.com/BlazeSentry_AVS" className="px-4 py-2 text-white hover:text-orange-400 transition-colors">
                Twitter Updates 
            </Link>
            </nav>
            {/* Mobile menu button would go here */}
        </div>
        </header>
    );
}

export default Navbar;