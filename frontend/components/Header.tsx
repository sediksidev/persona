import Link from "next/link";

interface HeaderProps {
    currentPage?: "home" | "register" | "use-cases" | "how-to";
    containerWidth?: string;
}

export default function Header({ currentPage, containerWidth = "max-w-7xl" }: HeaderProps) {
    return (
        <header className="border-b border-gray-200 bg-white">
            <nav className={`mx-auto flex ${containerWidth} items-center justify-between px-6 py-3`}>
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                        <span className="font-semibold text-white">P</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Persona</span>
                </Link>
                <div className="flex gap-2">
                    <Link
                        href="/register"
                        className={`rounded px-3 py-1.5 text-sm font-medium ${currentPage === "register"
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Demo
                    </Link>
                    <Link
                        href="/use-cases"
                        className={`rounded px-3 py-1.5 text-sm font-medium ${currentPage === "use-cases"
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Examples
                    </Link>
                    <Link
                        href="/how-to"
                        className={`rounded px-3 py-1.5 text-sm font-medium ${currentPage === "how-to"
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        How to
                    </Link>
                </div>
            </nav>
        </header>
    );
}
