import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-12 py-5 shadow-md bg-white sticky top-0 z-50">
      <h1 className="text-3xl font-bold text-red-600">
        🩸 RaktSetu
      </h1>

      <div className="flex gap-6">

        <Link
          to="/hospital-login"
          className="text-Black px-5 py-2"
        >
          Hospital Login
        </Link>

        <Link
          to="/donor-register"
          className="text-Black px-5 py-3"
        >
          Become Donor
        </Link>

      </div>
    </nav>
  );
}