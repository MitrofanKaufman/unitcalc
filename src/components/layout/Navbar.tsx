import { Button } from "../ui/Button";

export const Navbar = () => {
    return (
        <nav className="flex justify-between items-center h-16 px-4 bg-blue-600 text-white">
            <div className="font-bold text-lg">MyBrand</div>
            <div className="hidden md:flex space-x-4">
                <Button variant="outline">Главная</Button>
                <Button variant="outline">О нас</Button>
                <Button variant="outline">Услуги</Button>
                <Button variant="outline">Контакты</Button>
            </div>
        </nav>
    );
};
