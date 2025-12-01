interface FooterProps {
    containerWidth?: string;
}

export default function Footer({ containerWidth = "max-w-7xl" }: FooterProps) {
    return (
        <footer className="border-t border-gray-200 bg-white py-6">
            <div className={`mx-auto ${containerWidth} px-6 text-center`}>
                <p className="text-sm text-gray-600">Persona Protocol • 2025</p>
            </div>
        </footer>
    );
}
