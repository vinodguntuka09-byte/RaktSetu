import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="min-h-[71vh] flex items-center justify-center bg-red-50">

      <div className="text-center max-w-4xl">

        <h1 className="text-6xl font-bold text-gray-900 leading-tight">

          Connecting

          <span className="text-red-600">
            {" "}Hospitals{" "}
          </span>

          With

          <span className="text-red-600">
            {" "}Life Saving Donors
          </span>

        </h1>

        <p className="mt-8 text-xl text-gray-600">

          RaktSetu instantly alerts nearby eligible blood donors
          through SMS and WhatsApp during medical emergencies.

        </p>

        <div className="mt-10 flex justify-center gap-6">

          <Link
            to="/hospital-login"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Hospital Login
          </Link>

          <Link
            to="/donor-register"
            className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Register as Donor
          </Link>

        </div>

      </div>

    </section>
  );
}